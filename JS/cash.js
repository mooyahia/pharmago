/* =========================================
TAB SWITCH
========================================= */

const tabSupply = document.getElementById("tab-supply")
const tabExpense = document.getElementById("tab-expense")

const supplyPage = document.getElementById("supply-page")
const expensePage = document.getElementById("expense-page")

const pageTitle = document.querySelector(".page-title") // 👈 العنوان

tabSupply.onclick = function () {
  tabSupply.classList.add("active")
  tabExpense.classList.remove("active")

  supplyPage.classList.remove("hidden")
  expensePage.classList.add("hidden")

  pageTitle.innerText = "توريد النقدية" // 👈 تغيير العنوان
}

tabExpense.onclick = function () {
  tabExpense.classList.add("active")
  tabSupply.classList.remove("active")

  expensePage.classList.remove("hidden")
  supplyPage.classList.add("hidden")

  pageTitle.innerText = "صرف النقدية" // 👈 تغيير العنوان
}


/* =========================================
OPEN POPUP
========================================= */

const modal = document.getElementById("add-modal")

document.getElementById("open-modal").onclick = function () {
  modal.style.display = "flex"
}


/* =========================================
CLOSE POPUP
========================================= */

document.getElementById("close-modal").onclick = function () {
  modal.style.display = "none"
}


/* =========================================
ADD ROW
========================================= */

document.getElementById("add-form").onsubmit = function (e) {

  e.preventDefault()

  const doc = document.getElementById("docCode").value
  const amount = document.getElementById("amount").value
  const date = document.getElementById("date").value
  const from = document.getElementById("from").value

  let row = `
  <tr>
    <td>${doc}</td>
    <td>${amount}</td>
    <td>${date}</td>
    <td>${from}</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>admin</td>
  </tr>
  `

  if (!supplyPage.classList.contains("hidden")) {
    document.getElementById("supply-table-body").innerHTML += row
  } else {
    document.getElementById("expense-table-body").innerHTML += row
  }

  modal.style.display = "none"

  this.reset()
}