// ================= API BASE =================
const API_BASE_URL =
  "http://100.80.3.109:8000/api/sell_invoice/customer-reports/";

// ================= ELEMENTS =================
const totalCustomersEl = document.getElementById("kpi-total-customers");

const topCustomersTbody = document.getElementById("top-customers-tbody");
const allCustomersTbody = document.getElementById("customers-dir-tbody");

const exportBtn = document.getElementById("exportReport");

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadCustomersReport();
});

// ================= HEADERS =================
function getHeaders() {
  const token = localStorage.getItem("authToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

// ================= LOAD DATA =================
async function loadCustomersReport() {
  try {
    const res = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getHeaders(),
    });

    if (res.status === 401) {
      console.error("Unauthorized - Invalid token");
      return;
    }

    if (!res.ok) throw new Error("API Error");

    const json = await res.json();
    const data = json.data;

    renderSummary(data.summary);
    renderTopCustomers(data.top_customers);
    renderAllCustomers(data.all_customers);
  } catch (err) {
    console.error("Error loading customers:", err.message);
  }
}

// ================= KPI =================
function renderSummary(summary) {
  totalCustomersEl.textContent =
    summary?.total_customers?.toLocaleString("ar-EG") || "0";
}

// ================= TOP CUSTOMERS =================
function renderTopCustomers(list) {
  topCustomersTbody.innerHTML = "";

  if (!list || list.length === 0) {
    topCustomersTbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; opacity:.6">
          لا يوجد بيانات
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((c) => {
    topCustomersTbody.innerHTML += `
      <tr>
        <td>${c.name || "-"}</td>
        <td>${c.invoices_count || 0}</td>
        <td>${c.total_spent || 0} ج.م</td>
        <td>${c.last_invoice_date || "-"}</td>
      </tr>
    `;
  });
}

// ================= ALL CUSTOMERS =================
function renderAllCustomers(list) {
  allCustomersTbody.innerHTML = "";

  if (!list || list.length === 0) {
    allCustomersTbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; opacity:.6">
          لا يوجد عملاء
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((c) => {
    allCustomersTbody.innerHTML += `
      <tr>
        <td>${c.id || "-"}</td>
        <td>${c.name || "-"}</td>
        <td>${c.phone || "-"}</td>
        <td>${c.initial_balance ?? 0}</td>
      </tr>
    `;
  });
}

// ================= EXPORT PDF =================
exportBtn.addEventListener("click", exportPDF);

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.text("تقرير العملاء", 10, y);
  y += 10;

  doc.text(
    `إجمالي العملاء: ${totalCustomersEl.textContent}`,
    10,
    y
  );

  y += 10;

  doc.text("أفضل العملاء:", 10, y);
  y += 10;

  document.querySelectorAll("#top-customers-tbody tr").forEach((row) => {
    const cols = row.querySelectorAll("td");

    const line = Array.from(cols)
      .map((td) => td.textContent)
      .join(" | ");

    doc.text(line, 10, y);
    y += 8;

    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.text("كل العملاء:", 10, y);
  y += 10;

  document.querySelectorAll("#customers-dir-tbody tr").forEach((row) => {
    const cols = row.querySelectorAll("td");

    const line = Array.from(cols)
      .map((td) => td.textContent)
      .join(" | ");

    doc.text(line, 10, y);
    y += 8;

    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("customers-report.pdf");
}