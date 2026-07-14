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
const tableBody = document.getElementById("unitsTable");
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

let selectedUnit = null;
let isEditMode = false;

// ================= HELPERS =================
function normalizeList(res) {
  if (!res) return [];

  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res)) return res;

  return [];
}

// ================= RENDER =================
function renderUnits(units) {
  tableBody.innerHTML = "";

  units.forEach(unit => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${unit.id ?? ""}</td>
      <td>${unit.name ?? ""}</td>
      <td>${unit.name_en ?? ""}</td>
    `;

    row.onclick = () => {
      document.querySelectorAll("#unitsTable tr")
        .forEach(r => r.classList.remove("selected"));

      row.classList.add("selected");
      selectedUnit = unit;
    };

    tableBody.appendChild(row);
  });

  rowCount.innerText = units.length;
}

// ================= LOAD =================
async function loadUnits() {
  const res = await apiRequest("stocks/units/");

  console.log("UNITS RESPONSE:", res);

  const units = normalizeList(res);

  renderUnits(units);
}

// ================= SEARCH =================
searchBtn.onclick = async () => {
  const value = searchInput.value.trim();

  if (!value) {
    loadUnits();
    return;
  }

  const isNumber = !isNaN(value);

  const url = isNumber
    ? `stocks/units/?id=${value}`
    : `stocks/units/?name=${value}`;

  const res = await apiRequest(url);

  console.log("SEARCH RAW:", res);

  if (!res.ok) {
    tableBody.innerHTML = "";
    rowCount.innerText = 0;
    alert(res.data?.message || "لا توجد نتائج");
    return;
  }

  const units = normalizeList(res);

  console.log("SEARCH NORMALIZED:", units);

  renderUnits(units);
};

// ================= ADD =================
addBtn.onclick = () => {
  isEditMode = false;
  selectedUnit = null;

  codeInput.value = "";
  arabicInput.value = "";
  englishInput.value = "";

  popup.style.display = "flex";
};

// ================= EDIT =================
editBtn.onclick = () => {
  if (!selectedUnit) {
    alert("اختار صف");
    return;
  }

  isEditMode = true;

  codeInput.value = selectedUnit.id;
  arabicInput.value = selectedUnit.name;
  englishInput.value = selectedUnit.name_en;

  popup.style.display = "flex";
};

// ================= SAVE =================
saveBtn.onclick = async () => {
  const data = {
    id: selectedUnit?.id || null,
    name: arabicInput.value,
    name_en: englishInput.value,
  };

  const url = "stocks/units/";
  const method = isEditMode ? "PUT" : "POST";

  const res = await apiRequest(url, method, data);

  if (!res.ok) {
    console.error(res);
    alert("فشل العملية");
    return;
  }

  popup.style.display = "none";
  loadUnits();
};

// ================= DELETE =================
deleteBtn.onclick = async () => {
  if (!selectedUnit) return alert("اختار صف");

  if (!confirm("متأكد؟")) return;

  const res = await apiRequest("stocks/units/", "DELETE", {
    id: selectedUnit.id,
  });

  if (!res.ok) {
    alert("فشل الحذف");
    return;
  }

  loadUnits();
};

// ================= CLOSE =================
closePopup.onclick = () => {
  popup.style.display = "none";
};

// ================= INIT =================
window.addEventListener("DOMContentLoaded", loadUnits);