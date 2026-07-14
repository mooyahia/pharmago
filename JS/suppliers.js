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

  if (!res.ok) throw new Error("API Error");

  return await res.json();
}

// ================= ELEMENTS =================
const tableBody = document.getElementById("supplierTableBody");
const rowCount = document.getElementById("rowCount");

const addBtn = document.getElementById("addSupplier");
const editBtn = document.getElementById("editSupplier");
const deleteBtn = document.getElementById("deleteSupplier");

let selectedSupplier = null;


// ================= LOAD SUPPLIERS =================
async function loadSuppliers() {
  try {
    const res = await apiRequest("buy_invoice/suppliers/");
    console.log("API Response:", res);

    const suppliers = res.data; // 🔥 الحل الأساسي

    tableBody.innerHTML = "";
    selectedSupplier = null;

    suppliers.forEach(supplier => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${supplier.id || ""}</td>
        <td>${supplier.supplier_name || ""}</td>
        <td>${supplier.phone || ""}</td>
        <td>${supplier.email || ""}</td>
        <td>${supplier.address || ""}</td>
        <td>${supplier.contact_person || ""}</td>
      `;

      row.onclick = () => {
        document.querySelectorAll("#supplierTableBody tr")
          .forEach(r => r.classList.remove("selected"));

        row.classList.add("selected");
        selectedSupplier = supplier;
      };

      tableBody.appendChild(row);
    });

    rowCount.innerText = suppliers.length;

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("فشل تحميل الموردين");
  }
}

// ================= BUTTONS =================

// ➕ إضافة
addBtn.onclick = () => {
  localStorage.removeItem("editSupplier");
  window.location.href = "addSupplier.html";
};


// ✏️ تعديل
editBtn.onclick = () => {
  if (!selectedSupplier) {
    alert("اختار مورد الأول");
    return;
  }

  localStorage.setItem("editSupplier", JSON.stringify(selectedSupplier));
  window.location.href = "addSupplier.html";
};


deleteBtn.onclick = async () => {

  if (!selectedSupplier) {
    alert("اختار مورد الأول");
    return;
  }

  if (!confirm("متأكد من الحذف؟")) return;

  try {

    const data = {
      id: selectedSupplier.id
    };

    await apiRequest(
      "buy_invoice/suppliers/",
      "DELETE",
      data
    );

    alert("تم الحذف ✅");
    loadSuppliers();

  } catch (err) {
    console.error("DELETE ERROR:", err);
    alert("فشل الحذف");
  }
};

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  loadSuppliers();
});



const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.onclick = async () => {
  const value = searchInput.value.trim();

  try {

    const url = !isNaN(value)
      ? `buy_invoice/suppliers/?id=${value}`
      : `buy_invoice/suppliers/?name=${value}`;

    const res = await apiRequest(url);

    console.log("SEARCH RESPONSE:", res);

    // 🔥 أهم تعديل هنا
    const suppliers =
      Array.isArray(res.data) ? res.data :
      res.data ? [res.data] : [];

    tableBody.innerHTML = "";

    suppliers.forEach(s => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${s.id || ""}</td>
        <td>${s.supplier_name || ""}</td>
        <td>${s.phone || ""}</td>
        <td>${s.email || ""}</td>
        <td>${s.address || ""}</td>
        <td>${s.contact_person || ""}</td>
      `;

      tableBody.appendChild(row);
    });

    rowCount.innerText = suppliers.length;

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    alert("فشل البحث");
  }
};