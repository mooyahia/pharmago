// ================= API CONFIG =================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

async function apiRequest(url, method = "GET", data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(API_BASE_URL + url, options);
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON");
  }

  if (!res.ok) {
    console.error(json);
    throw new Error(json?.message || "API Error");
  }

  return json;
}

// ================= TABS =================
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ================= CAMERA =================
let html5QrCode;
let isCameraRunning = false;

const cameraBtn     = document.getElementById("cameraBtn");
const cameraOverlay = document.getElementById("cameraOverlay");
const closeCamera   = document.getElementById("closeCamera");

cameraBtn?.addEventListener("click", () => {
  cameraOverlay.style.display = "flex";

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  if (!isCameraRunning) {
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        document.getElementById("companyCode").value = decodedText;
        stopCamera();
      }
    );
    isCameraRunning = true;
  }
});

function stopCamera() {
  cameraOverlay.style.display = "none";
  if (html5QrCode && isCameraRunning) {
    html5QrCode.stop().then(() => { isCameraRunning = false; });
  }
}

closeCamera?.addEventListener("click", stopCamera);

// ================= SUPPLIERS =================
async function loadSuppliers() {
  try {
    const res = await apiRequest("buy_invoice/suppliers/");
    const suppliers = res?.data || [];
    const select = document.getElementById("suppliersSelect");
    select.innerHTML = `<option value="">اختر المورد</option>`;
    suppliers.forEach(s => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.supplier_name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("SUPPLIERS ERROR:", err);
  }
}

// ================= UNITS =================
async function loadUnits() {
  try {
    const res = await apiRequest("stocks/units/");
    const units = res?.data?.data || res?.data || [];
    const saleSelect     = document.getElementById("saleUnit");
    const purchaseSelect = document.getElementById("purchaseUnit");

    saleSelect.innerHTML     = `<option value="">وحدة البيع</option>`;
    purchaseSelect.innerHTML = `<option value="">وحدة الشراء</option>`;

    units.forEach(u => {
      const option1 = document.createElement("option");
      option1.value = u.id;
      option1.textContent = u.name;
      const option2 = option1.cloneNode(true);
      saleSelect.appendChild(option1);
      purchaseSelect.appendChild(option2);
    });
  } catch (err) {
    console.error("UNITS ERROR:", err);
  }
}

// ================= CATEGORIES =================
async function loadCategories() {
  try {
    const res = await apiRequest("stocks/categories/");
    const categories = res?.data?.data || res?.data || [];
    const select = document.getElementById("productGroup");
    select.innerHTML = `<option value="">اختر المجموعة</option>`;
    categories.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("CATEGORIES ERROR:", err);
  }
}

// ================= EDIT MODE =================
let editId = null;

async function loadEditProduct() {
  editId = sessionStorage.getItem("editProductId");
  if (!editId) return;

  try {
    const res = await apiRequest(`stocks/products/?id=${editId}`);
    const p = res?.data;
    if (!p) return;

    document.getElementById("companyCode").value      = p.barcode         || "";
    document.getElementById("productNameAr").value    = p.trade_name      || "";
    document.getElementById("productNameEn").value    = p.trade_name_en   || "";
    document.getElementById("activeIngredient").value = p.scientific_name || "";
    document.getElementById("productGroup").value     = p.category        || "";
    document.getElementById("saleUnit").value         = p.unit            || "";
    document.getElementById("productType").value      = p.nature          || "";
    document.getElementById("purchasePrice").value    = p.buy_price       || 0;
    document.getElementById("salePrice").value        = p.sell_price      || 0;
    document.getElementById("minQuantity").value      = p.min_stock_limit || 0;
    document.getElementById("usageMethods").value     = p.usage_method    || "";
    document.getElementById("usageReasons").value     = p.indication      || "";
    document.getElementById("suppliersSelect").value  = p.supplier        || "";

  } catch (err) {
    console.error("LOAD EDIT ERROR:", err);
  }
}

// ================= SAVE / UPDATE =================
document.getElementById("saveProductBtn")?.addEventListener("click", async () => {

  const data = {
    barcode:         document.getElementById("companyCode")?.value        || "",
    trade_name:      document.getElementById("productNameAr")?.value      || "",
    trade_name_en:   document.getElementById("productNameEn")?.value      || "",
    scientific_name: document.getElementById("activeIngredient")?.value   || "",
    category:        document.getElementById("productGroup")?.value       || "",
    unit:            document.getElementById("saleUnit")?.value           || "",
    nature:          document.getElementById("productType")?.value        || "",
    buy_price:       parseFloat(document.getElementById("purchasePrice")?.value) || 0,
    sell_price:      parseFloat(document.getElementById("salePrice")?.value)     || 0,
    min_stock_limit: parseInt(document.getElementById("minQuantity")?.value)     || 0,
    usage_method:    document.getElementById("usageMethods")?.value       || "",
    indication:      document.getElementById("usageReasons")?.value       || "",
    supplier:        document.getElementById("suppliersSelect")?.value    || null,
  };

  if (!data.trade_name) {
    alert("اسم الصنف مطلوب");
    return;
  }

  try {
    if (editId) {
      // ✅ الـ id يتبعت جوه الـ body عشان Django يلاقيه في request.data
      data.id = parseInt(editId);
      await apiRequest(`stocks/products/?id=${editId}`, "PUT", data);
      sessionStorage.removeItem("editProductId");
      alert("تم تعديل المنتج بنجاح ✅");
    } else {
      await apiRequest("stocks/products/", "POST", data);
      alert("تم حفظ المنتج بنجاح ✅");
    }

    window.location.href = "products.html";

  } catch (err) {
    console.error(err);
    alert("حصل خطأ أثناء الحفظ");
  }
});

// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadSuppliers(), loadUnits(), loadCategories()]);
  await loadEditProduct();
});