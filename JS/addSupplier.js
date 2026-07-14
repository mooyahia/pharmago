
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
  return await res.json();
}


// ================= INPUTS =================
const supplierCode = document.getElementById("supplierCode");
const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierEmail = document.getElementById("supplierEmail");
const supplierAddress = document.getElementById("supplierAddress");
const salesRepresentative = document.getElementById("salesRepresentative");

const saveBtn = document.getElementById("saveBtn");


document.getElementById("saveBtn").onclick = async () => {

  const editData = localStorage.getItem("editSupplier");
  let editId = null;

  if (editData) {
    editId = JSON.parse(editData).id;
  }

  const data = {
    id: editId, // 👈 مهم جدًا دلوقتي
    supplier_name: document.getElementById("supplierName").value,
    phone: document.getElementById("supplierPhone").value,
    email: document.getElementById("supplierEmail")?.value || "",
    address: document.getElementById("supplierAddress").value,
    contact_person: document.getElementById("salesRepresentative").value,
  };

  if (!data.supplier_name) {
    alert("الاسم مطلوب");
    return;
  }

  try {

    const url = "buy_invoice/suppliers/";
    const method = editId ? "PUT" : "POST";

    const res = await apiRequest(url, method, data);

    console.log("RESPONSE:", res);

    alert(editId ? "تم التعديل ✅" : "تم الإضافة ✅");

    localStorage.removeItem("editSupplier");
    window.location.href = "suppliers.html";

  } catch (err) {
    console.error("FULL ERROR:", err);
    alert("فشل العملية");
  }
};


// ================= CLEAR FORM =================
function clearForm() {
  supplierCode.value = "";
  supplierName.value = "";
  supplierPhone.value = "";
  supplierAddress.value = "";
  salesRepresentative.value = "";
  supplierEmail.value = "";
}


window.addEventListener("DOMContentLoaded", () => {

  const editData = localStorage.getItem("editSupplier");

  if (!editData) return; // 👈 لو مفيش يبقى إضافة عادي

  const supplier = JSON.parse(editData);

  document.getElementById("supplierName").value = supplier.supplier_name || "";
  document.getElementById("supplierPhone").value = supplier.phone || "";
  document.getElementById("supplierAddress").value = supplier.address || "";
  document.getElementById("salesRepresentative").value = supplier.contact_person || "";

});