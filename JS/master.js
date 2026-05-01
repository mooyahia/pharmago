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
];

const generalInfoHoverAreas = [
  generalInfo,
  generalInfoMenu,
  userMenu,
  settingsMenu,
  databaseMenu,
];
const allHoverAreas = [...generalInfoHoverAreas, ...allSubMenus];

// ================= UTILITY FUNCTIONS =================
function sidebarIsOpen() {
  return !sidebar.classList.contains("collapsed");
}

function hideAllMenus() {
  userMenu.style.display = "none";
  settingsMenu.style.display = "none";
  databaseMenu.style.display = "none";

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
  generalInfoMenu.style.display = "flex";
}

function openSubMenuOnHover(subMenu) {
  if (window.innerWidth <= 768 || !sidebarIsOpen()) return;

  // لو نفس المنيو مفتوحة خلاص سيبها
  if (currentGeneralSubMenu === subMenu) return;

  // اقفل القديم
  hideAllMenus();

  // افتح الجديد
  generalInfoMenu.style.display = "flex";
  subMenu.style.display = "flex";

  // خزّن الحالي
  currentGeneralSubMenu = subMenu;
}
// Hover events للابتوب
generalInfo.addEventListener("mouseenter", openMenuOnHover);
generalInfoMenu
  .querySelector(".user")
  .addEventListener("mouseenter", () => openSubMenuOnHover(userMenu));
generalInfoMenu
  .querySelector(".settings")
  .addEventListener("mouseenter", () => openSubMenuOnHover(settingsMenu));
generalInfoMenu
  .querySelector(".database")
  .addEventListener("mouseenter", () => openSubMenuOnHover(databaseMenu));

// Click على General Info للموبايل
generalInfo.addEventListener("click", (e) => {
  if (window.innerWidth <= 768 || sidebarIsOpen()) {
    if (generalInfoMenu.style.display === "flex") {
      hideAllMenus();
    } else {
      hideAllMenus();
      hideAllSubMenus();
      generalInfoMenu.style.display = "flex";
    }
  }
  e.stopPropagation();
});

// Click على submenus للموبايل
function addClickSubMenu(button, submenu) {
  button.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 || sidebarIsOpen()) {
      [userMenu, settingsMenu, databaseMenu].forEach((menu) => {
        if (menu !== submenu) menu.style.display = "none";
      });
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";
      generalInfoMenu.style.display = "flex";
    }
    e.stopPropagation();
  });
}
addClickSubMenu(generalInfoMenu.querySelector(".user"), userMenu);
addClickSubMenu(generalInfoMenu.querySelector(".settings"), settingsMenu);
addClickSubMenu(generalInfoMenu.querySelector(".database"), databaseMenu);

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
      !generalInfo.contains(to) &&
      !generalInfoMenu.contains(to) &&
      !userMenu.contains(to) &&
      !settingsMenu.contains(to) &&
      !databaseMenu.contains(to)
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
  const allAreas = [sidebar, ...allSubMenus, ...generalInfoHoverAreas];
  const isInside = allAreas.some((el) => el && el.contains(target));
  if (!isInside) {
    hideAllMenus();
    hideAllSubMenus();
  }
});

// ================= SIDEBAR TOGGLE =================
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  toggleIcon.classList.toggle("rotate");
  hideAllMenus();
  hideAllSubMenus();
});

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  mainArea.classList.toggle("sidebar-open");
});

// ================= LOCK SCREEN =================
const lockAppbtn = document.getElementById("lockApp");
const unlockButton = document.getElementById("unlockButton");
const unlockPassInput = document.getElementById("unlockPassword");
const unlockUserInput = document.getElementById("unlockUserName");
const lockScreen = document.getElementById("lockScreen");

const token = localStorage.getItem("authToken");

// ================= قفل التطبيق =================
lockAppbtn.addEventListener("click", function () {
  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/lock-screen/", {
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
      lockScreen.style.display = "flex";
    })
    .catch((err) => {
      console.error("Lock API Error:", err);
    });
});

