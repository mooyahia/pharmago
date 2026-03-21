const tableBody = document.querySelector("#productsTable tbody")

let products = JSON.parse(localStorage.getItem("products"))

if(!products){
  products = [
    {code:"001", name:"باراسيتامول", company:"شركة الأدوية", price:"10"},
    {code:"002", name:"بنادول", company:"جلاكسو", price:"15"}
  ]

  localStorage.setItem("products", JSON.stringify(products))
}

let selectedIndex = null



/* ================= RENDER TABLE ================= */

function renderProducts(){

tableBody.innerHTML=""

products.forEach((product,index)=>{

tableBody.innerHTML+=`

<tr data-index="${index}">

<td>${product.code}</td>

<td>${product.name}</td>

<td>${product.company}</td>

<td>${product.price}</td>

</tr>

`

})

addRowSelection()

}


renderProducts()



/* ================= ROW SELECTION ================= */

function addRowSelection(){

const rows = document.querySelectorAll("#productsTable tbody tr")

rows.forEach(row=>{

row.addEventListener("click",function(){

rows.forEach(r=>r.classList.remove("selected-row"))

this.classList.add("selected-row")

selectedIndex = this.dataset.index

})

})

}



/* ================= ADD ================= */

document
.getElementById("addProductBtn")
.onclick=()=>{

window.location="addProduct.html"

}



/* ================= EDIT ================= */

document
.getElementById("editProductBtn")
.onclick=()=>{

if(selectedIndex === null){

alert("اختار صنف الاول")

return

}

localStorage.setItem("editIndex",selectedIndex)

window.location="addProduct.html"

}



/* ================= DELETE ================= */

document
.getElementById("deleteProductBtn")
.onclick=()=>{

if(selectedIndex === null){

alert("اختار صنف للحذف")

return

}

products.splice(selectedIndex,1)

localStorage.setItem("products",JSON.stringify(products))

selectedIndex=null

renderProducts()

}








function filterProducts(){

  let name = document.getElementById("filterName").value.toLowerCase()
  let company = document.getElementById("filterCompany").value.toLowerCase()
  let from = document.getElementById("priceFrom").value
  let to = document.getElementById("priceTo").value

  let filtered = products.filter(p=>{

    return (
      (p.name.toLowerCase().includes(name)) &&
      (p.company.toLowerCase().includes(company)) &&
      (from === "" || p.price >= from) &&
      (to === "" || p.price <= to)
    )

  })

  renderFiltered(filtered)
}


function renderFiltered(list){

  tableBody.innerHTML=""

  list.forEach((product,index)=>{

    tableBody.innerHTML+=`
      <tr>
        <td>${product.code}</td>
        <td>${product.name}</td>
        <td>${product.company}</td>
        <td>${product.price}</td>
      </tr>
    `

  })

}







function updateFilter(num){

  let type = document.getElementById(`filter${num}Type`).value
  let container = document.getElementById(`filter${num}Input`)

  if(type === "price"){
    container.innerHTML = `
      <input type="number" id="from${num}" placeholder="من">
      <input type="number" id="to${num}" placeholder="إلى">
    `
  }else{
    container.innerHTML = `
      <input type="text" id="value${num}" placeholder="القيمة">
    `
  }

}



function updateFilter(num){

  let type = document.getElementById(`filter${num}Type`).value
  let container = document.getElementById(`filter${num}Input`)

  if(type === "price"){
    container.innerHTML = `
      <input type="number" id="from${num}" placeholder="من">
      <input type="number" id="to${num}" placeholder="إلى">
    `
  }else{
    container.innerHTML = `
      <input type="text" id="value${num}" placeholder="القيمة">
    `
  }

}


function filterProducts(){

  let type1 = document.getElementById("filter1Type").value
  let type2 = document.getElementById("filter2Type").value

  let active = document.getElementById("active").checked
  let notActive = document.getElementById("notActive").checked
  let radio = document.querySelector('input[name="type"]:checked').value

  let filtered = products.filter(p=>{

    let cond1 = true
    let cond2 = true

    // فلتر 1
    if(type1){
      if(type1 === "price"){
        let from = document.getElementById("from1")?.value
        let to = document.getElementById("to1")?.value

        cond1 = (!from || p.price >= from) &&
                (!to || p.price <= to)
      }else{
        let val = document.getElementById("value1")?.value || ""
        cond1 = p[type1].toString().includes(val)
      }
    }

    // فلتر 2
    if(type2){
      if(type2 === "price"){
        let from = document.getElementById("from2")?.value
        let to = document.getElementById("to2")?.value

        cond2 = (!from || p.price >= from) &&
                (!to || p.price <= to)
      }else{
        let val = document.getElementById("value2")?.value || ""
        cond2 = p[type2].toString().includes(val)
      }
    }

    return cond1 && cond2

  })

  renderFiltered(filtered)
}