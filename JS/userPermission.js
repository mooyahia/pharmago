// القوائم
const favouriteList = document.querySelector('.favouriteScreensList');
const allScreensList = document.querySelector('.allScreensList');

// الأيقونات
const upBtn = document.querySelector('.favouriteScreensControls .fa-arrow-up');
const downBtn = document.querySelector('.favouriteScreensControls .fa-arrow-down');
const leftBtn = document.querySelector('.controls .fa-arrow-left');
const rightBtn = document.querySelector('.controls .fa-arrow-right');

// متغير لتخزين العنصر المحدد
let selectedItem = null;

// دالة لتحديث التحديد بصريًا
function selectItem(item) {
  // إزالة التحديد من العنصر القديم
  if (selectedItem) selectedItem.classList.remove('selected');
  selectedItem = item;
  selectedItem.classList.add('selected');
}

// استخدام event delegation بدل querySelectorAll
[favouriteList, allScreensList].forEach(list => {
  list.addEventListener('click', (e) => {
    const item = e.target.closest('div');
    if (!item) return;
    selectItem(item);
  });
});

// تحريك العنصر للأعلى
upBtn.addEventListener('click', () => {
  if (!selectedItem) return;
  const prev = selectedItem.previousElementSibling;
  if (prev) selectedItem.parentNode.insertBefore(selectedItem, prev);
});
// تحريك العنصر للأسفل
downBtn.addEventListener('click', () => {
  if (!selectedItem) return;
  const next = selectedItem.nextElementSibling;
  if (next) {
    // نحط العنصر المحدد بعد العنصر التالي
    selectedItem.parentNode.insertBefore(selectedItem, next.nextSibling);
  }
});


// زر السهم اليمين → ينقل إلى المفضلة
rightBtn.addEventListener('click', () => {
  if (!selectedItem) return;
  if (selectedItem.parentNode !== favouriteList) {
    favouriteList.appendChild(selectedItem);
    selectItem(selectedItem);
  }
});

// زر السهم اليسار → ينقل إلى كل الشاشات
leftBtn.addEventListener('click', () => {
  if (!selectedItem) return;
  if (selectedItem.parentNode !== allScreensList) {
    allScreensList.appendChild(selectedItem);
    selectItem(selectedItem);
  }
});




/* بيانات الموظفين */

const employees = [

{code:101,name:"أحمد محمد"},
{code:102,name:"محمد علي"},
{code:103,name:"يوسف حسن"},
{code:104,name:"علي محمود"},
{code:105,name:"عبدالله أحمد"}

];


/* البحث */

function searchUser(){

let input =
document.getElementById("searchInput")
.value
.toLowerCase();

let results =
employees.filter(emp =>
emp.name.toLowerCase().includes(input) ||
emp.code.toString().includes(input)
);

let resultsBody =
document.getElementById("resultsBody");

resultsBody.innerHTML="";


results.forEach(emp =>{

let row = document.createElement("tr");

row.innerHTML=`

<td>${emp.code}</td>
<td>${emp.name}</td>

`;

row.onclick=function(){

document.getElementById("selectedUserName")
.innerText=emp.name;

document.getElementById("selectedUser")
.style.display="block";

document.getElementById("searchResults")
.style.display="none";

};

resultsBody.appendChild(row);

});


if(results.length>0){

document.getElementById("searchResults")
.style.display="block";

}else{

document.getElementById("searchResults")
.style.display="none";

}

}