// ================= تحميل حالة القفل =================
window.addEventListener("load", function () {
  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/lock-screen/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      'ngrok-skip-browser-warning': '69420' 
    },
  })
    .then((res) => res.json())
    .then((data) => {
      lockScreen.style.display =
        data.is_app_locked === 1 ? "flex" : "none";
    })
    .catch((err) => {
      console.error("Lock Status Error:", err);
      console.log("Lock Status Error:", err);
    });
});

// ================= فتح التطبيق =================
unlockButton.addEventListener("click", function () {
  const username = unlockUserInput.value.trim();
  const password = unlockPassInput.value.trim();

  if (!username || !password) {
    alert("من فضلك ادخل اليوزر والباسورد");
    return;
  }

  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/unlock-screen/", {
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
        lockScreen.style.display = "none";
        unlockPassInput.value = "";
        unlockUserInput.value = "";

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

changePasswordBtn.addEventListener("click", () => {
  changePasswordScreen.style.display = "flex";
});

closeChangePasswordScreen.addEventListener("click", () => {
  changePasswordScreen.style.display = "none";
});

saveNewPasswordBtn.addEventListener("click", () => {
  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("من فضلك اكمل جميع الحقول");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("الباسورد الجديد وتأكيده مش متطابقين");
    return;
  }

  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/change-password/", {
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
        changePasswordScreen.style.display = "none";
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
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

// ================= THEME & SETTINGS =================
const themeOverlay = document.getElementById("themeOverlay");
const theme = document.getElementById("theme");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const themeSelect = document.getElementById("themeSelect");
const fontSelect = document.getElementById("fontSelect");

theme.addEventListener("click", () => {
  themeOverlay.style.display = "flex";
});

function closeModal() {
  themeOverlay.style.display = "none";
}

function applySettings() {
  const selectedTheme = themeSelect.value;
  const selectedFont = fontSelect.value;

  document.body.style.fontFamily = selectedFont;

  if (selectedTheme === "dark") {
    document.body.style.backgroundColor = "#1e272e";
    document.body.style.color = "#ffffff";
  } else {
    document.body.style.backgroundColor = "#f4f6f9";
    document.body.style.color = "#000000";
  }

  alert("تم حفظ الإعدادات بنجاح ✅");
  closeModal();
}

closeModalBtn.addEventListener("click", closeModal);
saveSettingsBtn.addEventListener("click", applySettings);

themeOverlay.addEventListener("click", function (event) {
  if (event.target === themeOverlay) {
    closeModal();
  }
});

// ================= BACKUP =================

const saveBackupBtn = document.getElementById("saveBackupBtn");
const closeBackupBtn = document.getElementById("closeBackupBtn");
const backupOverlay = document.getElementById("backupOverlay");
const backupPathInput = document.getElementById("backupPathInput");
const backupBtn = document.getElementById("backup");



// ================= LOAD BACKUP PATH ON PAGE LOAD =================
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");

  if (!token) return; // لو مفيش توكن

  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/backup/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      'ngrok-skip-browser-warning': '69420'
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Backup GET response:", data);

      // لو فيه مسار موجود، اظهره في input
      if (data.backup_path) {
        backupPathInput.value = data.backup_path;
      } else {
        backupPathInput.value = "";
      }
    })
    .catch((err) => {
      console.error("GET Backup Error:", err);
      // ممكن تسيب input فاضي أو alert
      backupPathInput.value = "";
    });
});
// فتح المودال
backupBtn.addEventListener("click", () => {
  backupOverlay.style.display = "flex";
});

