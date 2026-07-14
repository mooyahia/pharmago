const API_BASE_URL = "http://100.80.3.109:8000/api/";

// ================= API REQUEST =================
async function apiRequest(url, method = "GET", data = null) {
  const response = await fetch(API_BASE_URL + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
    body: data ? JSON.stringify(data) : null,
  });

  if (!response.ok) {
    throw new Error("فشل تحميل البيانات");
  }

  return await response.json();
}

// ================= ELEMENTS =================
const bannerMsg = document.getElementById("api-banner-msg");

const revenueElement = document.getElementById("kpi-revenue");
const expensesElement = document.getElementById("kpi-expenses");
const profitElement = document.getElementById("kpi-profit");

const transactionsTbody = document.getElementById("transactions-tbody");
const invoicesTbody = document.getElementById("invoices-tbody");

const aiInsightsSection = document.getElementById("ai-insights-section");

// ================= FORMAT =================
function formatCurrency(number) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(number || 0);
}

// ================= LOAD DATA =================
async function loadFinancialReports() {
  try {
    bannerMsg.textContent = "جاري تحميل البيانات...";

    const response = await apiRequest(
      "accounting/financial-reports/"
    );

    const data = response.data;

    // ================= SUMMARY =================
    revenueElement.textContent = formatCurrency(
      data.financial_summary.total_revenue
    );

    expensesElement.textContent = formatCurrency(
      data.financial_summary.total_expenses
    );

    profitElement.textContent = formatCurrency(
      data.financial_summary.net_profit
    );

    if (data.financial_summary.net_profit < 0) {
      profitElement.style.color = "#ef4444";
    } else {
      profitElement.style.color = "#10b981";
    }

    // ================= AI INSIGHTS =================
    aiInsightsSection.innerHTML = `
      <section class="table-card">
        <div class="table-card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <span>🤖</span>
            <h2>تحليل مالي ذكي</h2>
          </div>
        </div>

        <div style="padding:20px">
          <p>
            ${
              data.financial_summary.net_profit < 0
                ? "يوجد خسائر مالية بسبب ارتفاع المصروفات مقارنة بالإيرادات."
                : "الأداء المالي جيد ويوجد أرباح إيجابية."
            }
          </p>

          <br>

        </div>
      </section>
    `;

    // ================= TRANSACTIONS =================
    transactionsTbody.innerHTML = "";

    data.cash_transactions.forEach((transaction) => {
      transactionsTbody.innerHTML += `
        <tr>
          <td>${transaction.id}</td>

          <td>
            ${
              transaction.type === "توريد"
                ? `<span style="color:#10b981;font-weight:700">${transaction.type}</span>`
                : `<span style="color:#ef4444;font-weight:700">${transaction.type}</span>`
            }
          </td>

          <td>${transaction.date}</td>

          <td>${transaction.description || "-"}</td>

          <td>
            ${formatCurrency(transaction.amount)}
          </td>
        </tr>
      `;
    });

    // ================= INVOICES =================
    invoicesTbody.innerHTML = "";

    data.all_invoices.forEach((invoice) => {
      invoicesTbody.innerHTML += `
        <tr>
          <td>
            ${invoice.invoice_no || invoice.id}
          </td>

          <td>
            ${invoice.party_name || "-"}
          </td>

          <td>
            ${formatCurrency(invoice.amount)}
          </td>

          <td>
            ${
              invoice.type === "بيع"
                ? `<span style="color:#10b981;font-weight:700">${invoice.type}</span>`
                : `<span style="color:#f59e0b;font-weight:700">${invoice.type}</span>`
            }
          </td>

          <td>${invoice.date}</td>
        </tr>
      `;
    });

    bannerMsg.textContent = "تم تحميل البيانات بنجاح";
  } catch (error) {
    console.error(error);

    bannerMsg.textContent = "حدث خطأ أثناء تحميل البيانات";
  }
}

// ================= EXPORT =================
document
  .getElementById("exportReport")
  .addEventListener("click", () => {
    window.print();
  });

// ================= START =================
document.addEventListener("DOMContentLoaded", () => {
  loadFinancialReports();
});