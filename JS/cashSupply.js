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
      console.log("RAW RESPONSE:", text);
      return null;
    }

    if (!res.ok) {
      console.log("API ERROR:", json);
      return null;
    }

    return json;
  } catch (err) {
    console.log("FETCH ERROR:", err);
    return null;
  }
}

// ================= STATE =================
let cashData = [];
let filteredData = [];

// ================= ELEMENTS =================
const tableBody = document.getElementById("supply-table-body");
const countEl = document.getElementById("supply-count");

const filterInput = document.getElementById("filterDocumentCode");
const filterBtn = document.getElementById("filterBtn");

const modal = document.getElementById("add-modal");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");
const form = document.getElementById("add-form");

// ================= LOAD DATA =================
async function loadCash() {
  const res = await apiRequest("accounting/cash-transactions/", "GET");

  const all = res?.data || res || [];

  // IMPORTANT: Cash In فقط
  cashData = all.filter(x => x.trans_type === "In");

  filteredData = cashData;

  renderTable(filteredData);
}

// ================= RENDER =================
function renderTable(data) {
  tableBody.innerHTML = "";

  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">لا يوجد بيانات</td>
      </tr>
    `;
    countEl.textContent = 0;
    return;
  }

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id || ""}</td>
      <td>${item.amount || 0}</td>
      <td>${item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</td>
      <td>${item.description || ""}</td>
      <td>${item.user_name || ""}</td>
    `;

    tableBody.appendChild(row);
  });

  countEl.textContent = data.length;
}

// ================= FILTER =================
filterBtn?.addEventListener("click", () => {
  const code = filterInput.value.trim();

  if (!code) {
    renderTable(cashData);
    return;
  }

  const result = cashData.filter(x =>
    String(x.id).includes(code)
  );

  renderTable(result);
});

// ================= OPEN MODAL =================
openModalBtn?.addEventListener("click", () => {
  modal.style.display = "flex";
});

// ================= CLOSE MODAL =================
closeModalBtn?.addEventListener("click", () => {
  modal.style.display = "none";
});

// ================= SAVE CASH IN =================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amountValue = document.getElementById("amount").value.trim();
  const description = document.getElementById("description").value.trim();

  // validation
  if (!amountValue || isNaN(amountValue)) {
    alert("من فضلك ادخل قيمة صحيحة");
    return;
  }

  const payload = {
    amount: Number(amountValue),
    description: description || "",
    trans_type: "in" // Cash In
  };

  console.log("SEND:", payload);

  const res = await apiRequest(
    "accounting/cash-transactions/",
    "POST",
    payload
  );

  if (!res) {
    alert("حصل خطأ أثناء الحفظ");
    return;
  }

  alert("تم الحفظ بنجاح");

  modal.style.display = "none";
  form.reset();

  loadCash();
});

// ================= PRINT =================
document.getElementById("printSheet")?.addEventListener("click", () => {
  const content = document.querySelector(".cash-table-container").innerHTML;

  const win = window.open("", "", "width=900,height=700");

  win.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial; direction: rtl; }
          table { width:100%; border-collapse: collapse; }
          th, td { border:1px solid #000; padding:8px; text-align:center; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

  win.document.close();
  win.print();
});

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  loadCash();
});