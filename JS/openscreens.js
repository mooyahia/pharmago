/* ================= تعريف العناصر ================= */
const allScreensList = document.querySelector(".allScreensList");
const openScreensList = document.querySelector(".openScreensList");

const leftBtn = document.querySelector(".controls .fa-arrow-left");
const rightBtn = document.querySelector(".controls .fa-arrow-right");

let selectedItem = null;

/* ================= تحديد العنصر ================= */
function selectItem(item) {

  // إزالة التحديد من أي عنصر
  document.querySelectorAll(".allScreensList div, .openScreensList div")
    .forEach(el => el.classList.remove("selected"));

  // تحديد العنصر الجديد
  selectedItem = item;
  item.classList.add("selected");

}

/* ================= اختيار عنصر بالقوائم ================= */
function setupListSelection(list) {

  list.addEventListener("click", function (e) {

    const item = e.target.closest("div");

    if (!item || !list.contains(item)) return;

    selectItem(item);

  });

}

setupListSelection(allScreensList);
setupListSelection(openScreensList);

/* ================= نقل من All → Open ================= */
rightBtn.addEventListener("click", function () {

  if (!selectedItem) return;

  if (selectedItem.parentElement === allScreensList) {

    openScreensList.appendChild(selectedItem);

    selectItem(selectedItem);

  }

});

/* ================= نقل من Open → All ================= */
leftBtn.addEventListener("click", function () {

  if (!selectedItem) return;

  if (selectedItem.parentElement === openScreensList) {

    allScreensList.appendChild(selectedItem);

    selectItem(selectedItem);

  }

});

/* ================= API GET ================= */
const token = localStorage.getItem("authToken");
const apiGetScreens = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/";
const apiPostMoveScreen = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/move/";

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

      allScreensList.innerHTML = "";
      openScreensList.innerHTML = "";

      data.forEach(screen => {

        const div = document.createElement("div");

        div.textContent = screen.name;
        div.dataset.id = screen.id;

        if (screen.is_open) {
          openScreensList.appendChild(div);
        } else {
          allScreensList.appendChild(div);
        }

      });

    })
    .catch(err => console.error(err));

}

/* ================= API POST ================= */
function moveScreen(id, from, to) {

  fetch(apiPostMoveScreen, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      screen_id: id,
      from: from,
      to: to
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

}

/* ================= ربط النقل بالـ API ================= */

rightBtn.addEventListener("click", function () {

  if (!selectedItem) return;

  if (selectedItem.parentElement === allScreensList) {

    const id = selectedItem.dataset.id;

    openScreensList.appendChild(selectedItem);

    moveScreen(id, "all", "open");

    selectItem(selectedItem);

  }

});

leftBtn.addEventListener("click", function () {

  if (!selectedItem) return;

  if (selectedItem.parentElement === openScreensList) {

    const id = selectedItem.dataset.id;

    allScreensList.appendChild(selectedItem);

    moveScreen(id, "open", "all");

    selectItem(selectedItem);

  }

});

/* ================= تشغيل عند فتح الصفحة ================= */
window.addEventListener("DOMContentLoaded", loadScreens);