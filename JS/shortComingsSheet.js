
const table = document.getElementById("itemsTable");
const countSpan = document.getElementById("itemsCount");
const modal = document.getElementById("modal");

let selectedRow = null;

// ===== تحديث العدد =====
function updateCount(){
  countSpan.textContent = table.rows.length;
}

// ===== فتح مودال =====
document.getElementById("openModal").onclick = () => {
  modal.style.display = "flex";
};

// ===== غلق مودال =====
document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
};

// ===== إضافة صف =====
document.getElementById("addRow").onclick = () => {

  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${company.value}</td>
    <td>${code.value}</td>
    <td>${name.value}</td>
    <td>${unit.value}</td>
    <td>${usage.value}</td>
    <td>${stock.value}</td>
    <td>${cost.value}</td>
    <td>${price.value}</td>
  `;

  // ===== اختيار الصف =====
  row.onclick = () => {
    document.querySelectorAll("#itemsTable tr").forEach(r => r.classList.remove("selected-row"));
    row.classList.add("selected-row");
    selectedRow = row;
  };

  table.appendChild(row);
  updateCount();
  modal.style.display = "none";
};

// ===== حذف =====
document.getElementById("deleteBtn").onclick = () => {
  if(selectedRow){
    selectedRow.remove();
    selectedRow = null;
    updateCount();
  } else {
    alert("اختار صف الأول");
  }
};

// ===== طباعة =====
document.querySelector(".btn-print").onclick = () => window.print();
