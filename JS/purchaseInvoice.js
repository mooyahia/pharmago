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

    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      console.error("Invalid JSON:", text);
      return null;
    }

    if (!res.ok) {
      console.error("API ERROR:", json);
      alert(JSON.stringify(json));
      return null;
    }

    return json;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return null;
  }
}

// ================= STATE =================
let products = [];
let invoiceItems = [];

// ================= ELEMENTS =================
const supplierSelect = document.getElementById("suppliersSelect");
const searchCode = document.getElementById("searchByCode");
const searchName = document.getElementById("searchByName");

const productsTableBody = document.getElementById("productsTableBody");
const invoiceBody = document.getElementById("invoiceBody");

const totalEl = document.getElementById("total");
const countEl = document.getElementById("countItems");

const invoiceNumberEl = document.querySelector("input.form-control");
const paymentStatusEl = document.querySelector("select.form-control");

// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  await loadSuppliers();
  await loadProducts();
  bindSearch();
});

// ================= SUPPLIERS =================
async function loadSuppliers() {
  const res = await apiRequest("buy_invoice/suppliers/");
  const data = res?.data || [];

  supplierSelect.innerHTML = `<option value="">اختر المورد</option>`;

  data.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.supplier_name;
    supplierSelect.appendChild(opt);
  });
}

// ================= PRODUCTS =================
async function loadProducts() {
  const res = await apiRequest("stocks/products/");
  products = res?.data || res || [];
  renderProducts(products);
}

// ================= SEARCH =================
function bindSearch() {
  searchCode?.addEventListener("input", filterProducts);
  searchName?.addEventListener("input", filterProducts);
}

function filterProducts() {
  const code = searchCode.value.trim();
  const name = searchName.value.trim();

  let filtered = products;

  if (code) {
    filtered = filtered.filter(p =>
      String(p.id).includes(code)
    );
  }

  if (name) {
    filtered = filtered.filter(p =>
      (p.trade_name || "").toLowerCase().includes(name.toLowerCase())
    );
  }

  renderProducts(filtered);
}

// ================= PRODUCTS TABLE =================
function renderProducts(list) {
  productsTableBody.innerHTML = "";

  list.forEach(p => {
    const tr = document.createElement("tr");

    tr.dataset.id = p.id;

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.trade_name || ""}</td>
      <td>${p.buy_price || 0}</td>
      <td><button class="addBtn">+</button></td>
    `;

    // ➕ إضافة للفاتورة
    tr.querySelector(".addBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToInvoice(p);
    });

    // ✅ اختيار الصف للتعديل
    tr.addEventListener("click", () => {
      document.querySelectorAll("#productsTableBody tr")
        .forEach(r => r.classList.remove("selected"));

      tr.classList.add("selected");
    });

    productsTableBody.appendChild(tr);
  });
}

// ================= ADD TO INVOICE =================
function addToInvoice(product) {
  const exist = invoiceItems.find(i => i.product.id === product.id);

  if (exist) {
    exist.quantity += 1;
  } else {
    invoiceItems.push({
      product,
      quantity: 1,
      expiry_date: "",
      buy_price: product.buy_price || 0,
      sell_price: product.sell_price || 0
    });
  }

  renderInvoice();
}

// ================= RENDER INVOICE =================
function renderInvoice() {
  invoiceBody.innerHTML = "";

  invoiceItems.forEach((item, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.product.id}</td>
      <td>${item.product.trade_name}</td>

      <td><input type="number" value="${item.quantity}" data-i="${i}" class="qty"></td>

      <td><input type="date" value="${item.expiry_date}" data-i="${i}" class="exp"></td>

      <td><input type="number" value="${item.buy_price}" data-i="${i}" class="buy"></td>

      <td><input type="number" value="${item.sell_price}" data-i="${i}" class="sell"></td>

      <td><button class="del" data-i="${i}">X</button></td>
    `;

    invoiceBody.appendChild(tr);
  });

  updateTotals();
  bindEvents();
}

// ================= TOTALS =================
function updateTotals() {
  let total = 0;

  invoiceItems.forEach(i => {
    total += (i.quantity || 0) * (i.buy_price || 0);
  });

  if (totalEl) totalEl.textContent = total.toFixed(2);
  if (countEl) countEl.textContent = invoiceItems.length;
}

// ================= EVENTS =================
function bindEvents() {

  document.querySelectorAll(".qty").forEach(el => {
    el.oninput = e => {
      const i = e.target.dataset.i;
      invoiceItems[i].quantity = +e.target.value || 1;
      updateTotals();
    };
  });

  document.querySelectorAll(".exp").forEach(el => {
    el.onchange = e => {
      const i = e.target.dataset.i;
      invoiceItems[i].expiry_date = e.target.value;
    };
  });

  document.querySelectorAll(".buy").forEach(el => {
    el.oninput = e => {
      const i = e.target.dataset.i;
      invoiceItems[i].buy_price = +e.target.value || 0;
      updateTotals();
    };
  });

  document.querySelectorAll(".sell").forEach(el => {
    el.oninput = e => {
      const i = e.target.dataset.i;
      invoiceItems[i].sell_price = +e.target.value || 0;
    };
  });

  document.querySelectorAll(".del").forEach(el => {
    el.onclick = e => {
      const i = e.target.dataset.i;
      invoiceItems.splice(i, 1);
      renderInvoice();
    };
  });
}

// ================= SAVE =================
document.querySelector(".btn-save")?.addEventListener("click", async () => {

  if (!invoiceItems.length) {
    alert("لازم تضيف أصناف ❌");
    return;
  }

  const total = invoiceItems.reduce((sum, i) => {
    return sum + (i.quantity * i.buy_price);
  }, 0);

  const payload = {
    supplier: parseInt(supplierSelect.value),
    invoice_number: invoiceNumberEl?.value,
    total_amount: total,
    payment_status: paymentStatusEl?.value,
    purchase_date: new Date().toISOString(),

    items: invoiceItems.map(i => ({
      product: i.product.id,
      expiry_date: i.expiry_date,
      quantity: i.quantity,
      unit_price: i.sell_price,
      cost_price: i.buy_price,
      subtotal: i.quantity * i.buy_price
    }))
  };

  const res = await apiRequest("buy_invoice/purchases/", "POST", payload);

  if (res) {
    alert("تم حفظ الفاتورة ✅");
    invoiceItems = [];
    renderInvoice();
  }
});

// ================= CLEAR =================
document.querySelector(".btn-delete")?.addEventListener("click", () => {
  invoiceItems = [];
  renderInvoice();
});

// ================= PRINT =================
document.querySelector(".btn-print")?.addEventListener("click", () => {
  window.print();
});

// ================= ACTION BUTTONS =================
document.querySelector(".actions")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  if (btn.classList.contains("btn-new")) {
    const action = btn.dataset.action;

    switch (action) {
      case "add-item":
        sessionStorage.removeItem("editProductId");
        window.open("addProduct.html", "_blank");
        break;

      case "edit-item":
        const selectedRow = document.querySelector("#productsTableBody tr.selected");

        if (!selectedRow) {
          alert("اختار صنف من الجدول ❌");
          return;
        }

        const productId = selectedRow.dataset.id;

        sessionStorage.setItem("editProductId", productId);
        window.open("addProduct.html", "_blank");
        break;

      case "create-invoice":
        window.open("purchaseInvoice.html", "_blank");
        break;
    }
  }
});