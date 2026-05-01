
let selectedRow=null

const table=document.getElementById("itemsTable")

table.addEventListener("click",(e)=>{

let row=e.target.closest("tr")
if(!row)return

document.querySelectorAll("#itemsTable tr").forEach(r=>r.style.background="")

row.style.background="#d1f0f0"
selectedRow=row

})

function addRow(){

let newRow=table.insertRow()

newRow.innerHTML=`
<td>---</td>
<td>منتج جديد</td>
<td>قطعة</td>
<td>2026-01-01</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
`

updateCount()

}

function deleteRow(){

if(!selectedRow){
alert("اختار صف الأول")
return
}

selectedRow.remove()
selectedRow=null

updateCount()

}

function updateCount(){
document.getElementById("count").innerText=table.rows.length
}
const modal = document.getElementById("addModal");

// فتح البوب اب عند الضغط على زر الإضافة
function addRow() {
  modal.style.display = "block";
}

// غلق البوب اب
function closeModal() {
  modal.style.display = "none";
  clearInputs();
}

// مسح القيم بعد الإضافة
function clearInputs() {
  document.querySelectorAll("#addModal input").forEach(input => input.value = "");
}

// إضافة الصف للجدول
function submitRow() {
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const unit = document.getElementById("unit").value;
  const expiry = document.getElementById("expiry").value;
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const balance = document.getElementById("balance").value;
  const limit = document.getElementById("limit").value;

  if(!code || !name) {
    alert("الرجاء إدخال الكود والاسم");
    return;
  }

  const table = document.getElementById("itemsTable");
  const row = table.insertRow();

  row.innerHTML = `
    <td>${code}</td>
    <td>${name}</td>
    <td>${unit}</td>
    <td>${expiry}</td>
    <td>${quantity}</td>
    <td>${price}</td>
    <td>${balance}</td>
    <td>${limit}</td>
  `;

  updateCount();
  closeModal();
}

// تحديث عداد عدد الأصناف
function updateCount() {
  const count = document.getElementById("itemsTable").rows.length;
  document.getElementById("count").innerText = count;
}

// غلق البوب اب لو ضغطت برة المحتوى
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}