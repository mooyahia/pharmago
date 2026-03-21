
let selectedRow=null
let editMode=false

const table=document.getElementById("employeesTableBody")

table.addEventListener("click",function(e){

let row=e.target.closest("tr")
if(!row)return

document.querySelectorAll("tbody tr").forEach(r=>r.classList.remove("selected"))

row.classList.add("selected")
selectedRow=row

})

function openAdd(){
editMode=false
clearInputs()
document.getElementById("employeeModal").style.display="flex"
}

function openEdit(){

if(!selectedRow){
alert("من فضلك اختر الصف الذي تريد تعديله")
return
}

editMode=true

let cells=selectedRow.children

code.value=cells[1].innerText
empName.value=cells[2].innerText
job.value=cells[3].innerText
qualification.value=cells[4].innerText
date.value=cells[5].innerText
workType.value=cells[6].innerText
shift.value=cells[7].innerText
username.value=cells[8].innerText

document.getElementById("employeeModal").style.display="flex"

}

function saveEmployee(){

let codeVal=code.value
let nameVal=empName.value
let jobVal=job.value
let qualVal=qualification.value
let dateVal=date.value
let workVal=workType.value
let shiftVal=shift.value
let userVal=username.value

if(editMode){

let cells=selectedRow.children

cells[1].innerText=codeVal
cells[2].innerText=nameVal
cells[3].innerText=jobVal
cells[4].innerText=qualVal
cells[5].innerText=dateVal
cells[6].innerText=workVal
cells[7].innerText=shiftVal
cells[8].innerText=userVal

}else{

let newRow=table.insertRow()

newRow.innerHTML=`
<td>${table.rows.length}</td>
<td>${codeVal}</td>
<td>${nameVal}</td>
<td>${jobVal}</td>
<td>${qualVal}</td>
<td>${dateVal}</td>
<td>${workVal}</td>
<td>${shiftVal}</td>
<td>${userVal}</td>
`

}

closeModal()
clearInputs()

}

function deleteRow(){

if(!selectedRow){
alert("من فضلك اختر الصف الذي تريد حذفه")
return
}

selectedRow.remove()
selectedRow=null

}

function closeModal(){
document.getElementById("employeeModal").style.display="none"
}

function clearInputs(){

code.value=""
empName.value=""
job.value=""
qualification.value=""
date.value=""
workType.value=""
shift.value=""
username.value=""

}

/* البحث */

const searchInput=document.getElementById("employeeSearchInput")
const searchButton=document.getElementById("searchButton")

function searchEmployee(){

let filter=searchInput.value.toLowerCase()

let rows=table.getElementsByTagName("tr")

for(let i=0;i<rows.length;i++){

let text=rows[i].innerText.toLowerCase()

if(text.includes(filter)){
rows[i].style.display=""
}else{
rows[i].style.display="none"
}

}

}

searchButton.addEventListener("click",searchEmployee)

searchInput.addEventListener("keyup",function(e){
if(e.key==="Enter") searchEmployee()
})
