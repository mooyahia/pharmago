

/* ================= تعريف العناصر ================= */
const allScreensList = document.querySelector('.allScreensList');     // كل الشاشات
const openScreensList = document.querySelector('.openScreensList');   // الشاشات المفتوحة

// أيقونات النقل
const leftBtn = document.querySelector('.controls .fa-arrow-left');  // نقل من open -> all
const rightBtn = document.querySelector('.controls .fa-arrow-right'); // نقل من all -> open

// العنصر المحدد
let selectedItem = null;

// API URLs
const token = localStorage.getItem("authToken");
const apiGetScreens = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/";
const apiPostMoveScreen = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/move/";

/* ================= دالة لتحديد العنصر ================= */
function selectItem(item) {
  if (selectedItem) selectedItem.classList.remove('selected');
  selectedItem = item;
  selectedItem.classList.toggle('selected');
}

/* ================= event delegation ================= */
[allScreensList, openScreensList].forEach(list => {
  list.addEventListener('click', (e) => {
    const item = e.target.closest('div');
    if (!item) return;
    selectItem(item);
  });
});

/* ================= GET API: جلب الشاشات ================= */
function loadScreens() {
  fetch(apiGetScreens, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    allScreensList.innerHTML = '';
    openScreensList.innerHTML = '';
    data.forEach(screen => {
      const div = document.createElement('div');
      div.textContent = screen.name;
      div.dataset.screenId = screen.id;
      if(screen.is_open) {
        openScreensList.appendChild(div);
      } else {
        allScreensList.appendChild(div);
      }
    });
  })
  .catch(err => console.error("Error fetching screens:", err));
}

/* ================= POST API: نقل شاشة ================= */
function moveScreen(screenId, fromList, toList) {
  fetch(apiPostMoveScreen, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      screen_id: screenId,
      from: fromList,
      to: toList
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Move response:", data);
  })
  .catch(err => console.error("Error moving screen:", err));
}

/* ================= نقل الشاشات ================= */
rightBtn.addEventListener('click', () => {
  if(!selectedItem) return;
  if(selectedItem.parentNode === allScreensList) {
    const screenId = selectedItem.dataset.screenId;
    openScreensList.appendChild(selectedItem);
    selectItem(selectedItem);
    moveScreen(screenId, "all", "open");
  }
});

leftBtn.addEventListener('click', () => {
  if(!selectedItem) return;
  if(selectedItem.parentNode === openScreensList) {
    const screenId = selectedItem.dataset.screenId;
    allScreensList.appendChild(selectedItem);
    selectItem(selectedItem);
    moveScreen(screenId, "open", "all");
  }
});

/* ================= تشغيل عند تحميل الصفحة ================= */
window.addEventListener("DOMContentLoaded", loadScreens);