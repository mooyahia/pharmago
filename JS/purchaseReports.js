const API_URL =
  "http://100.80.3.109:8000/api/buy_invoice/purchase-reports/";

// ================= ELEMENTS =================
const bannerMsg = document.getElementById("api-banner-msg");

const toggleFilterationBtn =
  document.getElementById("toggleFilteration");

const filterationDates =
  document.getElementById("filterationDates");

const applyFilterationBtn =
  document.getElementById("applyFilteration");

const exportReportBtn =
  document.getElementById("exportReport");

const fromDateInput =
  document.getElementById("fromDate");

const toDateInput =
  document.getElementById("toDate");

const purchasesTbody =
  document.getElementById("purchases-tbody");

const purchasesCount =
  document.getElementById("purchases-count");

const totalVal =
  document.getElementById("kpi-total-val");

const ordersVal =
  document.getElementById("kpi-orders-val");

const suppliersVal =
  document.getElementById("kpi-suppliers-val");

const barChart =
  document.getElementById("teal-bar-chart");

// LINE CHART ELEMENTS
const lineGrid =
  document.getElementById("line-grid");

const lineAreaG =
  document.getElementById("line-area-g");

const linePathG =
  document.getElementById("line-path-g");

const lineDotsG =
  document.getElementById("line-dots-g");

const lineXLabels =
  document.getElementById("line-xlabels");

const lineYLabels =
  document.getElementById("line-ylabels");

// ================= STATE =================
let currentReports = [];

// ================= LOAD DATA =================
async function loadReports(fromDate = "", toDate = "") {
  try {
    bannerMsg.textContent = "جاري تحميل بيانات المشتريات...";

    let url = API_URL;

    if (fromDate && toDate) {
      url += `?from_date=${fromDate}&to_date=${toDate}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await res.json();

    if (data.status !== "success") {
      throw new Error("API Error");
    }

    const resData = data.data;

    // ================= KPI =================
    totalVal.textContent =
      resData.summary.total_purchase_amount.toLocaleString() +
      " ج.م";

    ordersVal.textContent =
      resData.summary.total_invoices_count;

    suppliersVal.textContent =
      resData.summary.total_suppliers_count;

    // ================= TABLE =================
    currentReports = resData.table || [];
    renderTable(currentReports);

    // ================= CHARTS =================
    renderBarChart(resData.charts || []);
    renderLineChart(resData.charts || []);

    bannerMsg.textContent = "تم تحميل البيانات بنجاح";
  } catch (err) {
    console.error(err);
    bannerMsg.textContent = "حدث خطأ أثناء تحميل البيانات";

    purchasesTbody.innerHTML = `
      <tr><td colspan="5">خطأ في تحميل البيانات</td></tr>
    `;
  }
}

// ================= TABLE =================
function renderTable(data) {
  purchasesTbody.innerHTML = "";

  if (!data.length) {
    purchasesTbody.innerHTML = `
      <tr><td colspan="5">لا توجد بيانات</td></tr>
    `;
    purchasesCount.textContent = "0";
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.invoice_number || item.id}</td>
      <td>${item.supplier_name}</td>
      <td>${item.total_amount} ج.م</td>
      <td>
        <span class="${
          item.status === "paid"
            ? "status-paid"
            : "status-pending"
        }">
          ${item.status === "paid"
            ? "مدفوعة"
            : "معلقة"}
        </span>
      </td>
      <td>${item.date}</td>
    `;

    purchasesTbody.appendChild(tr);
  });

  purchasesCount.textContent =
    data.length + " عملية شراء";
}

// ================= BAR CHART =================
function renderBarChart(data) {
  barChart.innerHTML = "";

  if (!data.length) return;

  const max = Math.max(...data.map((x) => x.total_spent));

  data.forEach((item) => {
    const h = (item.total_spent / max) * 140;

    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";

    div.innerHTML = `
      <div style="
        width:40px;
        height:${h}px;
        background:#14B8A6;
        border-radius:10px 10px 0 0;
      "></div>
      <span style="font-size:12px;color:#94a3b8">
        ${item.month}
      </span>
    `;

    barChart.appendChild(div);
  });
}

// ================= LINE CHART =================
function renderLineChart(data) {
  lineGrid.innerHTML =
    lineAreaG.innerHTML =
    linePathG.innerHTML =
    lineDotsG.innerHTML =
    lineXLabels.innerHTML =
    lineYLabels.innerHTML =
      "";

  if (!data.length) return;

  const width = 560;
  const height = 160;
  const padding = 30;

  const maxValue = Math.max(
    ...data.map((d) => d.invoice_count)
  );

  // GRID + Y AXIS
  const steps = 5;

  for (let i = 0; i <= steps; i++) {
    const y =
      padding +
      ((height - padding * 2) / steps) * i;

    const value = Math.round(
      (maxValue / steps) * (steps - i)
    );

    // grid line
    const line =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

    line.setAttribute("x1", padding);
    line.setAttribute("x2", width - padding);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#e5e7eb");

    lineGrid.appendChild(line);

    // Y label
    const text =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    text.setAttribute("x", 5);
    text.setAttribute("y", y + 4);
    text.setAttribute("font-size", "10");
    text.setAttribute("fill", "#94a3b8");

    text.textContent = value;

    lineYLabels.appendChild(text);
  }

  const points = [];

  data.forEach((item, i) => {
    const x =
      padding +
      (i * (width - padding * 2)) /
        (data.length - 1 || 1);

    const y =
      height -
      padding -
      (item.invoice_count / maxValue) *
        (height - padding * 2);

    points.push({ x, y });

    // X label
    const t =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    t.setAttribute("x", x);
    t.setAttribute("y", height - 5);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", "#94a3b8");
    t.setAttribute("font-size", "10");

    t.textContent = item.month;

    lineXLabels.appendChild(t);
  });

  // LINE
  let d = "";

  points.forEach((p, i) => {
    d += `${i === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  });

  const path =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#14B8A6");
  path.setAttribute("stroke-width", "3");

  linePathG.appendChild(path);

  // DOTS
  points.forEach((p) => {
    const c =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    c.setAttribute("cx", p.x);
    c.setAttribute("cy", p.y);
    c.setAttribute("r", "4");
    c.setAttribute("fill", "#14B8A6");

    lineDotsG.appendChild(c);
  });
}

// ================= FILTER =================
toggleFilterationBtn.onclick = () => {
  filterationDates.classList.toggle("show");
};

applyFilterationBtn.onclick = () => {
  const from = fromDateInput.value;
  const to = toDateInput.value;

  if (!from || !to) {
    alert("اختر التاريخين");
    return;
  }

  loadReports(from, to);
};

// ================= PDF EXPORT =================
exportReportBtn.onclick = () => {
  if (!currentReports.length) return;

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.text("Purchase Reports", 14, 20);

  const body = currentReports.map((i) => [
    i.invoice_number || i.id,
    i.supplier_name,
    i.total_amount,
    i.status,
    i.date,
  ]);

  doc.autoTable({
    head: [
      ["Invoice", "Supplier", "Amount", "Status", "Date"],
    ],
    body,
    startY: 30,
  });

  doc.save("reports.pdf");
};

// ================= INIT =================
loadReports();