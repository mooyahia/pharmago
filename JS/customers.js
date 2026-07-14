// ================= API =================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

async function apiRequest(url, method = "GET", data = null) {
  try {
    const res = await fetch(API_BASE_URL + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken") || ""}`,
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
    console.error("API ERROR:", err);

    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
}

// ================= ELEMENTS =================
const clientsTableBody = document.getElementById("clientsTableBody");
const rowCount = document.getElementById("rowCount");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

// ================= STATE =================
let customers = [];
let filteredCustomers = [];
let selectedCustomerId = null;

// ================= INIT =================
window.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadCustomers();
  setupEvents();
}

// ================= LOAD CUSTOMERS =================
async function loadCustomers() {
  const res = await apiRequest("sell_invoice/customers/");

  if (!res.ok) {
    clientsTableBody.innerHTML = `
      <tr>
        <td colspan="4">فشل تحميل العملاء</td>
      </tr>
    `;

    return;
  }

  customers = res.data?.data || [];
  filteredCustomers = [...customers];

  renderCustomers(filteredCustomers);
}

// ================= RENDER CUSTOMERS =================
function renderCustomers(list) {
  clientsTableBody.innerHTML = "";

  if (!list.length) {
    clientsTableBody.innerHTML = `
      <tr>
        <td colspan="4">لا يوجد عملاء</td>
      </tr>
    `;

    rowCount.textContent = 0;
    return;
  }

  const rows = list.map(customer => `
    <tr 
      data-id="${customer.id}" 
      class="${
        selectedCustomerId === customer.id ? "selected-row" : ""
      }"
    >
      <td>${customer.id}</td>
      <td>${customer.name || ""}</td>
      <td>${customer.phone || ""}</td>
      <td>${customer.initial_balance || 0}</td>
    </tr>
  `).join("");

  clientsTableBody.innerHTML = rows;

  rowCount.textContent = list.length;

  setupRowSelection();
}

// ================= SELECT ROW =================
function setupRowSelection() {
  const rows = document.querySelectorAll("#clientsTableBody tr");

  rows.forEach(row => {
    row.addEventListener("click", () => {

      rows.forEach(r => r.classList.remove("selected-row"));

      row.classList.add("selected-row");

      selectedCustomerId = Number(row.dataset.id);
    });
  });
}

// ================= SEARCH =================
function searchCustomers() {
  const value = searchInput.value.trim().toLowerCase();

  if (!value) {
    filteredCustomers = [...customers];
  } else {
    filteredCustomers = customers.filter(customer => {

      const id = String(customer.id).includes(value);

      const name = (customer.name || "")
        .toLowerCase()
        .includes(value);

      const phone = (customer.phone || "")
        .includes(value);

      return id || name || phone;
    });
  }

  renderCustomers(filteredCustomers);
}

// ================= EVENTS =================
function setupEvents() {

  // search input
  searchInput?.addEventListener("input", searchCustomers);

  // search button
  searchBtn?.addEventListener("click", searchCustomers);

  // ================= ADD =================
  addBtn?.addEventListener("click", () => {

    window.location.href = "addCustomer.html";
  });

  // ================= EDIT =================
  editBtn?.addEventListener("click", () => {

    if (!selectedCustomerId) {
      alert("اختر عميل للتعديل");
      return;
    }

    localStorage.setItem(
      "editCustomerId",
      selectedCustomerId
    );

    window.location.href = "addCustomer.html";
  });

  // ================= DELETE =================
  deleteBtn?.addEventListener("click", async () => {

    if (!selectedCustomerId) {
      alert("اختر عميل للحذف");
      return;
    }

    const confirmed = confirm(
      "هل أنت متأكد من حذف العميل ؟"
    );

    if (!confirmed) return;

    const res = await apiRequest(
      `sell_invoice/customers/${selectedCustomerId}/`,
      "DELETE"
    );

    if (!res.ok) {
      alert("فشل حذف العميل");
      return;
    }

    alert("تم حذف العميل بنجاح");

    customers = customers.filter(
      c => c.id !== selectedCustomerId
    );

    filteredCustomers = filteredCustomers.filter(
      c => c.id !== selectedCustomerId
    );

    selectedCustomerId = null;

    renderCustomers(filteredCustomers);
  });
}