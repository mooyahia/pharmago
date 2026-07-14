// ================= GET ELEMENTS =================
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const toggleIcon = document.getElementById("toggleIcon");
const toggleBtn = document.getElementById("mobileSidebarToggle");
const mainArea = document.querySelector(".main");
let currentGeneralSubMenu = null;
// General Info
const generalInfo = document.getElementById("generalInfo");
const generalInfoMenu = document.getElementById("generalInfoMenu");
const userMenu = document.querySelector(".userMenu");
const settingsMenu = document.querySelector(".settingsMenu");
const databaseMenu = document.querySelector(".databaseMenu");

// Main menus
const sales = document.getElementById("sales");
const inventory = document.getElementById("inventory");
const purchases = document.getElementById("purchases");
const clients = document.getElementById("clients");
const suppliers = document.getElementById("suppliers");
const accountAndFinance = document.getElementById("accountAndFinance");
const HR = document.getElementById("HR");
const technicalHelp = document.getElementById("technicalHelp");

// Main submenus
const salesSubMenus = document.getElementById("salesSubMenus");
const inventorySubMenus = document.getElementById("inventorySubMenus");
const purchasesSubMenus = document.getElementById("purchasesSubMenus");
const clientsSubMenus = document.getElementById("clientsSubMenus");
const suppliersSubMenus = document.getElementById("suppliersSubMenus");
const accountsSubMenus = document.getElementById("accountsAndFinanceSubMenus");
const HRSubMenus = document.getElementById("HRSubMenus");
const techSubMenus = document.getElementById("technicalHelpSubMenus");

// Main menu wrappers
const salesMenu = document.getElementById("salesMenu");
const inventoryMenu = document.getElementById("inventoryMenu");
const purchasesMenu = document.getElementById("purchasesMenu");
const clientsMenu = document.getElementById("clientsMenu");
const suppliersMenu = document.getElementById("suppliersMenu");
const accountsMenu = document.getElementById("accountsAndFinanceMenu");
const HRMenu = document.getElementById("HRMenu");
const techMenu = document.getElementById("technicalHelpMenu");

// ================= ARRAYS =================
const allSubMenus = [
  salesSubMenus,
  inventorySubMenus,
  purchasesSubMenus,
  clientsSubMenus,
  suppliersSubMenus,
  accountsSubMenus,
  HRSubMenus,
  techSubMenus,
].filter(Boolean);

const generalInfoHoverAreas = [
  generalInfo,
  generalInfoMenu,
  userMenu,
  settingsMenu,
  databaseMenu,
].filter(Boolean);

const allHoverAreas = [...generalInfoHoverAreas, ...allSubMenus];

// ================= UTILITY FUNCTIONS =================
function sidebarIsOpen() {
  return sidebar && !sidebar.classList.contains("collapsed");
}

function hideAllMenus() {
  if (userMenu) userMenu.style.display = "none";
  if (settingsMenu) settingsMenu.style.display = "none";
  if (databaseMenu) databaseMenu.style.display = "none";

  // reset
  currentGeneralSubMenu = null;
}

function hideAllSubMenus() {
  allSubMenus.forEach((menu) => (menu.style.display = "none"));
}

// ================= GENERAL INFO LOGIC =================
// Hover للابتوب
function openMenuOnHover() {
  if (window.innerWidth <= 768 || !sidebarIsOpen()) return;
  hideAllSubMenus();
  if (generalInfoMenu) generalInfoMenu.style.display = "flex";
}

function openSubMenuOnHover(subMenu) {
  if (!subMenu) return;
  if (window.innerWidth <= 768 || !sidebarIsOpen()) return;

  // لو نفس المنيو مفتوحة خلاص سيبها
  if (currentGeneralSubMenu === subMenu) return;

  // اقفل القديم
  hideAllMenus();

  // افتح الجديد
  if (generalInfoMenu) generalInfoMenu.style.display = "flex";
  subMenu.style.display = "flex";

  // خزّن الحالي
  currentGeneralSubMenu = subMenu;
}