// حفظ المسار + API
saveBackupBtn.addEventListener("click", () => {
  const backupPath = backupPathInput.value.trim();

  if (!backupPath) {
    alert("من فضلك اكتب مسار الباكاب");
    return;
  }

  fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/backup/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({
      backup_path: backupPath,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Backup response:", data);

      if (data.success || data.status === "success") {
        alert("تم حفظ مسار الباكاب بنجاح ✅");
        backupOverlay.style.display = "none";
      } else {
        alert(data.message || "حصل خطأ في حفظ الباكاب");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("حدث خطأ في الاتصال بالسيرفر");
    });
});

// قفل المودال
closeBackupBtn.addEventListener("click", () => {
  backupOverlay.style.display = "none";
});






// ================= ARROWS =================
const generalInfoArrow = generalInfo.querySelector(".fa-chevron-down");
const salesArrow = sales.querySelector(".fa-chevron-down");
const inventoryArrow = inventory.querySelector(".fa-chevron-down");
const purchasesArrow = purchases.querySelector(".fa-chevron-down");
const clientsArrow = clients.querySelector(".fa-chevron-down");
const suppliersArrow = suppliers.querySelector(".fa-chevron-down");
const accountArrow = accountAndFinance.querySelector(".fa-chevron-down");
const HRArrow = HR.querySelector(".fa-chevron-down");
const techArrow = technicalHelp.querySelector(".fa-chevron-down");

function rotateArrow(arrow, rotate = true) {
  if (!arrow) return;
  arrow.style.transition = "transform 0.3s ease";
  arrow.style.transform = rotate ? "rotate(90deg)" : "rotate(0deg)";
}

function handleHoverWithArrow(menu, arrow, subMenu) {
  menu.addEventListener("mouseenter", () => {
    rotateArrow(arrow, true);
    subMenu.style.display = "flex";
  });

  menu.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;

    if (
      !menu.contains(to) &&
      !subMenu.contains(to) &&
      !generalInfoMenu.contains(to) &&
      !userMenu.contains(to) &&
      !settingsMenu.contains(to) &&
      !databaseMenu.contains(to)
    ) {
      rotateArrow(arrow, false);
      subMenu.style.display = "none";
    }
  });

  subMenu.addEventListener("mouseenter", () => rotateArrow(arrow, true));
  subMenu.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;

    if (
      !menu.contains(to) &&
      !subMenu.contains(to) &&
      !generalInfoMenu.contains(to) &&
      !userMenu.contains(to) &&
      !settingsMenu.contains(to) &&
      !databaseMenu.contains(to)
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
    lockScreen.style.display = "flex";
  }
});

// ================= CLICK MAIN MENUS =================
function toggleSubMenuInsideGeneralInfo(button, submenu) {
  button.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 || sidebarIsOpen()) {
      // ✨ اقفل الكل الأول
      hideAllMenus();

      // ✨ toggle الحالي
      submenu.style.display =
        submenu.style.display === "flex" ? "none" : "flex";

      generalInfoMenu.style.display = "flex";
    }
    e.stopPropagation();
  });
}
// تطبيق على كل الفرعيات
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu.querySelector(".user"),
  userMenu,
);
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu.querySelector(".settings"),
  settingsMenu,
);
toggleSubMenuInsideGeneralInfo(
  generalInfoMenu.querySelector(".database"),
  databaseMenu,
);

// ================= SIDEBAR MAIN MENU CLICK + ARROW =================
function handleMainMenuClickWithArrow(menu, arrow, submenu, wrapper) {
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
    generalInfo.contains(target) ||
    generalInfoMenu.contains(target) ||
    userMenu.contains(target) ||
    settingsMenu.contains(target) ||
    databaseMenu.contains(target)
  );
}

// ================= FIX GENERAL INFO CLOSE =================
document.addEventListener("mouseover", (e) => {
  const target = e.target;

  // لو الماوس جوه أي جزء من الجنرال سيبه
  if (isInsideGeneralArea(target)) return;

  // غير كده اقفل كله
  hideAllMenus();
  generalInfoMenu.style.display = "none";
});

document.querySelectorAll(".no-submenu").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    hideAllMenus();
  });
});





