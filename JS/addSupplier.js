
// ================= ELEMENTS =================
const contactsBody = document.getElementById("contactsBody");
const deleteBtn = document.querySelector(".btn-delete");

let selectedRow = null;

// ================= DATA =================
const demoData = [
  {name:"أحمد", phone:"010000000", address:"القاهرة"},
];

// ================= RENDER TABLE =================
demoData.forEach(c => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${c.name}</td>
    <td>${c.phone}</td>
    <td>${c.address}</td>
  `;

  // ================= SELECT ROW =================
  row.addEventListener("click", () => {

    document.querySelectorAll(".contacts-table tbody tr")
      .forEach(r => r.classList.remove("selected-row"));

    row.classList.add("selected-row");
    selectedRow = row;
  });

  contactsBody.appendChild(row);
});

// ================= DELETE =================
deleteBtn.addEventListener("click", () => {

  if (selectedRow) {
    selectedRow.remove();
    selectedRow = null;
  } else {
    alert("اختار صف الأول");
  }

});
