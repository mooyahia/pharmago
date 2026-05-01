/* ================= ELEMENTS ================= */

const tableBody = document.getElementById("tableBody")

const createBtn = document.getElementById("createOperationBtn")
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")
const deleteBtn = document.getElementById("deleteBtn")

const modal = document.getElementById("modalOverlay")
const closeModalBtn = document.getElementById("closeModalBtn")
const form = document.getElementById("maintenanceForm")

const repeatSelect = document.getElementById("repeat")
const unitSelect = document.getElementById("unit")

/* ================= VARIABLES ================= */

let selectedRow = null

/* ================= SELECT ROW ================= */

tableBody.addEventListener("click", (e) => {

  const row = e.target.closest(".maintenance-table__row")
  if (!row) return

  document.querySelectorAll(".maintenance-table__row")
    .forEach(r => r.classList.remove("selected"))

  row.classList.add("selected")
  selectedRow = row

})

/* ================= OPEN MODAL ================= */

createBtn.addEventListener("click", () => {
  modal.style.display = "flex"
})

/* ================= CLOSE MODAL ================= */

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none"
})

/* ================= SAVE ================= */

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const path = document.getElementById("path").value

  if (!name || !path) {
    alert("املأ البيانات")
    return
  }

  const row = document.createElement("div")
  row.className = "maintenance-table__row"

  row.innerHTML = `
    <div>${name}</div>
    <div>${path}</div>
    <div class="status-active">نشط</div>
  `

  tableBody.appendChild(row)

  modal.style.display = "none"
  form.reset()
})

/* ================= DELETE ================= */

deleteBtn.addEventListener("click", () => {

  if (!selectedRow) {
    alert("اختار عملية الأول")
    return
  }

  selectedRow.remove()
  selectedRow = null

})

/* ================= START ================= */

startBtn.addEventListener("click", () => {

  if (!selectedRow) {
    alert("اختار عملية")
    return
  }

  selectedRow.children[2].innerText = "نشط"

})

/* ================= STOP ================= */

stopBtn.addEventListener("click", () => {

  if (!selectedRow) {
    alert("اختار عملية")
    return
  }

  selectedRow.children[2].innerText = "موقوف"

})

/* ================= REPEAT LOGIC ================= */

function updateUnitOptions() {

  const value = repeatSelect.value
  unitSelect.innerHTML = ""

  if (value === "يومياً") {

    unitSelect.innerHTML = `<option>ساعة</option>`

  } else if (value === "أسبوعياً") {

    unitSelect.innerHTML = `<option>يوم</option>`

  } else if (value === "شهرياً") {

    unitSelect.innerHTML = `
      <option>يوم</option>
      <option>أسبوع</option>
    `
  }
}

repeatSelect.addEventListener("change", updateUnitOptions)

/* ================= INIT ================= */

updateUnitOptions()



const deleteToggle = document.getElementById("deleteToggle");
const deleteAfterNumber = document.getElementById("deleteAfterNumber");
const deleteAfterUnit = document.getElementById("deleteAfterUnit");

function toggleDeleteFields() {
  const isEnabled = deleteToggle.checked;

  deleteAfterNumber.disabled = !isEnabled;
  deleteAfterUnit.disabled = !isEnabled;
}

deleteToggle.addEventListener("change", toggleDeleteFields);

// initial state
toggleDeleteFields();