const API_URL =
  "http://100.80.3.109:8000/api/buy_invoice/supplier-reports/";

// عناصر الصفحة
const kpiSuppliers = document.getElementById("kpi-suppliers-val");
const kpiOrders = document.getElementById("kpi-orders-val");
const kpiTotal = document.getElementById("kpi-total-val");

const suppliersTbody = document.getElementById("suppliers-tbody");
const paymentsTbody = document.getElementById("payments-tbody");

const bannerMsg = document.getElementById("api-banner-msg");

// جلب البيانات
async function loadSupplierReports() {
  try {
    bannerMsg.textContent = "جاري تحميل بيانات الموردين...";

    const res = await fetch(API_URL, {
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

    const result = data.data;

    // ================= KPI =================
    kpiSuppliers.textContent = result.summary.total_suppliers;
    kpiOrders.textContent = result.summary.total_purchase_invoices;
    kpiTotal.textContent =
      result.summary.total_purchase_value.toLocaleString("en-EG") + " ج.م";

    // ================= Suppliers Table =================
    suppliersTbody.innerHTML = "";

    result.all_suppliers.forEach((sup) => {
      const row = `
        <tr>
          <td>${sup.supplier_code}</td>
          <td>${sup.supplier_name}</td>
          <td>${sup.phone}</td>
          <td>${sup.email}</td>
          <td>-</td>
          <td>-</td>
        </tr>
      `;
      suppliersTbody.insertAdjacentHTML("beforeend", row);
    });

    // ================= Payments Table =================
    paymentsTbody.innerHTML = "";

    result.pending_invoices.forEach((item) => {
      const row = `
        <tr>
          <td>${item.supplier_code}</td>
          <td>${item.supplier_name}</td>
          <td>${item.total_pending_value.toLocaleString(
            "en-EG"
          )} (${item.count})</td>
        </tr>
      `;
      paymentsTbody.insertAdjacentHTML("beforeend", row);
    });

    bannerMsg.textContent = "تم تحميل بيانات الموردين بنجاح ✔";
  } catch (err) {
    console.error(err);
    bannerMsg.textContent = "حصل خطأ في تحميل البيانات ❌";
  }
}

// تشغيل عند فتح الصفحة
document.addEventListener("DOMContentLoaded", loadSupplierReports);