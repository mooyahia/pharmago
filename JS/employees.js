const API_BASE_URL = "http://100.80.3.109:8000/api/";

// ================= API =================
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

    console.error(err);

    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
}

// ================= ELEMENTS =================
const employeesTableBody = document.getElementById("employeesTableBody");

const employeeSearchInput = document.getElementById("employeeSearchInput");

const searchButton = document.getElementById("searchButton");

const addEmployeeBtn = document.getElementById("addEmployee");

const editEmployeeBtn = document.getElementById("editEmployee");

const deleteEmployeeBtn = document.getElementById("deleteEmployee");

const printCardBtn = document.getElementById("printCard");

// ================= DATA =================
let employees = [];

let selectedEmployee = null;

// ================= LOAD =================
async function loadEmployees(searchValue = "") {

  employeesTableBody.innerHTML = `
    <tr><td colspan="9">جاري التحميل...</td></tr>
  `;

  try {

    const empRes = await apiRequest("hr/employees/");

    const usersRes = await apiRequest("hr/users/");

    if (!empRes.ok) {

      employeesTableBody.innerHTML = `
        <tr><td colspan="9">فشل التحميل</td></tr>
      `;

      return;
    }

    const empData = empRes?.data?.data || empRes?.data || [];
    const usersData = usersRes?.data?.data || usersRes?.data || [];

    employees = empData.map(emp => {

      const linkedUser = usersData.find(
        user => String(user.employee) === String(emp.id)
      );

      return {
        ...emp,
        username: linkedUser?.username || "-",
        user_id: linkedUser?.id || null,
      };
    });

    if (searchValue.trim()) {

      const k = searchValue.toLowerCase();

      employees = employees.filter(emp =>
        String(emp.id).includes(k) ||
        (emp.full_name || "").toLowerCase().includes(k) ||
        (emp.username || "").toLowerCase().includes(k)
      );
    }

    renderEmployees();

  } catch (err) {

    console.error(err);

    employeesTableBody.innerHTML = `
      <tr><td colspan="9">خطأ</td></tr>
    `;
  }
}

// ================= RENDER =================
function renderEmployees() {

  employeesTableBody.innerHTML = "";

  if (!employees.length) {

    employeesTableBody.innerHTML = `
      <tr><td colspan="9">لا يوجد بيانات</td></tr>
    `;

    return;
  }

  employees.forEach(emp => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${emp.id ?? "-"}</td>
      <td>${emp.full_name ?? "-"}</td>
      <td>${emp.job_title ?? "-"}</td>
      <td>${emp.hire_date ?? "-"}</td>
      <td>${emp.salary ?? "-"}</td>
      <td>${emp.phone ?? "-"}</td>
      <td>${emp.address ?? "-"}</td>
      <td>${emp.username ?? "-"}</td>
      <td>${emp.is_active == 1 ? "نشط" : "موقوف"}</td>
    `;

    tr.onclick = () => {

      document.querySelectorAll("tr")
        .forEach(r => r.classList.remove("selected"));

      tr.classList.add("selected");

      selectedEmployee = emp;
    };

    employeesTableBody.appendChild(tr);
  });
}

// ================= ACTIONS =================
searchButton?.addEventListener("click", () => {
  loadEmployees(employeeSearchInput.value);
});

employeeSearchInput?.addEventListener("keyup", e => {
  if (e.key === "Enter") loadEmployees(employeeSearchInput.value);
});

addEmployeeBtn?.addEventListener("click", () => {
  localStorage.removeItem("editEmployeeId");
  window.location.href = "addEmployee.html";
});

editEmployeeBtn?.addEventListener("click", () => {

  if (!selectedEmployee) return alert("اختار موظف");

  localStorage.setItem("editEmployeeId", selectedEmployee.id);

  window.location.href = "addEmployee.html";
});

deleteEmployeeBtn?.addEventListener("click", async () => {

  if (!selectedEmployee) return alert("اختار موظف");

  if (selectedEmployee.user_id) {
    await apiRequest(`hr/users/${selectedEmployee.user_id}/`, "DELETE");
  }

  await apiRequest(`hr/employees/${selectedEmployee.id}/`, "DELETE");

  loadEmployees();
});

// ================= START =================
loadEmployees();