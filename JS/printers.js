
/* ===== DATA ===== */
let available=["HP","Canon","Epson"];
let used=[];

let selectedAvailable=null;
let selectedUsed=null;

/* ===== RENDER ===== */
function render(){

let a=document.getElementById("availableList");
let u=document.getElementById("usedList");

a.innerHTML="";
u.innerHTML="";

available.forEach((p,i)=>{
let d=document.createElement("div");
d.className="item";
d.innerText=p;
d.onclick=()=>{selectedAvailable=i;selectedUsed=null;render();}
if(selectedAvailable===i)d.classList.add("selected");
a.appendChild(d);
});

used.forEach((p,i)=>{
let d=document.createElement("div");
d.className="item";
d.innerText=p;
d.onclick=()=>{selectedUsed=i;selectedAvailable=null;render();}
if(selectedUsed===i)d.classList.add("selected");
u.appendChild(d);
});

}

/* ===== ACTIONS ===== */
function addPrinter(){
let name=prompt("اسم الطابعة");
if(name){available.push(name);render();}
}

function movePrinter(){
if(selectedAvailable!==null){
used.push(available[selectedAvailable]);
available.splice(selectedAvailable,1);
selectedAvailable=null;
render();
}
}

function editPrinter(){
if(selectedAvailable!==null){
let name=prompt("تعديل الاسم",available[selectedAvailable]);
if(name){available[selectedAvailable]=name;render();}
}
}

/* ===== ASSIGN TYPE ===== */
function assignType(type){

if(selectedUsed===null){
alert("اختار طابعة الأول");
return;
}

let printer=used[selectedUsed];

if(type==="تقارير") document.getElementById("rep").innerText=printer;
if(type==="فاتورة") document.getElementById("inv").innerText=printer;
if(type==="باركود") document.getElementById("bar").innerText=printer;
if(type==="كوبون") document.getElementById("cop").innerText=printer;

}

render();
