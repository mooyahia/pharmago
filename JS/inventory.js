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
      json = text;
    }

    if (!res.ok) {
      console.error("API ERROR:", json);
      throw json;
    }

    return json;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    throw err;
  }
}

// ================= STATE =================
let products = [];
let selectedProduct = null;

// ================= ELEMENTS =================
const tableBody = document.getElementById("productsTable");
const codeInput = document.getElementById("productCode");
const nameInput = document.getElementById("productName");
const filterBtn = document.getElementById("filterProducts");

const addBtn = document.getElementById("addProductBtn");
const editBtn = document.getElementById("editProductBtn");
const deleteBtn = document.getElementById("deleteProductBtn");

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  try {
    const res = await apiRequest("stocks/products/");
    products = res?.data || res || [];
    render(products);
  } catch (err) {
    console.error("LOAD PRODUCTS ERROR:", err);
  }
}

// ================= RENDER =================
function render(list) {
  tableBody.innerHTML = "";

  if (!list.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">لا يوجد منتجات</td>
      </tr>
    `;
    return;
  }

  list.forEach(p => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.id || ""}</td>
      <td>${p.trade_name || ""}</td>
      <td>${p.current_stock || 0}</td>
      <td>${p.sell_price || 0}</td>
    `;

    row.addEventListener("click", () => {
      document.querySelectorAll("#productsTable tr")
        .forEach(r => r.classList.remove("active"));

      row.classList.add("active");
      selectedProduct = p;
    });

    tableBody.appendChild(row);
  });
}

// ================= FILTER =================
filterBtn?.addEventListener("click", () => {
  const code = codeInput.value.trim();
  const name = nameInput.value.trim();

  let filtered = [...products];

  if (code) {
    filtered = filtered.filter(p =>
      String(p.id || "").includes(code)
    );
  }

  if (name) {
    filtered = filtered.filter(p =>
      (p.trade_name || "").includes(name)
    );
  }

  render(filtered);
});

// ================= ADD =================
addBtn?.addEventListener("click", () => {
  sessionStorage.removeItem("editProductId");
  window.location.href = "addProduct.html";
});

// ================= EDIT =================
editBtn?.addEventListener("click", () => {
  if (!selectedProduct) {
    alert("اختار صنف الأول");
    return;
  }

  sessionStorage.setItem("editProductId", selectedProduct.id);
  window.location.href = "addProduct.html";
});

// ================= DELETE =================
deleteBtn?.addEventListener("click", async () => {
  if (!selectedProduct) {
    alert("اختار صنف الأول");
    return;
  }

  if (!confirm("متأكد من الحذف؟")) return;

  try {
    await apiRequest(
      `stocks/products/?id=${selectedProduct.id}`,
      "DELETE"
    );

    alert("تم الحذف بنجاح");
    selectedProduct = null;
    loadProducts();

  } catch (err) {
    alert(err?.message || "فشل الحذف");
  }
});

// ================= CAMERA =================
let html5QrCode;

const cameraBtn = document.getElementById("cameraBtn");
const cameraOverlay = document.getElementById("cameraOverlay");
const closeCamera = document.getElementById("closeCamera");

cameraBtn?.addEventListener("click", () => {
  cameraOverlay.style.display = "flex";

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      codeInput.value = decodedText;
      stopCamera();
    }
  );
});

function stopCamera() {
  cameraOverlay.style.display = "none";

  if (html5QrCode) {
    html5QrCode.stop().catch(() => {});
  }
}

closeCamera?.addEventListener("click", stopCamera);

// ================= INIT =================
window.addEventListener("DOMContentLoaded", loadProducts);