let selectedRow = null
let editMode = false

/* ================= SELECT ROW (بس جداول التابات) ================= */
document.querySelectorAll(".tab-content tbody").forEach(tbody => {
    tbody.addEventListener("click", (e) => {

        let row = e.target.closest("tr")
        if (!row) return

        tbody.querySelectorAll("tr").forEach(r => r.classList.remove("selected"))
        row.classList.add("selected")

        selectedRow = row
    })
})

/* ================= SWITCH TAB ================= */
function switchTab(e, tabId) {

    document.querySelectorAll(".tab-content").forEach(el => {
        el.style.display = "none"
    })

    document.getElementById(tabId).style.display = "block"

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active")
    })

    e.target.classList.add("active")

    selectedRow = null
}

/* ================= GET ACTIVE TABLE ================= */
function getActiveTable() {
    return document.querySelector(".tab-content:not([style*='display: none']) tbody")
}

/* ================= ADD ================= */
function openAdd() {
    editMode = false
    clearFields()
    modal.style.display = "flex"
}

/* ================= EDIT ================= */
function openEdit() {

    if (!selectedRow) {
        alert("اختار صف من الجداول اللي تحت الأول")
        return
    }

    editMode = true

    let cells = selectedRow.children

    for (let i = 0; i < cells.length; i++) {
        document.getElementById("f" + (i + 1)).value = cells[i].innerText
    }

    modal.style.display = "flex"
}

/* ================= SAVE ================= */
function saveData() {

    let table = getActiveTable()

    if (editMode) {

        let cells = selectedRow.children

        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = document.getElementById("f" + (i + 1)).value
        }

    } else {

        let row = table.insertRow()

        let cols = table.parentElement.querySelectorAll("th").length

        let html = ""

        for (let i = 1; i <= cols; i++) {
            html += `<td>${document.getElementById("f" + i).value || "-"}</td>`
        }

        row.innerHTML = html
    }

    closeModal()
    clearFields()
}

/* ================= DELETE ================= */
function deleteRow() {

    if (!selectedRow) {
        alert("اختار صف من الجداول اللي تحت الأول")
        return
    }

    selectedRow.remove()
    selectedRow = null
}

/* ================= MODAL ================= */
function closeModal() {
    modal.style.display = "none"
}

function clearFields() {
    for (let i = 1; i <= 6; i++) {
        document.getElementById("f" + i).value = ""
    }
}

/* ================= SEARCH (فوق بس) ================= */
function searchItem() {

    let input = document.getElementById("searchInput").value.toLowerCase()

    let rows = document.querySelectorAll("#mainTable tbody tr")

    rows.forEach(row => {
        let text = row.innerText.toLowerCase()
        row.style.display = text.includes(input) ? "" : "none"
    })
}