// Hover events للابتوب
generalInfo?.addEventListener("mouseenter", openMenuOnHover);
generalInfoMenu?.querySelector(".user")?.addEventListener("mouseenter", () => openSubMenuOnHover(userMenu));
generalInfoMenu?.querySelector(".settings")?.addEventListener("mouseenter", () => openSubMenuOnHover(settingsMenu));
generalInfoMenu?.querySelector(".database")?.addEventListener("mouseenter", () => openSubMenuOnHover(databaseMenu));

// Click على General Info للموبايل
generalInfo?.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 || sidebarIsOpen()) {
    if (generalInfoMenu && generalInfoMenu.style.display === "flex") {
      hideAllMenus();
    } else {
      hideAllMenus();
      hideAllSubMenus();
      if (generalInfoMenu) generalInfoMenu.style.display = "flex";
    }
  }
  e.stopPropagation();
});

// Click على submenus للموبايل
function addClickSubMenu(button, submenu) {
  if (!button || !submenu) return;
  button?.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 || sidebarIsOpen()) {
      [userMenu, settingsMenu, databaseMenu].forEach((menu) => {
        if (menu && menu !== submenu) menu.style.display = "none";
      });
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";
      if (generalInfoMenu) generalInfoMenu.style.display = "flex";
    }
    e.stopPropagation();
  });
}
addClickSubMenu(generalInfoMenu?.querySelector(".user"), userMenu);
addClickSubMenu(generalInfoMenu?.querySelector(".settings"), settingsMenu);
addClickSubMenu(generalInfoMenu?.querySelector(".database"), databaseMenu);

// ================= MAIN MENUS LOGIC =================
function openSidebarMenu(subMenu, menuWrapper) {
  if (!subMenu || !menuWrapper) return;
  hideAllSubMenus();
  hideAllMenus();
  subMenu.style.display = "flex";
  menuWrapper.style.display = "flex";
}

// Click Main Menu
function addClickMainMenu(button, subMenu, menuWrapper) {
  if (!button || !subMenu || !menuWrapper) return;
  button.addEventListener("click", (e) => {
    const isOpen = subMenu.style.display === "flex";
    hideAllSubMenus();
    hideAllMenus();
    if (!isOpen) {
      subMenu.style.display = "flex";
      menuWrapper.style.display = "flex";
    }
    e.stopPropagation();
  });
}

// Hover Main Menu
function addHoverMainMenu(button, subMenu, menuWrapper) {
  if (!button || !subMenu || !menuWrapper) return;
  button.addEventListener("mouseenter", () =>
    openSidebarMenu(subMenu, menuWrapper),
  );
}

// ================= APPLY MAIN MENUS =================
addHoverMainMenu(sales, salesSubMenus, salesMenu);
addHoverMainMenu(inventory, inventorySubMenus, inventoryMenu);
addHoverMainMenu(purchases, purchasesSubMenus, purchasesMenu);
addHoverMainMenu(clients, clientsSubMenus, clientsMenu);
addHoverMainMenu(suppliers, suppliersSubMenus, suppliersMenu);
addHoverMainMenu(accountAndFinance, accountsSubMenus, accountsMenu);
addHoverMainMenu(HR, HRSubMenus, HRMenu);
addHoverMainMenu(technicalHelp, techSubMenus, techMenu);

addClickMainMenu(sales, salesSubMenus, salesMenu);
addClickMainMenu(inventory, inventorySubMenus, inventoryMenu);
addClickMainMenu(purchases, purchasesSubMenus, purchasesMenu);
addClickMainMenu(clients, clientsSubMenus, clientsMenu);
addClickMainMenu(suppliers, suppliersSubMenus, suppliersMenu);
addClickMainMenu(accountAndFinance, accountsSubMenus, accountsMenu);
addClickMainMenu(HR, HRSubMenus, HRMenu);
addClickMainMenu(technicalHelp, techSubMenus, techMenu);

// Mouse leave لإغلاق General Info مع حماية submenus
// Wrapper يحمي كل الـ General Info menus
const generalWrapper = document.querySelector(".generalInfoWrapper");

if (generalWrapper) {
  generalWrapper.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;

    if (
      !generalInfo?.contains(to) &&
      !generalInfoMenu?.contains(to) &&
      !userMenu?.contains(to) &&
      !settingsMenu?.contains(to) &&
      !databaseMenu?.contains(to)
    ) {
      hideAllMenus();
      hideAllSubMenus();
    }
  });
}
// Click خارج أي قائمة لإغلاق كل شيء
document.addEventListener("click", () => {
  hideAllMenus();
  hideAllSubMenus();
});

