const EMPLOYEE_PERFORMANCE_API =
  "http://100.80.3.109:8000/api/hr/employee-performance/";

// ================= ELEMENTS =================
const employeesTbody = document.getElementById("employees-tbody");
const performanceTbody = document.getElementById("performance-tbody");

const kpiEmployees = document.getElementById("kpi-employees");
const kpiSalaries = document.getElementById("kpi-salaries");

const apiBanner = document.getElementById("api-banner");
const apiBannerMsg = document.getElementById("api-banner-msg");

const aiInsightsSection = document.getElementById(
  "ai-insights-section"
);

// ================= HELPERS =================
function formatNumber(num) {
  return Number(num || 0).toLocaleString("ar-EG");
}

function formatCurrency(num) {
  return Number(num || 0).toLocaleString("ar-EG") + " ج.م";
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("ar-EG");
}

// ================= JOB TITLE TRANSLATION =================
function translateJobTitle(job) {
  const jobs = {
    superadmin: "مدير النظام",
    admin: "مدير عام",
    manager: "مدير عام",
    pharmacist: "دكتور صيدلي",
    cashier: "كاشير",
    hr: "مدير الموارد البشرية",
    accountant: "محاسب",
  };

  return jobs[job?.toLowerCase()] || job || "-";
}

// ================= LOAD DATA =================
async function loadEmployeePerformance() {
  try {
    apiBannerMsg.textContent =
      "جاري تحميل بيانات الموارد البشرية...";

    const response = await fetch(EMPLOYEE_PERFORMANCE_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
    });

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "فشل تحميل البيانات");
    }

    const data = result.data;

    // ================= KPI =================
    kpiEmployees.textContent = formatNumber(
      data.summary.total_employees
    );

    kpiSalaries.textContent = formatCurrency(
      data.summary.total_monthly_salaries
    );

    // ================= EMPLOYEES TABLE =================
    employeesTbody.innerHTML = "";

    if (data.all_employees_table.length > 0) {
      data.all_employees_table.forEach((employee, index) => {
        employeesTbody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${employee.full_name || "-"}</td>
            <td>${translateJobTitle(employee.job_title)}</td>
            <td>${formatDate(employee.hire_date)}</td>
            <td>${formatCurrency(employee.salary)}</td>
            <td>${employee.phone || "-"}</td>
            <td>${employee.address || "-"}</td>
          </tr>
        `;
      });
    } else {
      employeesTbody.innerHTML = `
        <tr>
          <td colspan="8">لا يوجد موظفين</td>
        </tr>
      `;
    }

    // ================= PERFORMANCE TABLE =================
    performanceTbody.innerHTML = "";

    if (data.sales_performance.length > 0) {
      data.sales_performance.forEach((employee) => {
        performanceTbody.innerHTML += `
          <tr>
            <td>${employee.name || "-"}</td>
            <td>${translateJobTitle(employee.role)}</td>
            <td>${formatCurrency(
              employee.total_sales_amount
            )}</td>
          </tr>
        `;
      });
    } else {
      performanceTbody.innerHTML = `
        <tr>
          <td colspan="3">لا توجد بيانات أداء</td>
        </tr>
      `;
    }

    // ================= AI INSIGHTS =================
    const topEmployee = data.sales_performance?.[0];

    aiInsightsSection.innerHTML = `
      <section class="table-card">
        <div class="table-card-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <span>🤖</span>
            <h2>تحليلات الموارد البشرية</h2>
          </div>
        </div>

        <div class="insights-grid">
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-label">
                أفضل موظف مبيعات
              </span>
            </div>

            <div class="kpi-card-value">
              ${topEmployee?.name || "-"}
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-label">
                أعلى قيمة مبيعات
              </span>
            </div>

            <div class="kpi-card-value">
              ${
                topEmployee
                  ? formatCurrency(
                      topEmployee.total_sales_amount
                    )
                  : "-"
              }
            </div>
          </div>
        </div>
      </section>
    `;

    apiBannerMsg.textContent =
      "تم تحميل بيانات الموارد البشرية بنجاح ✨";

    setTimeout(() => {
      apiBanner.style.opacity = "0";
    }, 3000);
  } catch (error) {
    console.error(error);

    apiBannerMsg.textContent =
      "حدث خطأ أثناء تحميل البيانات";

    apiBanner.style.background = "#dc2626";
  }
}

// ================= START =================
loadEmployeePerformance();