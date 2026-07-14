// ================= API =================
const API_BASE_URL = "http://100.80.3.109:8000/api/stocks/categories/";

async function apiRequest(url = "", method = "GET", data = null) {
  try {
    const res = await fetch(API_BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: data ? JSON.stringify(data) : null,
    });

    const json = await res.json().catch(() => null);

    return {
      ok: res.ok,
      status: res.status,
      data: json,
    };
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return { ok: false, status: 0, data: null };
  }
}

// ================= ELEMENTS =================
const tableBody = document.getElementById("categoriesTable");
const rowCount = document.getElementById("rowCount");

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");

const codeInput = document.getElementById("code");
const arabicInput = document.getElementById("arabic");
const englishInput = document.getElementById("english");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let selectedItem = null;
let isEdit = false;

// ================= NORMALIZE =================
function normalize(res) {
  if (!res) return [];

  const data = res.data;

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];

  return [];
}

// ================= RENDER =================
function render(list) {
  tableBody.innerHTML = "";

  if (!list.length) {
    rowCount.innerText = 0;
    tableBody.innerHTML = `<tr><td colspan="3">لا يوجد بيانات</td></tr>`;
    return;
  }

  list.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id ?? ""}</td>
      <td>${item.name ?? ""}</td>
      <td>${item.name_en ?? ""}</td>
    `;

    row.onclick = () => {
      document.querySelectorAll("#categoriesTable tr")
        .forEach(r => r.classList.remove("selected"));

      row.classList.add("selected");
      selectedItem = item;
    };

    tableBody.appendChild(row);
  });

  rowCount.innerText = list.length;
}

// ================= LOAD =================
async function loadCategories() {
  const res = await apiRequest();

  console.log("LOAD:", res);

  const list = normalize(res);
  render(list);
}

// ================= ADD =================
addBtn.onclick = () => {
  isEdit = false;
  selectedItem = null;

  codeInput.value = "";
  arabicInput.value = "";
  englishInput.value = "";

  popup.style.display = "flex";
};

// ================= EDIT =================
editBtn.onclick = () => {
  if (!selectedItem) return alert("اختار صف");

  isEdit = true;

  codeInput.value = selectedItem.id;
  arabicInput.value = selectedItem.name;
  englishInput.value = selectedItem.name_en;

  popup.style.display = "flex";
};

// ================= SAVE =================
saveBtn.onclick = async () => {
  const data = {
    id: selectedItem?.id || null,
    name: arabicInput.value,
    name_en: englishInput.value,
  };

  const method = isEdit ? "PUT" : "POST";

  const res = await apiRequest("", method, data);

  if (!res.ok) {
    console.error(res);
    return alert("فشل العملية");
  }

  popup.style.display = "none";
  loadCategories();
};

// ================= DELETE =================
deleteBtn.onclick = async () => {
  if (!selectedItem) return alert("اختار صف");

  if (!confirm("متأكد من الحذف؟")) return;

  const res = await apiRequest("", "DELETE", {
    id: selectedItem.id,
  });

  if (!res.ok) {
    console.error(res);
    return alert("فشل الحذف");
  }

  loadCategories();
};

// ================= SEARCH =================
searchBtn.onclick = async () => {
  const value = searchInput.value.trim();

  if (!value) return loadCategories();

  const isNumber = !isNaN(value);

  const url = isNumber
    ? `?id=${value}`
    : `?name=${value}`;

  const res = await apiRequest(url);

  console.log("SEARCH:", res);

  const list = normalize(res);
  render(list);
};

// ================= CLOSE =================
closePopup.onclick = () => {
  popup.style.display = "none";
};

// ================= INIT =================
window.addEventListener("DOMContentLoaded", loadCategories);