// Mouse move خارج كل القوائم للتأكد من الإغلاق
document.addEventListener("mousemove", (e) => {
  const target = e.target;
  const allAreas = [sidebar, ...allSubMenus, ...generalInfoHoverAreas].filter(Boolean);
  const isInside = allAreas.some((el) => el && el.contains(target));
  if (!isInside) {
    hideAllMenus();
    hideAllSubMenus();
  }
});

// ================= SIDEBAR TOGGLE =================
sidebarToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("collapsed");
  toggleIcon?.classList.toggle("rotate");
  hideAllMenus();
  hideAllSubMenus();
});

toggleBtn?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
  mainArea?.classList.toggle("sidebar-open");
});

// ================= LOCK SCREEN =================
const lockAppbtn = document.getElementById("lockApp");
const unlockButton = document.getElementById("unlockButton");
const unlockPassInput = document.getElementById("unlockPassword");
const unlockUserInput = document.getElementById("unlockUserName");
const lockScreen = document.getElementById("lockScreen");

const token = localStorage.getItem("authToken");

// ================= قفل التطبيق =================
lockAppbtn?.addEventListener("click", function () {
  fetch("http://100.80.3.109:8000/api/generalinfo/lock-screen/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      is_app_locked: 1
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (lockScreen) lockScreen.style.display = "flex";
    })
    .catch((err) => {
      console.error("Lock API Error:", err);
    });
});

// ================= تحميل حالة القفل =================
window.addEventListener("load", function () {
  fetch("http://100.80.3.109:8000/api/generalinfo/lock-screen/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      'ngrok-skip-browser-warning': '69420' 
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (lockScreen) {
        lockScreen.style.display =
          data.is_app_locked === 1 ? "flex" : "none";
      }
    })
    .catch((err) => {
      console.error("Lock Status Error:", err);
      console.log("Lock Status Error:", err);
    });
});

// ================= فتح التطبيق =================
unlockButton?.addEventListener("click", function () {
  const username = unlockUserInput?.value.trim();
  const password = unlockPassInput?.value.trim();

  if (!username || !password) {
    alert("من فضلك ادخل اليوزر والباسورد");
    return;
  }

  fetch("http://100.80.3.109:8000/api/generalinfo/unlock-screen/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      password: password,
      is_app_locked : 0
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (lockScreen) lockScreen.style.display = "none";
        if (unlockPassInput) unlockPassInput.value = "";
        if (unlockUserInput) unlockUserInput.value = "";

        alert("تم فتح البرنامج ✅");
      } else {
        alert(data.message || "يوزر أو باسورد غلط!");
      }
    })
    .catch((err) => {
      console.error("Unlock API Error:", err);
      alert("حدث خطأ في الاتصال بالسيرفر");
    });
});


// ================= CHANGE PASSWORD =================
const changePasswordBtn = document.getElementById("changePassword");
const saveNewPasswordBtn = document.getElementById("changePasswordButton");

const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("newPasswordConfirmation");

const changePasswordScreen = document.getElementById("changePasswordScreen");
const closeChangePasswordScreen = document.getElementById("closeChangePasswordScreen");

changePasswordBtn?.addEventListener("click", () => {
  if (changePasswordScreen) changePasswordScreen.style.display = "flex";
});

closeChangePasswordScreen?.addEventListener("click", () => {
  if (changePasswordScreen) changePasswordScreen.style.display = "none";
});

saveNewPasswordBtn?.addEventListener("click", () => {
  const oldPassword = oldPasswordInput?.value.trim();
  const newPassword = newPasswordInput?.value.trim();
  const confirmPassword = confirmPasswordInput?.value.trim();

  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("من فضلك اكمل جميع الحقول");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("الباسورد الجديد وتأكيده مش متطابقين");
    return;
  }

  fetch("http://100.80.3.109:8000/api/generalinfo/change-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("تم تغيير الباسورد بنجاح ✅");
        if (changePasswordScreen) changePasswordScreen.style.display = "none";
        if (oldPasswordInput) oldPasswordInput.value = "";
        if (newPasswordInput) newPasswordInput.value = "";
        if (confirmPasswordInput) confirmPasswordInput.value = "";
        localStorage.setItem("authToken", data.new_token)
        
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("حدث خطأ في الاتصال بالسيرفر");
    });
});


