const table = document.getElementById("itemsTable");
const countSpan = document.getElementById("itemsCount");
const filterBtn = document.getElementById("filterBtn");
const searchInput = document.getElementById("nameOrCode");

const API_URL = "http://100.80.3.109:8000/api/stocks/shortages/";

// ================= تحميل البيانات =================
async function loadItems(id = "") {
  try {
    let url = API_URL;

    // البحث بالـ id
    if (id.trim() !== "") {
      url += `?product_id=${encodeURIComponent(id)}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await res.json();

    renderTable(data.data || []);
  } catch (error) {
    console.error(error);

    table.innerHTML = `
      <tr>
        <td colspan="7">حدث خطأ أثناء تحميل البيانات</td>
      </tr>
    `;
  }
}

// ================= عرض البيانات =================
function renderTable(items) {
  table.innerHTML = "";

  if (!items.length) {
    table.innerHTML = `
      <tr>
        <td colspan="7">لا توجد بيانات</td>
      </tr>
    `;

    countSpan.textContent = "0";
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.product_id ?? "-"}</td>
      <td>${item.product_name ?? "-"}</td>
      <td>${item.consumption_rate ?? 0}</td>
      <td>${item.current_stock ?? 0}</td>
      <td>${item.purchase_price ?? 0}</td>
      <td>${item.sale_price ?? 0}</td>
      <td>${item.status ?? "-"}</td>
    `;

    table.appendChild(row);
  });

  countSpan.textContent = items.length;
}

// ================= زر البحث =================
filterBtn.onclick = () => {
  loadItems(searchInput.value);
};

// ================= بحث بالإنتر =================
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loadItems(searchInput.value);
  }
});

// ================= أول تحميل =================
loadItems();