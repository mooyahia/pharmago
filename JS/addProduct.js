/* ================= TAB SWITCHING ================= */

const tabs = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(button => {

button.addEventListener("click", () => {

tabs.forEach(btn => btn.classList.remove("active"));
tabContents.forEach(tab => tab.classList.remove("active"));

button.classList.add("active");

document
.getElementById(button.dataset.tab)
.classList.add("active");

});

});


/* ================= STORAGE ================= */

let products = JSON.parse(localStorage.getItem("products")) || []

let editIndex = localStorage.getItem("editIndex")


/* ================= LOAD DATA IF EDIT ================= */

if(editIndex !== null){

document.getElementById("formTitle").innerText="تعديل صنف"

let product = products[editIndex]

document.getElementById("productCode1").value = product.code
document.getElementById("productNameAr").value = product.name
document.getElementById("productCompany").value = product.company
document.getElementById("salePrice").value = product.price

}



/* ================= SAVE PRODUCT ================= */

document
.getElementById("saveProductBtn")
.addEventListener("click",function(){


let product = {

code: document.getElementById("productCode1").value,

name: document.getElementById("productNameAr").value,

company: document.getElementById("productCompany").value,

price: document.getElementById("salePrice").value

}


/* ===== VALIDATION ===== */

if(product.name === ""){

alert("ادخل اسم الصنف")

return

}


/* ===== EDIT ===== */

if(editIndex !== null){

products[editIndex] = product

localStorage.removeItem("editIndex")

}


/* ===== ADD ===== */

else{

products.push(product)

}


/* ===== SAVE STORAGE ===== */

localStorage.setItem("products", JSON.stringify(products))


/* ===== GO BACK TO TABLE ===== */

window.location = "products.html"

})



/* ================= CLOSE BUTTON ================= */

document
.getElementById("closePageBtn")
.addEventListener("click",function(){

window.location="products.html"

})



let selectedRow = null;

/* اختيار الصف */
document.querySelectorAll("#suppliersTable tbody tr").forEach(row=>{
  row.onclick = function(){
    document.querySelectorAll("#suppliersTable tr").forEach(r=>r.classList.remove("selected"));
    this.classList.add("selected");
    selectedRow = this;
  }
});

/* فتح إضافة */
function openAdd(){
  document.getElementById("popup").style.display="flex";
  document.getElementById("popupTitle").innerText="إضافة مورد";
  selectedRow = null;
  clearInputs();
}

/* فتح تعديل */
function openEdit(){
  if(!selectedRow){
    alert("اختار صف الأول");
    return;
  }

  document.getElementById("popup").style.display="flex";
  document.getElementById("popupTitle").innerText="تعديل مورد";

  let cells = selectedRow.children;

  document.getElementById("code").value = cells[0].innerText;
  document.getElementById("name").value = cells[1].innerText;
  document.getElementById("itemCode").value = cells[2].innerText;
  document.getElementById("buyPrice").value = cells[3].innerText;
  document.getElementById("tax").value = cells[4].innerText;
  document.getElementById("sellPrice").value = cells[5].innerText;
  document.getElementById("disc1").value = cells[6].innerText;
}

/* حفظ */
function saveData(){
  let data = [
    code.value,
    name.value,
    itemCode.value,
    buyPrice.value,
    tax.value,
    sellPrice.value,
    disc1.value
  ];

  if(selectedRow){ // تعديل
    data.forEach((val,i)=>{
      selectedRow.children[i].innerText = val;
    });
  }else{ // إضافة
    let table = document.querySelector("#suppliersTable tbody");
    let newRow = table.insertRow();

    data.forEach(val=>{
      let cell = newRow.insertCell();
      cell.innerText = val;
    });

    newRow.onclick = function(){
      document.querySelectorAll("#suppliersTable tr").forEach(r=>r.classList.remove("selected"));
      this.classList.add("selected");
      selectedRow = this;
    }
  }

  closePopup();
}

/* حذف */
function deleteRow(){
  if(!selectedRow){
    alert("اختار صف الأول");
    return;
  }

  selectedRow.remove();
  selectedRow = null;
}

/* غلق */
function closePopup(){
  document.getElementById("popup").style.display="none";
}

/* تنظيف */
function clearInputs(){
  document.querySelectorAll(".popup input").forEach(i=>i.value="");
}