window.addEventListener("DOMContentLoaded", () => {

  const themeOverlay = document.getElementById("themeOverlay");
  const themeBtn = document.getElementById("theme");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  const themeSelect = document.getElementById("themeSelect");

  // فتح المودال
  themeBtn?.addEventListener("click", () => {
    if (themeOverlay) themeOverlay.style.display = "flex";
  });

  // قفل المودال
  function closeModal() {
    if (themeOverlay) themeOverlay.style.display = "none";
  }

  closeModalBtn?.addEventListener("click", closeModal);

  themeOverlay?.addEventListener("click", (e) => {
    if (e.target === themeOverlay) closeModal();
  });

  // تطبيق الثيم
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#1e272e";
      document.body.style.color = "#ffffff";
    } else if (theme === "light") {
      document.body.style.backgroundColor = "#f4f6f9";
      document.body.style.color = "#000000";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }

    localStorage.setItem("theme", theme);
  }

  // حفظ الإعدادات
  saveSettingsBtn?.addEventListener("click", async () => {

    const themeValue = themeSelect?.value;

    console.log("themeValue:", themeValue); // 👈 مهم للتأكد

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        "http://100.80.3.109:8000/api/generalinfo/theme/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ theme_name: themeValue }),
        }
      );

      const data = await res.json();

      console.log("response:", data);

      if (res.ok && data.success) {
        applyTheme(data.theme_name);
        alert("تم حفظ الإعدادات بنجاح");
        closeModal();
      } else {
        alert(data.message || "فشل الحفظ");
      }
    } catch (err) {
      console.error(err);
      alert("سيرفر Error");
    }
  });

});
// ================= LOAD SAVED THEME =================
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  const themeSelect = document.getElementById("themeSelect");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#1e272e";
      document.body.style.color = "#ffffff";
    } else if (theme === "light") {
      document.body.style.backgroundColor = "#f4f6f9";
      document.body.style.color = "#000000";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }
    localStorage.setItem("theme", theme);
  }

  if (savedTheme && themeSelect) {
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
  }
});
// ================= BACKUP =================


// ================= ARROWS =================
const generalInfoArrow = generalInfo?.querySelector(".fa-chevron-down");
const salesArrow = sales?.querySelector(".fa-chevron-down");
const inventoryArrow = inventory?.querySelector(".fa-chevron-down");
const purchasesArrow = purchases?.querySelector(".fa-chevron-down");
const clientsArrow = clients?.querySelector(".fa-chevron-down");
const suppliersArrow = suppliers?.querySelector(".fa-chevron-down");
const accountArrow = accountAndFinance?.querySelector(".fa-chevron-down");
const HRArrow = HR?.querySelector(".fa-chevron-down");
const techArrow = technicalHelp?.querySelector(".fa-chevron-down");

function rotateArrow(arrow, rotate = true) {
  if (!arrow) return;
  arrow.style.transition = "transform 0.3s ease";
  arrow.style.transform = rotate ? "rotate(90deg)" : "rotate(0deg)";
}

function handleHoverWithArrow(menu, arrow, subMenu) {
  if (!menu || !subMenu) return;
  menu.addEventListener("mouseenter", () => {
    rotateArrow(arrow, true);
    subMenu.style.display = "flex";
  });

  menu.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;

    if (
      !menu.contains(to) &&
      !subMenu.contains(to) &&
      !generalInfoMenu?.contains(to) &&
      !userMenu?.contains(to) &&
      !settingsMenu?.contains(to) &&
      !databaseMenu?.contains(to)
    ) {
      rotateArrow(arrow, false);
      subMenu.style.display = "none";
    }
  });

  subMenu?.addEventListener("mouseenter", () => rotateArrow(arrow, true));
  subMenu?.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;

    if (
      !menu.contains(to) &&
      !subMenu.contains(to) &&
      !generalInfoMenu?.contains(to) &&
      !userMenu?.contains(to) &&
      !settingsMenu?.contains(to) &&
      !databaseMenu?.contains(to)
    ) {
      rotateArrow(arrow, false);
      subMenu.style.display = "none";
    }
  });
}

