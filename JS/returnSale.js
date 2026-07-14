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
let invoice = null;
let invoiceItems = [];

// ================= ELEMENTS =================
const productsTableBody = document.getElementById("searchResults");
const invoiceBody = document.getElementById("invoiceBody");
const searchByCode = document.getElementById("searchByCode");
const searchByName = document.getElementById("searchByName");
const invoiceNumberEl = document.getElementById("invoiceNumber");
const clientSelect = document.getElementById("clientSelect");
const invoiceType = document.getElementById("invoiceType");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const countItems = document.getElementById("countItems");
const discountEl = document.getElementById("discount");

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
  const res = await apiRequest("stocks/products/");
  if (!res.ok) { products = []; renderProducts([]); return; }

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

  if (clientSelect) {
    clientSelect.innerHTML =
      `<option value="">اختر العميل...</option>` +
      customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }
}

// ================= RENDER PRODUCTS =================
function renderProducts(list) {
  list = Array.isArray(list) ? list : [];
  if (!productsTableBody) return;

  productsTableBody.innerHTML = "";

  if (!list.length) {
    productsTableBody.innerHTML = `<tr><td colspan="5">لا يوجد منتجات</td></tr>`;
    return;
  }

  list.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;

    tr.innerHTML = `
      <td>${p.id ?? ""}</td>
      <td>${p.trade_name ?? ""}</td>
      <td>${Number(p.sell_price || 0)}</td>
      <td>${p.current_stock}</td>
      <td><button onclick="addItem(${p.id})">إضافة</button></td>
    `;

    tr.addEventListener("click", () => {
      document.querySelectorAll("#searchResults tr").forEach(r => r.classList.remove("selected"));
      tr.classList.add("selected");
    });

    productsTableBody.appendChild(tr);
  });
}

// ================= SEARCH INVOICE =================
invoiceNumberEl?.addEventListener("change", async () => {
  const id = invoiceNumberEl.value.trim();
  if (!id) return;

  const res = await apiRequest(`sell_invoice/sales/?id=${id}`);

  if (!res.ok || !res.data) {
    alert("الفاتورة غير موجودة");
    return;
  }

  const data = res.data?.data || res.data;
  invoice = data;

  // ضبط العميل ونوع الفاتورة
  if (clientSelect && data.customer) {
    clientSelect.value = data.customer;
  }
  if (invoiceType && data.payment_type) {
    invoiceType.value = data.payment_type;
  }
  if (discountEl && data.discount !== undefined) {
    discountEl.value = data.discount;
  }

  // تحميل أصناف الفاتورة
  invoiceItems = (data.items || []).map(i => {
    const product = products.find(p => p.id === i.product);
    return {
      product: i.product,
      name: product?.trade_name || `صنف #${i.product}`,
      quantity: Number(i.quantity || 0),
      price: Number(i.price || product?.sell_price || 0),
      returned: false
    };
  });

  renderInvoice();
});

// ================= ADD ITEM (يضيف للجدول مباشرة) =================
window.addItem = function (id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const exist = invoiceItems.find(i => i.product === id);
  if (exist) {
    exist.quantity += 1;
  } else {
    invoiceItems.push({
      product: product.id,
      name: product.trade_name || "",
      quantity: 1,
      price: Number(product.sell_price || 0),
      returned: false
    });
  }

  renderInvoice();
};

// ================= RENDER INVOICE =================
function renderInvoice() {
  if (!invoiceBody) return;

  invoiceBody.innerHTML = "";
  let subtotal = 0;

  invoiceItems.forEach((item, index) => {
    // الأصناف المعيَّنة كمرتجع لا تُحسب في الإجمالي
    if (!item.returned) {
      subtotal += Number(item.quantity || 0) * Number(item.price || 0);
    }

    const tr = document.createElement("tr");
    if (item.returned) tr.style.opacity = "0.45";

    tr.innerHTML = `
      <td>${item.product}</td>
      <td>${item.name}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}"
          onchange="updateQty(${index}, this.value)" />
      </td>
      <td>${Number(item.price).toFixed(2)}</td>
      <td>
        <button onclick="toggleReturn(${index})" style="${item.returned ? 'background:#ef4444' : ''}">
          ${item.returned ? "إلغاء المرتجع" : "تعيين كمرتجع"}
        </button>
      </td>
    `;

    invoiceBody.appendChild(tr);
  });

  const discount = Number(discountEl?.value || 0);
  const net = Math.max(0, subtotal - discount);

  if (countItems) countItems.innerText = invoiceItems.length;
  if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
  if (totalEl) totalEl.innerText = net.toFixed(2);
}

