
let selectedRow=null

/* تحديد صف */
document.querySelector("#table tbody").addEventListener("click",e=>{
let row=e.target.closest("tr")
if(!row)return

document.querySelectorAll("#table tbody tr").forEach(r=>r.classList.remove("selected"))
row.classList.add("selected")

selectedRow=row
})

/* popup */
function openAdd(){
modal.style.display="flex"
}

function closeModal(){
modal.style.display="none"
clear()
}

/* إضافة */
function addData(){

let table=document.querySelector("#table tbody")

let row=table.insertRow()

row.innerHTML=`
<td>${code.value}</td>
<td>${name.value}</td>
<td>${company.value}</td>
<td>${price.value}</td>
<td>${scientific.value}</td>
`

closeModal()
}

/* حذف */
function deleteRow(){

if(!selectedRow){
alert("اختار صف الأول")
return
}

selectedRow.remove()
selectedRow=null
}

/* تنظيف */
function clear(){
code.value=""
name.value=""
company.value=""
price.value=""
scientific.value=""
}