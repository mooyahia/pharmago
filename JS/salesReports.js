// ================= API =================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

async function apiRequest(url, method = "GET", data = null, query = null) {
  try {
    let finalUrl = API_BASE_URL + url;

    if (query) {
      const qs = new URLSearchParams(query).toString();
      finalUrl += `?${qs}`;
    }

    const res = await fetch(finalUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: method !== "GET" && data ? JSON.stringify(data) : null,
    });

    const text = await res.text();

    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      console.error("INVALID JSON:", text);
      return { ok: false, data: null };
    }

    return { ok: res.ok, data: json };
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return { ok: false, data: null };
  }
}

// ================= ELEMENTS =================
const toggleFilterBtn = document.getElementById("toggleFilteration");
const filterBox = document.getElementById("filterationDates");
const applyFilterBtn = document.getElementById("applyFilteration");
const exportBtn = document.getElementById("exportReport");

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

// KPI
const totalSalesEl = document.getElementById("TotalSales");
const totalOrdersEl = document.getElementById("TotalOrders");
const avgOrderEl = document.getElementById("AverageOrderValue");

// Tables
const bestProductsTable = document.getElementById("bestProductsTableBody");
const recentOrdersTable = document.getElementById("recentOrdersTableBody");

// Charts containers
const monthlySalesEl = document.getElementById("monthlySales");
const monthlyOrdersEl = document.getElementById("monthlyOrders");

let currentReport = null;

// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  await fetchReport(); // 🔥 load automatically
});

// ================= TOGGLE FILTER =================
toggleFilterBtn?.addEventListener("click", () => {
  filterBox.classList.toggle("show");
});

// ================= FETCH REPORT =================
async function fetchReport() {
  const query = {
    user: localStorage.getItem("userId") || "",
  };

  if (fromDate.value) query.from = fromDate.value;
  if (toDate.value) query.to = toDate.value;

  const res = await apiRequest(
    "sell_invoice/sales-reports/",
    "GET",
    null,
    query
  );

  if (!res.ok || !res.data) {
    alert("Failed to load report");
    return;
  }

  currentReport = res.data.data;

  renderReport(currentReport);
}

// ================= RENDER REPORT =================
function renderReport(report) {
  // KPI
  totalSalesEl.textContent = report.summary.total_sales.toLocaleString() + " EGP";
  totalOrdersEl.textContent = report.summary.orders_count;
  avgOrderEl.textContent = report.summary.average_order_value + " EGP";

  // PRODUCTS
  bestProductsTable.innerHTML = "";
  report.top_products.forEach(p => {
    bestProductsTable.innerHTML += `
      <tr>
        <td>${p.product__trade_name}</td>
        <td>${p.total_revenue}</td>
        <td>${p.total_qty}</td>
      </tr>
    `;
  });

  // ORDERS
  recentOrdersTable.innerHTML = "";
  report.recent_orders.forEach(o => {
    recentOrdersTable.innerHTML += `
      <tr>
        <td>#${o.id}</td>
        <td>${o.customer || "-"}</td>
        <td>${o.net_amount}</td>
        <td>${new Date(o.created_at).toLocaleDateString()}</td>
      </tr>
    `;
  });

  // CHARTS
  renderMonthlySales(report.monthly_sales);
  renderMonthlyOrders(report.monthly_sales);
}

// ================= MONTHLY SALES (BAR) =================
function renderMonthlySales(data) {
  if (!data?.length) return;

  const max = Math.max(...data.map(x => x.total_sales));

  const bars = data.map((m, i) => {
    const height = (m.total_sales / max) * 120;

    return `
      <rect x="${40 + i * 70}" y="${140 - height}" width="40" height="${height}" rx="4" fill="#0D9488"></rect>
      <text x="${40 + i * 70}" y="155" font-size="10">${m.month}</text>
    `;
  }).join("");

  monthlySalesEl.innerHTML = `
    <svg viewBox="0 0 500 160">
      ${bars}
    </svg>
  `;
}

// ================= MONTHLY ORDERS (LINE) =================
function renderMonthlyOrders(data) {
  if (!data?.length) return;

  const max = Math.max(...data.map(x => x.orders_count));

  const points = data.map((m, i) => {
    const x = 40 + i * 70;
    const y = 140 - (m.orders_count / max) * 120;
    return `${x},${y}`;
  }).join(" ");

  monthlyOrdersEl.innerHTML = `
    <svg viewBox="0 0 500 160">
      <polyline fill="none" stroke="#0D9488" stroke-width="2" points="${points}" />
    </svg>
  `;
}

// ================= APPLY FILTER =================
applyFilterBtn?.addEventListener("click", fetchReport);

// ================= EXPORT PDF =================
exportBtn?.addEventListener("click", () => {
  if (!currentReport) {
    alert("No data");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.text("Sales Report", 10, y); y += 10;

  doc.text(`Total Sales: ${currentReport.summary.total_sales}`, 10, y); y += 10;
  doc.text(`Orders: ${currentReport.summary.orders_count}`, 10, y); y += 10;
  doc.text(`Avg Order: ${currentReport.summary.average_order_value}`, 10, y); y += 15;

  doc.text("Top Products:", 10, y); y += 10;

  currentReport.top_products.forEach(p => {
    doc.text(`${p.product__trade_name} | Qty: ${p.total_qty} | Revenue: ${p.total_revenue}`, 10, y);
    y += 8;
  });

  y += 10;

  doc.text("Recent Orders:", 10, y); y += 10;

  currentReport.recent_orders.forEach(o => {
    doc.text(`#${o.id} | ${o.customer || "-"} | ${o.net_amount}`, 10, y);
    y += 8;
  });

  doc.save("sales-report.pdf");
});