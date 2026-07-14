// ================= API =================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

// Helper
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

    const result = await res.json();

    if (!res.ok) throw result;

    return result;
  } catch (err) {
    console.error("API Error:", err);
    alert(err.error || "حصل خطأ");
    throw err;
  }
}

// ================= LOAD SHIFT =================
async function loadShift() {
  try {
    const res = await apiRequest("hr/deliver-drawer/");

    const shift = res.data?.[0];

    if (!shift) {
      console.log("No active shift");
      return;
    }

    // ================= FILL DATA =================
    document.getElementById("currentUser").value =
      shift.user_name || "";

    document.getElementById("initialBalance").value =
      shift.opening_balance || 0;

    document.getElementById("cashInDrawer").value =
      shift.actual_cash || 0;

    // ================= TIME =================
    if (shift.start_time) {
      document.getElementById("shiftStart").value =
        new Date(shift.start_time).toISOString().slice(0, 16);
    }

    // ================= STATUS =================
    const statusEl = document.getElementById("shiftStatus");
    if (statusEl) {
      statusEl.textContent = shift.status || "";
      statusEl.style.color =
        shift.status === "Open" ? "green" : "red";
    }

  } catch (err) {
    console.log("No active shift");
  }
}

// ================= CLOSE SHIFT =================
document.getElementById("saveBtn")?.addEventListener("click", async () => {
  const cash = document.getElementById("cashInDrawer")?.value;

  if (!cash) {
    alert("ادخل النقد داخل الدرج");
    return;
  }

  try {
    await apiRequest("hr/close-drawer/", "POST", {
      actual_cash: Number(cash),
    });

    alert("تم تسليم الدرج بنجاح ✅");

    // Reload بعد القفل
    location.reload();

  } catch (err) {
    console.error(err);
  }
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadShift);