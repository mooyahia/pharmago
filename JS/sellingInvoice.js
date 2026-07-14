
// ================= API =================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

async function apiRequest(url, method = "GET", data = null) {
  try {
    const res = await fetch(API_BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: data ? JSON.stringify(data) : null,
    });

    const text = await res.text();

    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      console.error("INVALID JSON:", text);
      return { ok: false, data: null };
    }

    return { ok: res.ok, data: json };
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return { ok: false, data: null };
  }
}

// ================= STATE =================
let products = [];
let customers = [];
let invoiceItems = [];

// ================= ELEMENTS =================
const productsTableBody = document.getElementById("productsTableBody");
const invoiceBody = document.getElementById("invoiceBody");

const searchByCode = document.getElementById("searchByCode");
const searchByName = document.getElementById("searchByName");

const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const subtotalEl = document.getElementById("subtotal");
const countItems = document.getElementById("countItems");

const customerInput = document.querySelector('input[list="clientsList"]');
const clientsList = document.getElementById("clientsList");

const invoiceType = document.getElementById("invoiceType");
const saveBtn = document.querySelector(".btn-save");

// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  await loadCustomers();
  renderInvoice();
});

// ================= SAFE LIST =================
function safeList(res) {
  const d = res?.data;
  return d?.data || d || [];
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const res = await apiRequest("stocks/products/?in_stock=true");

  if (!res.ok) {
    products = [];
    renderProducts([]);
    return;
  }

  const list = safeList(res);
  products = Array.isArray(list) ? list : [];

  renderProducts(products);
}

// ================= LOAD CUSTOMERS =================
async function loadCustomers() {
  const res = await apiRequest("sell_invoice/customers/");

  if (!res.ok) return;

  const list = safeList(res);
  customers = Array.isArray(list) ? list : [];

  clientsList.innerHTML = customers
    .map(c => `<option value="${c.name}"></option>`)
    .join("");
}

// ================= RENDER PRODUCTS =================
function renderProducts(list) {
  list = Array.isArray(list) ? list : [];

  productsTableBody.innerHTML = "";

  if (!list.length) {
    productsTableBody.innerHTML =
      `<tr><td colspan="4">لا يوجد منتجات</td></tr>`;
    return;
  }

  list.forEach(p => {
    const tr = document.createElement("tr");

    tr.dataset.id = p.id;

    tr.innerHTML = `
      <td>${p.id ?? ""}</td>
      <td>${p.trade_name ?? ""}</td>
      <td>${Number(p.sell_price || 0)}</td>
      <td><button onclick="addItem(${p.id})">إضافة</button></td>
    `;

    // ===== SELECT ROW =====
    tr.addEventListener("click", () => {
      document.querySelectorAll("#productsTableBody tr")
        .forEach(r => r.classList.remove("selected"));

      tr.classList.add("selected");
    });

    productsTableBody.appendChild(tr);
  });
}

// ================= ADD ITEM =================
window.addItem = function (id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const price = Number(product.sell_price) || 0;

  const exist = invoiceItems.find(i => i.product === id);

  if (exist) {
    exist.quantity += 1;
  } else {
    invoiceItems.push({
      product: product.id,
      name: product.trade_name || "",
      quantity: 1,
      price: price,
    });
  }

  renderInvoice();
};

// ================= RENDER INVOICE =================
function renderInvoice() {
  invoiceBody.innerHTML = "";

  let subtotal = 0;

  invoiceItems.forEach((item, index) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    const lineTotal = qty * price;

    subtotal += lineTotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.product}</td>
      <td>${item.name}</td>
      <td>
        <input type="number" value="${qty}" onchange="updateQty(${index}, this.value)">
      </td>
      <td>${price}</td>
      <td><button onclick="removeItem(${index})">X</button></td>
    `;

    invoiceBody.appendChild(tr);
  });

  const discount = Number(discountEl?.value || 0);
  const net = subtotal - discount;

  countItems.innerText = invoiceItems.length;
  subtotalEl.innerText = subtotal.toFixed(2);
  totalEl.innerText = net.toFixed(2);
}

// ================= UPDATE QTY =================
window.updateQty = function (i, val) {
  val = Number(val);
  if (val <= 0) return;

  invoiceItems[i].quantity = val;
  renderInvoice();
};

// ================= REMOVE ITEM =================
window.removeItem = function (i) {
  invoiceItems.splice(i, 1);
  renderInvoice();
};

// ================= SAVE INVOICE =================
saveBtn.addEventListener("click", async () => {
  if (!invoiceItems.length) {
    alert("لا توجد أصناف");
    return;
  }

  const customer = customers.find(
    c => c.name === customerInput.value
  );

  const subtotal = invoiceItems.reduce(
    (a, b) => a + (b.quantity * b.price),
    0
  );

  const discount = Number(discountEl?.value || 0);
  const net = subtotal - discount;

  const payload = {
    customer: customer?.id || null,
    invoice_type: "sell",
    invoice_no: "INV-" + Date.now(),

    total_amount: subtotal,
    discount: discount,
    net_amount: net,
    paid_amount: net,

    payment_type: invoiceType?.value || "cash",

    items: invoiceItems.map(i => ({
      product: i.product,
      quantity: Number(i.quantity),
      price: Number(i.price),
      subtotal: Number(i.quantity * i.price)
    }))
  };

  const res = await apiRequest("sell_invoice/sales/", "POST", payload);

  if (!res.ok) {
    alert(res.data.message);
    return;
  }

  alert("تم الحفظ بنجاح");

  invoiceItems = [];
  renderInvoice();
});

// ================= SEARCH =================
searchByCode?.addEventListener("input", () => {
  const v = searchByCode.value.trim();
  renderProducts(
    v ? products.filter(p => String(p.id).includes(v)) : products
  );
});

searchByName?.addEventListener("input", () => {
  const v = searchByName.value.trim();
  renderProducts(
    v ? products.filter(p => (p.trade_name || "").includes(v)) : products
  );
});

// ================= DISCOUNT =================
discountEl?.addEventListener("input", renderInvoice);

// ================= ACTION BUTTONS =================

// ADD PRODUCT
document.querySelector('[data-action="add-item"]')?.addEventListener("click", () => {
  sessionStorage.removeItem("editProductId");
  window.open("addProduct.html", "_blank");
});

// EDIT PRODUCT (FIXED)
document.querySelector('[data-action="edit-item"]')?.addEventListener("click", () => {

  const selected = document.querySelector("#productsTableBody tr.selected");

  if (!selected) {
    alert("اختار صنف الأول");
    return;
  }

  const productId = selected.dataset.id;

  sessionStorage.setItem("editProductId", productId);
  window.open("addProduct.html", "_blank");
});

// CREATE INVOICE
document.querySelector('[data-action="create-invoice"]')?.addEventListener("click", () => {
  window.open("purchaseInvoice.html", "_blank");
});

// DELETE ALL
document.querySelector(".btn-delete")?.addEventListener("click", () => {
  invoiceItems = [];
  renderInvoice();
});

// PRINT
document.querySelector(".btn-print")?.addEventListener("click", () => {
  window.print();
});