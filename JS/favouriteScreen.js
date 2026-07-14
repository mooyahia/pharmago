

      localStorage.setItem("favouriteScreensHidden", "false");


// ================== API ==================
const API_BASE_URL = "http://100.80.3.109:8000/api/";

// ================== ELEMENTS ==================
const allList = document.getElementById("allScreensList");
const favList = document.getElementById("favouriteScreensList");

const toFavBtn = document.getElementById("toFavouriteArrow");
const toAllBtn = document.getElementById("toAllArrow");
const moveUpBtn = document.getElementById("moveUpBtn");
const moveDownBtn = document.getElementById("moveDownBtn");
const saveBtn = document.getElementById("saveBtn");

let selectedItem = null;

// ================== API REQUEST ==================
async function apiRequest(endpoint, method = "GET", data = null) {
  try {
    const res = await fetch(API_BASE_URL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("authToken") || ""}`
      },
      body: data ? JSON.stringify(data) : null
    });

    let result = null;

    try {
      result = await res.json();
    } catch {}

    if (!res.ok) {
      console.error("API Error:", result);
      throw new Error("Request failed");
    }

    return result;
  } catch (err) {
    console.error("Server Error:", err);
    throw err;
  }
}

// ================== SELECT ITEM ==================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {

    document.querySelectorAll(".item.selected").forEach(el => {
      el.classList.remove("selected");
    });

    e.target.classList.add("selected");
    selectedItem = e.target;
  }
});

// ================== ADD TO FAVORITES ==================
toFavBtn.onclick = () => {
  if (!selectedItem) return;

  if (selectedItem.closest("#favouriteScreensList")) return;

  const value = selectedItem.dataset.value;

  const exists = [...favList.children].some(
    el => el.dataset.value === value
  );

  if (exists) return;

  const clone = selectedItem.cloneNode(true);
  clone.classList.remove("selected");

  favList.appendChild(clone);

  selectedItem.classList.remove("selected");
  selectedItem = null;
};

// ================== REMOVE FROM FAVORITES ==================
toAllBtn.onclick = async () => {
  if (!selectedItem) return;

  if (!selectedItem.closest("#favouriteScreensList")) return;

  try {
    // 1️⃣ احذف العنصر من الواجهة
    selectedItem.remove();
    selectedItem = null;

    // 2️⃣ جهّز الداتا الجديدة بعد الحذف
    const data = [...favList.children].map(el => ([
      el.dataset.value || "",
      el.dataset.type || "",
      el.textContent.trim() || ""
    ]));

    const payload = {
      favorites: data
    };

    console.log("After Delete Payload:", payload);

    // 3️⃣ ابعت التحديث للسيرفر
    const res = await apiRequest("hr/favorites/", "PUT", payload);

    console.log("Response:", res);

    // 4️⃣ رسالة نجاح
    alert(res?.message || "تم الحذف بنجاح ✅");

  } catch (err) {
    console.error("Delete Update Error:", err);
    alert("حصل خطأ أثناء الحذف ❌");
  }
};
// ================== MOVE UP ==================
moveUpBtn.onclick = () => {
  if (!selectedItem) return;
  if (!selectedItem.closest("#favouriteScreensList")) return;

  const prev = selectedItem.previousElementSibling;
  if (prev) {
    selectedItem.parentElement.insertBefore(selectedItem, prev);
  }
};

// ================== MOVE DOWN ==================
moveDownBtn.onclick = () => {
  if (!selectedItem) return;
  if (!selectedItem.closest("#favouriteScreensList")) return;

  const next = selectedItem.nextElementSibling;
  if (next) {
    selectedItem.parentElement.insertBefore(next, selectedItem);
  }
};

// ================== SAVE FAVORITES ==================
saveBtn.onclick = async () => {

  const data = [...favList.children].map(el => ([
    el.dataset.value || "",
    el.dataset.type || "",
    el.textContent.trim() || ""
  ]));

  const payload = {
    favorites: data
  };

  console.log("Sending:", payload);

  try {
    const res = await apiRequest("hr/favorites/", "PUT", payload);

    console.log("Response:", res);

    alert(res?.message || "تم الحفظ بنجاح ✅");

  } catch (err) {
    console.error("Save Error:", err);
    alert("حصل خطأ ❌");
  }
};

// ================== LOAD FAVORITES ==================
async function loadFavourites() {
  try {
    const data = await apiRequest("hr/favorites/");

    console.log("Loaded:", data);

    favList.innerHTML = "";

    const raw = data?.favorites || [];

    if (!Array.isArray(raw)) return;

    raw.forEach(item => {
      if (!Array.isArray(item) || item.length < 3) return;

      const [value, type, text] = item;

      const div = document.createElement("div");
      div.className = "item";

      div.dataset.value = value || "";
      div.dataset.type = type || "";
      div.textContent = text || "";

      favList.appendChild(div);
    });

  } catch (err) {
    console.error("Load Error:", err);
  }
}

// ================== INIT ==================
window.onload = () => {

  if (typeof applyTheme === "function") {
    applyTheme();
  }

  loadFavourites();
};