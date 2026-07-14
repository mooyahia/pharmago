const API_BASE_URL = "http://100.80.3.109:8000/api/";

async function apiRequest(url, method = "GET", data = null) {
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
}

// ================= SAVE CUSTOMER =================
document.getElementById("saveBtn").onclick = async () => {

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const initial_balance = document.getElementById("openingBalance").value;

  if (!name) {
    alert("الاسم مطلوب");
    return;
  }

  const payload = {
    name: name,
    phone: phone || null,
    initial_balance: parseFloat(initial_balance) || 0,
  };

  console.log("SENDING:", payload);

  const res = await apiRequest("sell_invoice/customers/", "POST", payload);

  console.log("RESPONSE:", res);

  if (!res.ok) {
    alert("فشل الحفظ");
    return;
  }

  alert("تم حفظ العميل بنجاح");
};