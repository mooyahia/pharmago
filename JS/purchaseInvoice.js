/* ================= MOCK DATA ================= */
let items = [
  { code: 46298, name: "ريتنوزورم أقراص", unit: "علبة", qty: 10, price: 32 },
  { code: 27088, name: "جل", unit: "علبة", qty: 20, price: 6 },
];

/* ================= RENDER TABLE ================= */
function renderItems() {
  const tbody = document.getElementById("itemsTableBody");
  tbody.innerHTML = "";

  let total = 0;

  items.forEach((item, index) => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;

    tbody.innerHTML += `
      <tr onclick="selectRow(${index})">
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${itemTotal}</td>
      </tr>
    `;
  });

  document.getElementById("totalAmount").value = total.toFixed(2);
}

/* ================= SELECT ROW ================= */
let selectedIndex = null;

function selectRow(index) {
  selectedIndex = index;
  renderItems();

  const rows = document.querySelectorAll("#itemsTableBody tr");
  if (rows[index]) rows[index].classList.add("selected");
}

/* ================= ADD ITEM ================= */
function addItem() {
  items.push({
    code: Math.floor(Math.random() * 10000),
    name: "صنف جديد",
    unit: "علبة",
    qty: 1,
    price: 10
  });
  renderItems();
}

/* ================= DELETE ITEM ================= */
function deleteItem() {
  if (selectedIndex !== null) {
    items.splice(selectedIndex, 1);
    selectedIndex = null;
    renderItems();
  }
}

/* ================= ACTIONS ================= */
function saveInvoice() {
  alert("تم الحفظ");
}

function printInvoice() {
  window.print();
}

function newInvoice() {
  items = [];
  renderItems();
}

/* ================= INIT ================= */
renderItems();
