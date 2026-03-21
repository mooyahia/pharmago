/* ================= عناصر القوائم والأزرار ================= */
const allScreensList = document.querySelector('.allScreensList');       // كل الشاشات
const favouriteScreensList = document.querySelector('.favouriteScreensList'); // المفضلة

const upBtn = document.querySelector('.controls .fa-arrow-up');
const downBtn = document.querySelector('.controls .fa-arrow-down');
const leftBtn = document.querySelector('.controls .fa-arrow-left');
const rightBtn = document.querySelector('.controls .fa-arrow-right');

let selectedItem = null;

// ================= API URLs =================
const token = localStorage.getItem("authToken");
const apiGetScreens = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/";
const apiPostMoveScreen = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/screens/move/";

/* ================= دالة لتحديد العنصر ================= */
function selectItem(item) {
    if (selectedItem) selectedItem.classList.remove('selected');
    selectedItem = item;
    if (selectedItem) selectedItem.classList.add('selected');
}

/* ================= event delegation ================= */
[allScreensList, favouriteScreensList].forEach(list => {
    list.addEventListener('click', e => {
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
        favouriteScreensList.innerHTML = '';

        data.forEach(screen => {
            const div = document.createElement('div');
            div.textContent = screen.name;
            div.dataset.screenId = screen.id;

            if (screen.is_favourite) {
                favouriteScreensList.appendChild(div);
            } else {
                allScreensList.appendChild(div);
            }
        });
    })
    .catch(err => console.error("Error fetching screens:", err));
}

/* ================= POST API: نقل الشاشة ================= */
function moveScreen(screenId, fromList, toList, newIndex = null) {
    fetch(apiPostMoveScreen, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
            screen_id: screenId,
            from: fromList,
            to: toList,
            index: newIndex
        })
    })
    .then(res => res.json())
    .then(data => console.log("Move response:", data))
    .catch(err => console.error("Error moving screen:", err));
}

/* ================= تغيير ترتيب داخل نفس القائمة ================= */
upBtn.addEventListener('click', () => {
    if (!selectedItem) return;
    const parentList = selectedItem.parentNode;
    const prev = selectedItem.previousElementSibling;
    if (prev) {
        parentList.insertBefore(selectedItem, prev);
        moveScreen(selectedItem.dataset.screenId, 
            parentList === allScreensList ? "all" : "favourite",
            parentList === allScreensList ? "all" : "favourite",
            Array.from(parentList.children).indexOf(selectedItem)
        );
    }
});

downBtn.addEventListener('click', () => {
    if (!selectedItem) return;
    const parentList = selectedItem.parentNode;
    const next = selectedItem.nextElementSibling;
    if (next) {
        parentList.insertBefore(next, selectedItem);
        moveScreen(selectedItem.dataset.screenId, 
            parentList === allScreensList ? "all" : "favourite",
            parentList === allScreensList ? "all" : "favourite",
            Array.from(parentList.children).indexOf(selectedItem)
        );
    }
});

/* ================= نقل بين القوائم ================= */
rightBtn.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.parentNode === allScreensList) {
        favouriteScreensList.appendChild(selectedItem);
        moveScreen(selectedItem.dataset.screenId, "all", "favourite");
        selectItem(selectedItem);
    }
});

leftBtn.addEventListener('click', () => {
    if (!selectedItem) return;
    if (selectedItem.parentNode === favouriteScreensList) {
        allScreensList.appendChild(selectedItem);
        moveScreen(selectedItem.dataset.screenId, "favourite", "all");
        selectItem(selectedItem);
    }
});

/* ================= تشغيل عند تحميل الصفحة ================= */
window.addEventListener("DOMContentLoaded", loadScreens);