handleHoverWithArrow(generalInfo, generalInfoArrow, generalInfoMenu);
handleHoverWithArrow(sales, salesArrow, salesSubMenus);
handleHoverWithArrow(inventory, inventoryArrow, inventorySubMenus);
handleHoverWithArrow(purchases, purchasesArrow, purchasesSubMenus);
handleHoverWithArrow(clients, clientsArrow, clientsSubMenus);
handleHoverWithArrow(suppliers, suppliersArrow, suppliersSubMenus);
handleHoverWithArrow(accountAndFinance, accountArrow, accountsSubMenus);
handleHoverWithArrow(HR, HRArrow, HRSubMenus);
handleHoverWithArrow(technicalHelp, techArrow, techSubMenus);

window.addEventListener("load", function () {
  if (localStorage.getItem("appLocked") === "true") {
    if (lockScreen) lockScreen.style.display = "flex";
  }
});

// ================= CLICK MAIN MENUS =================
function toggleSubMenuInsideGeneralInfo(button, submenu) {
  if (!button || !submenu) return;
  button?.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 || sidebarIsOpen()) {
      // ✨ اقفل الكل الأول
      hideAllMenus();

      // ✨ toggle الحالي
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";

      if (generalInfoMenu) generalInfoMenu.style.display = "flex";
    }
    e.stopPropagation();
  });
}
// تطبيق على كل الفرعيات
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu?.querySelector(".user"),
  userMenu,
);
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu?.querySelector(".settings"),
  settingsMenu,
);
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu?.querySelector(".database"),
  databaseMenu,
);

// ================= SIDEBAR MAIN MENU CLICK + ARROW =================
function handleMainMenuClickWithArrow(menu, arrow, submenu, wrapper) {
  if (!menu || !submenu || !wrapper) return;
  menu.addEventListener("click", (e) => {
    const isOpen = submenu.style.display === "flex";
    hideAllSubMenus();
    hideAllMenus();
    if (!isOpen) {
      submenu.style.display = "flex";
      wrapper.style.display = "flex";
      rotateArrow(arrow, true);
    } else {
      rotateArrow(arrow, false);
    }
    e.stopPropagation();
  });
}

// تطبيق على كل المين منيوز
handleMainMenuClickWithArrow(sales, salesArrow, salesSubMenus, salesMenu);
handleMainMenuClickWithArrow(
  inventory,
  inventoryArrow,
  inventorySubMenus,
  inventoryMenu,
);
handleMainMenuClickWithArrow(
  purchases,
  purchasesArrow,
  purchasesSubMenus,
  purchasesMenu,
);

handleMainMenuClickWithArrow(
  clients,
  clientsArrow,
  clientsSubMenus,
  clientsMenu,
);
handleMainMenuClickWithArrow(
  suppliers,
  suppliersArrow,
  suppliersSubMenus,
  suppliersMenu,
);
handleMainMenuClickWithArrow(
  accountAndFinance,
  accountArrow,
  accountsSubMenus,
  accountsMenu,
);
handleMainMenuClickWithArrow(HR, HRArrow, HRSubMenus, HRMenu);
handleMainMenuClickWithArrow(technicalHelp, techArrow, techSubMenus, techMenu);

// ================= END OF FILE =================

function isInsideGeneralArea(target) {
  return (
    generalInfo?.contains(target) ||
    generalInfoMenu?.contains(target) ||
    userMenu?.contains(target) ||
    settingsMenu?.contains(target) ||
    databaseMenu?.contains(target)
  );
}

// ================= FIX GENERAL INFO CLOSE =================
document.addEventListener("mouseover", (e) => {
  const target = e.target;

  // لو الماوس جوه أي جزء من الجنرال سيبه
  if (isInsideGeneralArea(target)) return;

  // غير كده اقفل كله
  hideAllMenus();
  if (generalInfoMenu) generalInfoMenu.style.display = "none";
});

document.querySelectorAll(".no-submenu").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    hideAllMenus();
  });
});