// ================= UPDATE QTY =================
window.updateQty = function (i, val) {
  val = Number(val);
  if (val <= 0) return;
  invoiceItems[i].quantity = val;
  renderInvoice();
};

// ================= TOGGLE RETURN (يحذف الصنف فعلياً) =================
window.toggleReturn = function (i) {
  // بدل ما نعلّم → نحذف مباشرة
  invoiceItems.splice(i, 1);
  renderInvoice();
};

// ================= SEARCH =================
searchByCode?.addEventListener("input", () => {
  const v = searchByCode.value.trim();
  renderProducts(v ? products.filter(p => String(p.id).includes(v)) : products);
});

searchByName?.addEventListener("input", () => {
  const v = searchByName.value.trim();
  renderProducts(v ? products.filter(p => (p.trade_name || "").includes(v)) : products);
});

// ================= DISCOUNT =================
discountEl?.addEventListener("input", renderInvoice);

// ================= ACTION BUTTONS =================
window.addEventListener("DOMContentLoaded", () => {

  // إضافة صنف جديد
  document.querySelector('[data-action="add-item"]')?.addEventListener("click", () => {
    sessionStorage.removeItem("editProductId");
    window.open("addProduct.html", "_blank");
  });

  // تعديل كارت صنف → لازم تختار صنف من جدول البحث
  document.querySelector('[data-action="edit-item"]')?.addEventListener("click", () => {
    const selected = document.querySelector("#searchResults tr.selected");
    if (!selected) {
      alert("اختار صنف من الجدول أولاً");
      return;
    }
    const productId = selected.dataset.id;
    sessionStorage.setItem("editProductId", productId);
    window.open("addProduct.html", "_blank");
  });

  // إنشاء → فاتورة بيع جديدة في تاب جديد
  document.querySelector('[data-action="create-invoice"]')?.addEventListener("click", () => {
    window.open("sellingInvoice.html", "_blank");
  });

  // حذف → ينظف الفاتورة
  document.querySelector(".btn-delete")?.addEventListener("click", () => {
    invoiceItems = [];
    invoice = null;
    if (invoiceNumberEl) invoiceNumberEl.value = "";
    if (discountEl) discountEl.value = "";
    renderInvoice();
  });

  // طباعة
  document.querySelector(".btn-print")?.addEventListener("click", () => {
    window.print();
  });

  // حفظ → بعت البيانات للباك
  document.querySelector(".btn-save")?.addEventListener("click", async () => {

    if (!invoiceItems.length) {
      alert("لا توجد أصناف في الفاتورة");
      return;
    }

    const subtotal = invoiceItems.reduce((a, b) => a + (b.quantity * b.price), 0);
    const discount = Number(discountEl?.value || 0);
    const net = Math.max(0, subtotal - discount);

    const customerId = clientSelect?.value ? Number(clientSelect.value) : null;

    const payload = {
      id: invoice?.id || null,
      customer: customerId,
      invoice_type: "return",
      invoice_no: invoice?.invoice_no || ("RET-" + Date.now()),
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

    const res = await apiRequest("sell_invoice/sales/", "PUT", payload);

    if (!res.ok) {
      const msg = res.data?.message;

if (typeof msg === "object") {
  alert(JSON.stringify(msg, null, 2));
} else {
  alert(msg || "حدث خطأ غير معروف");
}
      return;
    }

    alert("تم حفظ المرتجع بنجاح ✓");

    invoice = null;
    invoiceItems = [];
    if (invoiceNumberEl) invoiceNumberEl.value = "";
    if (discountEl) discountEl.value = "";
    renderInvoice();
  });
});