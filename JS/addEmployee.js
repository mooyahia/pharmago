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

    console.error("NETWORK ERROR:", err);

    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
}

// ================= EDIT MODE =================
let editingEmployeeId = localStorage.getItem("editEmployeeId");

let editingUserId = null;

// ================= TABS =================
const empDataTab = document.getElementById("empDataTab");

const empSalaryTab = document.getElementById("empSalaryTab");

const employeeTab = document.getElementById("employeeTab");

const salaryTab = document.getElementById("salaryTab");

empDataTab.onclick = () => switchTab("employee");

empSalaryTab.onclick = () => switchTab("salary");

function switchTab(tab) {

  if (tab === "employee") {

    empDataTab.classList.add("active");

    empSalaryTab.classList.remove("active");

    employeeTab.classList.add("active");

    salaryTab.classList.remove("active");

  } else {

    empSalaryTab.classList.add("active");

    empDataTab.classList.remove("active");

    salaryTab.classList.add("active");

    employeeTab.classList.remove("active");
  }
}

// ================= INPUTS =================
const saveBtn = document.getElementById("saveEmployeeButton");

const employeeName = document.getElementById("employeeName");

const employeePhone = document.getElementById("employeePhone");

const employeeAddress = document.getElementById("employeeAddress");

const employeeUserName = document.getElementById("employeeUserName");

const employeePassword = document.getElementById("employeePassword");

const employeeConfirmPassword = document.getElementById("employeeConfirmPassword");

const employeeJobTitle = document.getElementById("employeeJobTitle");

const employeeHireDate = document.getElementById("employeeHireDate");

const employeeBaseSalary = document.getElementById("employeeBaseSalary");
const employeeStatus = document.getElementById("isActive");

// ================= LOAD EMPLOYEE =================
async function loadEmployeeForEdit() {

  if (!editingEmployeeId) return;

  try {

    const empRes = await apiRequest("hr/employees/");

    const employees = empRes?.data?.data || empRes?.data || [];

    const emp = employees.find(
      e => String(e.id) === String(editingEmployeeId)
    );

    if (!emp) return alert("الموظف غير موجود");

    const usersRes = await apiRequest("hr/users/");

    const users = usersRes?.data?.data || usersRes?.data || [];

    const linkedUser = users.find(
      u => String(u.employee) === String(emp.id)
    );

    editingUserId = linkedUser?.id || null;

    employeeName.value = emp.full_name || "";

    employeePhone.value = emp.phone || "";

    employeeAddress.value = emp.address || "";

    employeeJobTitle.value = emp.job_title || "";
    employeeStatus.value = String(emp.is_active ?? "1");

    employeeHireDate.value = emp.hire_date || "";

    employeeBaseSalary.value = emp.salary || "";

    employeeUserName.value = linkedUser?.username || "";

    saveBtn.textContent = "تعديل الموظف";

  } catch (err) {

    console.error(err);

    alert("خطأ في تحميل الموظف");
  }
}

// ================= SAVE =================
saveBtn.onclick = async () => {

  const isEdit = !!editingEmployeeId;

  const full_name = employeeName.value.trim();

  const phone = employeePhone.value.trim();

  const address = employeeAddress.value.trim();

  const username = employeeUserName.value.trim();

  const password = employeePassword.value;

  const confirmPassword = employeeConfirmPassword.value;

  const job_title = employeeJobTitle.value.trim();

  const hire_date = employeeHireDate.value;

  const salary = employeeBaseSalary.value;

  if (!full_name) return alert("اسم الموظف مطلوب");

  if (password !== confirmPassword) return alert("كلمة المرور غير متطابقة");

  try {

    // ================= EMPLOYEE (PUT IN BODY) =================
    const employeeData = {
      id: isEdit ? Number(editingEmployeeId) : null, // ✅ ID in body
      full_name,
      phone: phone || null,
      address: address || null,
      job_title: job_title || null,
      hire_date: hire_date || null,
      salary: salary ? parseFloat(salary) : null,
      is_active: document.getElementById("isActive").value,
      pharmacy: 1
    };

    const empRes = await apiRequest(
      "hr/employees/",   // ✅ NO ID IN URL
      isEdit ? "PUT" : "POST",
      employeeData
    );

    const employeeId = editingEmployeeId || empRes?.data?.data?.id;

    if (!empRes.ok || !employeeId) return alert("فشل حفظ الموظف");

    // ================= USER =================
    const userData = {
      id: editingUserId || null,
      employee: Number(employeeId),
      username: username || `emp${employeeId}`,
      password: password || undefined,
      user_role: job_title || "employee"
    };

    if (password) userData.password = password;

    const userRes = await apiRequest(
      "hr/users/",
      editingUserId ? "PUT" : "POST",
      userData
    );

    if (!userRes.ok) return alert(userRes.data?.message );

    alert(isEdit ? "تم التعديل" : "تم الحفظ");

    localStorage.removeItem("editEmployeeId");

    window.location.href = "employees.html";

  } catch (err) {

    console.error(err);

    alert("خطأ في السيرفر");
  }
};

loadEmployeeForEdit();