// ================= API =================
const API_BASE = "http://100.80.3.109:8000/api/hr/users/";

async function getCurrentUser() {
  try {
    const res = await fetch(API_BASE, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken") ?? ""}`,
        'ngrok-skip-browser-warning': '69420'
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // دعم حالتين (list أو object)
    const users = Array.isArray(data?.data) ? data.data : null;
    const currentUsername = localStorage.getItem("username");
    let currentUser = null;

    if (users) {
      currentUser = users.find(user => user.username === currentUsername) ?? null;
    } else {
      currentUser = data?.data ?? null;
    }

    console.log("currentUser:", currentUser);
    return currentUser;

  } catch (err) {
    console.error("getCurrentUser Error:", err);
    return null;
  }
}


// ================= UPDATE USER INFO IN SIDEBAR =================
// بتشيل اسم المستخدم والرول وتحطهم في الـ sidebar
function updateUserInfoInSidebar(user) {
  if (!user) return;

  const userNameEl = document.getElementById("userNameInSidebar");
  const userRoleEl = document.getElementById("userRoleInSidebar");

  // الاسم: بنحاول نجيب full_name أو first_name + last_name أو username كـ fallback
  const displayName =
    user.full_name ||
    ((user.first_name || "") + " " + (user.last_name || "")).trim() ||
    user.username ||
    "—";
  // الرول: بنحاول نجيب user_role أو role
  const displayRole = user.user_role || user.role || "—";

  if (userNameEl) userNameEl.textContent = displayName;
  if (userRoleEl) userRoleEl.textContent = displayRole;
}


// ================= ROLE-BASED MENU VISIBILITY =================
// بتاخد الـ role وتحدد إيه المنيوز المتاحة
// المنيو نفسه في الـ sidebar + الـ submenu container بتاعه
// display: none = مخفي  |  display: block = ظاهر

// function applyMenuVisibilityByRole(role) {
//   // لو مفيش role نعمل كل حاجة hidden كـ safe default
//   const safeRole = (role || "").toLowerCase().trim();

//   // تعريف كل الزوج (tab في الـ sidebar + subMenus container)
//   const menuMap = [
//     {
//       tab: document.getElementById("sales"),
//       sub: document.getElementById("salesSubMenus"),
//     },
//     {
//       tab: document.getElementById("inventory"),
//       sub: document.getElementById("inventorySubMenus"),
//     },
//     {
//       tab: document.getElementById("purchases"),
//       sub: document.getElementById("purchasesSubMenus"),
//     },
//     {
//       tab: document.getElementById("clients"),
//       sub: document.getElementById("clientsSubMenus"),
//     },
//     {
//       tab: document.getElementById("suppliers"),
//       sub: document.getElementById("suppliersSubMenus"),
//     },
//     {
//       tab: document.getElementById("accountAndFinance"),
//       sub: document.getElementById("accountsAndFinanceSubMenus"),
//     },
//     {
//       tab: document.getElementById("HR"),
//       sub: document.getElementById("HRSubMenus"),
//     },
//     {
//       tab: document.getElementById("technicalHelp"),
//       sub: document.getElementById("technicalHelpSubMenus"),
//     },
//   ];

//   // أول حاجة: اخفي كل حاجة
//   menuMap.forEach(({ tab, sub }) => {
//     if (tab) tab.style.display = "none";
//     if (sub) sub.style.display = "none";
//   });

//   // Helper: بتظهر المنيو والـ sub بتاعه
//   function showMenu(id) {
//     const entry = menuMap.find(
//       (m) => m.tab && m.tab.id === id
//     );
//     if (!entry) return;
//     if (entry.tab) entry.tab.style.display = "flex";
//     // الـ sub مش بنظهره هنا دلوقتي — بيتظهر لما اليوزر يكليك/هوفر
//     // بس بنشيل الـ display:none اللي احنا حطيناه
//     // عشان كده بنستخدم "" مش "flex"
//     if (entry.sub) entry.sub.style.display = "";
//   }

//   // ================= صلاحيات كل رول =================

//   if (safeRole === "superadmin" || safeRole === "manager") {
//     // كل حاجة متاحة
//     menuMap.forEach(({ tab, sub }) => {
//       if (tab) tab.style.display = "flex";
//       if (sub) sub.style.display = "";
//     });
//     document.getElementById("pharmacyInfoSubMenu").style.display = "flex";
//     document.getElementById("generalInfo").style.display = "flex";
//     return;
//   }

//   if (safeRole === "pharmacist") {
//     showMenu("inventory");
//     document.getElementById("pharmacyInfoSubMenu").style.display = "none";
//     return;
//   }

//   if (safeRole === "cashier") {
//     showMenu("sales");
//     showMenu("purchases");
//     showMenu("clients");
//     document.getElementById("pharmacyInfoSubMenu").style.display = "none";
//     return;
//   }

//   if (safeRole === "accountant") {
//     showMenu("sales");
//     showMenu("purchases");
//     showMenu("accountAndFinance");
//     document.getElementById("pharmacyInfoSubMenu").style.display = "none";
//     return;
//   }

//   if (safeRole === "hr") {
//     showMenu("HR");
//     document.getElementById("pharmacyInfoSubMenu").style.display = "none";
//     return;
//   }


//   console.warn("applyMenuVisibilityByRole: unknown role →", safeRole);
// }



// // ================= INIT =================
// (async function () {
//   const user = await getCurrentUser();

//   console.log("USER:", user);

//   // استخراج role الحقيقي من object
//   const role = user?.user_role ;

//   console.log("ROLE:", role);

//   // ===== 1. اعرض اسم المستخدم والرول في الـ sidebar =====
//   updateUserInfoInSidebar(user);

//   // ===== 2. ابني المنيوز حسب الرول (الـ HTML) =====
//   // buildMenus(role);

//   // ===== 3. طبق الـ display:none / display:block على كل منيو وصب منيو =====
//   // لازم تيجي بعد buildMenus عشان العناصر تكون موجودة في الـ DOM
//   applyMenuVisibilityByRole(role);
// })();

















// ================= Favourite Screens =================
const FAVOURITES_API = "http://100.80.3.109:8000/api/hr/favorites/";

const favouriteWrapper = document.getElementById("favouriteScreens");
const favouriteHideBtn = document.getElementById("favouriteScreensHide");

async function loadFavouriteScreens() {
  try {
    const res = await fetch(FAVOURITES_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("authToken") ?? ""}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok || data?.status !== "success") return;

    // ✔️ التصحيح هنا: مفيش [0]
    const favourites = data?.favorites || [];

    // امسح القديم عشان ميتكررش
    if (favouriteWrapper) {
      favouriteWrapper.innerHTML = `
        <p id="favouriteScreensHide" class="favouriteScreensHide">
          إخفاء الشاشات المفضلة
        </p>
      `;
    }

    favourites.forEach((item) => {
      if (!item) return;

      const [firstValue, type, lastValue] = item;

      const favouriteItem = document.createElement("div");
      favouriteItem.classList.add("favouriteItem");

      const link = document.createElement("a");

      // page
      if (type === "page") {
        link.href = `${firstValue}.html` || "#";
      }

      // button
      if (type === "btn") {
        link.id = firstValue || "";
        link.href = "javascript:void(0)";
      }

      link.innerText = lastValue || "";

      favouriteItem.appendChild(link);
      favouriteWrapper?.appendChild(favouriteItem);
    });

    // إعادة ربط زر الإخفاء بعد إعادة بناء الـ DOM
    attachHideHandler();

  } catch (error) {
    console.error("Favourite Screens Error:", error);
  }
}

// ================= Hide Favourite Screens =================
function attachHideHandler() {
  const btn = document.getElementById("favouriteScreensHide");

  btn?.addEventListener("click", () => {
    if (favouriteWrapper) {
      favouriteWrapper.style.display = "none";

      // نحفظ الحالة في المتصفح
      localStorage.setItem("favouriteScreensHidden", "true");
    }
  });
}

function handleFavouriteVisibility() {
  const isHidden = localStorage.getItem("favouriteScreensHidden");

  if (isHidden === "true") {
    favouriteWrapper.style.display = "none";
  } else {
    favouriteWrapper.style.display = "flex";
  }
}
 handleFavouriteVisibility()
// ================= Init =================
loadFavouriteScreens();
attachHideHandler();