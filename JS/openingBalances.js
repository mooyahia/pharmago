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

// ================= ELEMENTS =================
const table = document.getElementById("itemsTable");
const countEl = document.getElementById("count");

const itemCodeInput = document.getElementById("itemCode");
const searchBtn = document.getElementById("searchBtn");

const addBtn = document.getElementById("addBtn");
const printBtn = document.getElementById("printBtn");

const modal = document.getElementById("addModal");
const closeModal = document.getElementById("closeModal");

const codeInput = document.getElementById("code");
const nameInput = document.getElementById("name");
const quantityInput = document.getElementById("quantity");
const expiryInput = document.getElementById("expiry");

const saveBtn = document.getElementById("saveButton");

// ================= INIT =================
window.addEventListener("DOMContentLoaded", loadProducts);

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  const res = await apiRequest("stocks/products/");

  products = res?.data || res || [];

  render(products);
}

// ================= RENDER =================
function render(list) {
  table.innerHTML = "";

  if (!list.length) {
    table.innerHTML = `<tr><td colspan="7">لا يوجد أصناف</td></tr>`;
    countEl.textContent = 0;
    return;
  }

  list.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.trade_name || ""}</td>
      <td>${p.sell_price || 0}</td>
      <td>${p.expiry_date}</td>
      <td>${p.current_stock || 0}</td>
      <td>${p.min_stock_limit || 0}</td>
    `;

    table.appendChild(tr);
  });

  countEl.textContent = list.length;
}

// ================= SEARCH =================
searchBtn.addEventListener("click", () => {
  const code = itemCodeInput.value.trim();

  if (!code) {
    render(products);
    return;
  }

  const filtered = products.filter(p =>
    String(p.id).includes(code)
  );

  render(filtered);
});

// ================= MODAL =================
addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// ================= AUTO NAME =================
codeInput.addEventListener("blur", async () => {
  const code = codeInput.value.trim();
  if (!code) return;

  const res = await apiRequest(`stocks/products/?id=${code}`);

  if (res?.data) {
    nameInput.value = res.data.trade_name || "";
  } else {
    alert("الصنف مش موجود");
    nameInput.value = "";
  }
});

// ================= SAVE (🔥 المهم هنا) =================
saveBtn.addEventListener("click", async () => {

  const payload = {
    product: parseInt(codeInput.value),
    expiry_date: expiryInput.value,
    stock_quantity: parseInt(quantityInput.value)
  };

  if (!payload.product || !payload.stock_quantity) {
    alert("ادخل البيانات كاملة");
    return;
  }

  const res = await apiRequest("stocks/batches/", "POST", payload);

  if (res) {
    alert("تم الإضافة ✅");

    modal.style.display = "none";

    codeInput.value = "";
    nameInput.value = "";
    quantityInput.value = "";
    expiryInput.value = "";
  }
});

// ================= PRINT =================
printBtn.addEventListener("click", () => {
  window.print();
});