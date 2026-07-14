const API_URL = "http://100.80.3.109:8000/api/stocks/stock-dashboard/";

// ================= عناصر الصفحة =================
const invCount = document.getElementById("invCount");
const lowStockCount = document.getElementById("lowStockCount");
const outOfStockCount = document.getElementById("outOfStockCount");

const lowInventoryTable = document.getElementById("lowInventoryTable");
const outOfStockInventoryTable = document.getElementById(
  "outOfStockInventoryTable"
);

const recentTransactionsTable = document.getElementById(
  "recentTransactionsTable"
);

const exportBtn = document.getElementById("exportReport");

// ================= تحميل الداتا =================
async function loadDashboard() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
    });

    const result = await res.json();

    if (result.status !== "success") {
      alert("فشل تحميل البيانات");
      return;
    }

    const data = result.data;

    // ================= Summary =================
    invCount.textContent = data.summary.total_products ?? 0;
    lowStockCount.textContent = data.summary.low_stock ?? 0;
    outOfStockCount.textContent = data.summary.out_of_stock ?? 0;

    // ================= Low Stock =================
    renderLowStock(data.alerts.low_stock || []);

    // ================= Out Of Stock =================
    renderOutOfStock(data.alerts.out_of_stock || []);

    // ================= Recent Movements =================
    renderRecentMovements(data.recent_movements || []);

    // ================= Charts =================
    renderCharts(data.charts || []);
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء تحميل التقرير");
  }
}

// ================= Low Stock Table =================
function renderLowStock(items) {
  lowInventoryTable.innerHTML = "";

  if (!items.length) {
    lowInventoryTable.innerHTML = `
      <tr>
        <td colspan="5">لا توجد بيانات</td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    lowInventoryTable.innerHTML += `
      <tr>
        <td>${item.barcode ?? "-"}</td>
        <td>${item.trade_name ?? "-"}</td>
        <td>${item.category__name ?? "-"}</td>
        <td class="qty-low">${item.current_stock ?? 0}</td>
        <td>${item.min_stock_limit ?? 0}</td>
      </tr>
    `;
  });
}

// ================= Out Of Stock Table =================
function renderOutOfStock(items) {
  outOfStockInventoryTable.innerHTML = "";

  if (!items.length) {
    outOfStockInventoryTable.innerHTML = `
      <tr>
        <td colspan="4">لا توجد بيانات</td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    outOfStockInventoryTable.innerHTML += `
      <tr>
        <td>${item.barcode ?? "-"}</td>
        <td>${item.trade_name ?? "-"}</td>
        <td>${item.category__name ?? "-"}</td>
        <td class="qty-zero">${item.current_stock ?? 0}</td>
      </tr>
    `;
  });
}

// ================= Recent Movements =================
function renderRecentMovements(items) {
  recentTransactionsTable.innerHTML = "";

  if (!items.length) {
    recentTransactionsTable.innerHTML = `
      <tr>
        <td colspan="5">لا توجد بيانات</td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    let badgeClass = "badge-blue";

    if (item.type === "دخول") {
      badgeClass = "badge-green";
    } else if (item.type === "خروج") {
      badgeClass = "badge-pink";
    }

    recentTransactionsTable.innerHTML += `
      <tr>
        <td>${item.barcode ?? "-"}</td>
        <td>${item.product_name ?? "-"}</td>
        <td>
          <span class="badge ${badgeClass}">
            ${item.type ?? "-"}
          </span>
        </td>
        <td>${item.quantity ?? 0}</td>
        <td>${item.date ?? "-"}</td>
      </tr>
    `;
  });
}

// ================= Charts =================
function renderCharts(charts) {
  // حذف أي رسوم قديمة
  const oldCharts = document.querySelectorAll(".dynamic-chart-item");
  oldCharts.forEach((el) => el.remove());

  // مكان الرسومات
  const chartsContainer = document.querySelector(".charts-row");

  if (!charts.length) return;

  charts.forEach((chart) => {
    const card = document.createElement("div");

    card.className = "chart-card dynamic-chart-item";

    card.innerHTML = `
      <div class="chart-title">${chart.category}</div>

      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        gap:15px;
        padding:25px;
      ">

        <div style="
          width:140px;
          height:140px;
          border-radius:50%;
          background:
          conic-gradient(
            #0f766e 0% ${chart.percentage}%,
            #e2e8f0 ${chart.percentage}% 100%
          );
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <div style="
            width:90px;
            height:90px;
            background:white;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
          ">
            <strong>${chart.percentage}%</strong>
            <small>${chart.count} منتج</small>
          </div>
        </div>

      </div>
    `;

    chartsContainer.appendChild(card);
  });
}

// ================= تصدير PDF =================
exportBtn.onclick = () => {
  const element = document.querySelector(".content");

  const opt = {
    margin: 0.5,
    filename: "inventory-report.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(opt).from(element).save();
};

// ================= تشغيل =================
loadDashboard();