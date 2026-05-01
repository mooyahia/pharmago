
let selectedRow=null
let editMode=false


document.querySelectorAll("#unitsTable tbody tr").forEach(row=>{
row.onclick=function(){

document.querySelectorAll("#unitsTable tbody tr")
.forEach(r=>r.classList.remove("selected"))

this.classList.add("selected")
selectedRow=this

}
})


function updateRows(){

let rows=document.querySelectorAll("#unitsTable tbody tr")
document.getElementById("rowCount").innerText=rows.length

}

updateRows()


function openAdd(){

editMode=false
document.getElementById("popupTitle").innerText="إضافة وحدة"

document.getElementById("code").value=""
document.getElementById("arabic").value=""
document.getElementById("english").value=""

document.getElementById("popup").style.display="flex"

}


function openEdit(){

if(!selectedRow){

alert("من فضلك اختر الصف الذي تريد تعديله")

return

}

editMode=true

document.getElementById("popupTitle").innerText="تعديل الوحدة"

document.getElementById("code").value=selectedRow.cells[0].innerText
document.getElementById("arabic").value=selectedRow.cells[1].innerText
document.getElementById("english").value=selectedRow.cells[2].innerText

document.getElementById("popup").style.display="flex"

}



function saveData(){

let code=document.getElementById("code").value
let arabic=document.getElementById("arabic").value
let english=document.getElementById("english").value

if(!code||!arabic||!english)return

let table=document.querySelector("#unitsTable tbody")

if(editMode){

selectedRow.cells[0].innerText=code
selectedRow.cells[1].innerText=arabic
selectedRow.cells[2].innerText=english

}else{

let row=table.insertRow()

row.insertCell(0).innerText=code
row.insertCell(1).innerText=arabic
row.insertCell(2).innerText=english

row.onclick=function(){

document.querySelectorAll("#unitsTable tbody tr")
.forEach(r=>r.classList.remove("selected"))

this.classList.add("selected")
selectedRow=this

}

}

closePopup()
updateRows()

}


function deleteRow(){

if(!selectedRow){

alert("من فضلك اختر الصف الذي تريد حذفه")

return

}

if(confirm("هل تريد حذف هذا الصف؟")){

selectedRow.remove()
selectedRow=null
updateRows()

}

}


function closePopup(){

document.getElementById("popup").style.display="none"

}


function searchUnit(){

let input=document.getElementById("searchInput").value.toLowerCase()

document.querySelectorAll("#unitsTable tbody tr")
.forEach(row=>{

let text=row.innerText.toLowerCase()

row.style.display=text.includes(input)?"":"none"

})

}