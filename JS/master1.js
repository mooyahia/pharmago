// ================= GET ELEMENTS =================
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const toggleIcon = document.getElementById("toggleIcon");
const toggleBtn = document.getElementById("mobileSidebarToggle");
const mainArea = document.querySelector(".main");

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
const b2b = document.getElementById("b2b");
const clients = document.getElementById("clients");
const suppliers = document.getElementById("suppliers");
const accountAndFinance = document.getElementById("accountAndFinance");
const HR = document.getElementById("HR");
const frames = document.getElementById("frames");
const technicalHelp = document.getElementById("technicalHelp");

// Main submenus
const salesSubMenus = document.getElementById("salesSubMenus");
const inventorySubMenus = document.getElementById("inventorySubMenus");
const purchasesSubMenus = document.getElementById("purchasesSubMenus");
const B2BSubMenus = document.getElementById("B2BSubMenus");
const clientsSubMenus = document.getElementById("clientsSubMenus");
const suppliersSubMenus = document.getElementById("suppliersSubMenus");
const accountsSubMenus = document.getElementById("accountsAndFinanceSubMenus");
const HRSubMenus = document.getElementById("HRSubMenus");
const framesSubMenus = document.getElementById("framesSubMenus");
const techSubMenus = document.getElementById("technicalHelpSubMenus");

// Main menu wrappers
const salesMenu = document.getElementById("salesMenu");
const inventoryMenu = document.getElementById("inventoryMenu");
const purchasesMenu = document.getElementById("purchasesMenu");
const B2BMenu = document.getElementById("B2BMenu");
const clientsMenu = document.getElementById("clientsMenu");
const suppliersMenu = document.getElementById("suppliersMenu");
const accountsMenu = document.getElementById("accountsAndFinanceMenu");
const HRMenu = document.getElementById("HRMenu");
const framesMenu = document.getElementById("framesMenu");
const techMenu = document.getElementById("technicalHelpMenu");

// ================= ARRAYS =================
const allSubMenus = [
  salesSubMenus,
  inventorySubMenus,
  purchasesSubMenus,
  B2BSubMenus,
  clientsSubMenus,
  suppliersSubMenus,
  accountsSubMenus,
  HRSubMenus,
  framesSubMenus,
  techSubMenus,
];

const generalInfoHoverAreas = [generalInfo, generalInfoMenu, userMenu, settingsMenu, databaseMenu];
const allHoverAreas = [...generalInfoHoverAreas, ...allSubMenus];

// ================= UTILITY FUNCTIONS =================
function sidebarIsOpen() {
  return !sidebar.classList.contains("collapsed");
}

function hideAllMenus() {
  userMenu.style.display = "none";
  settingsMenu.style.display = "none";
  databaseMenu.style.display = "none";
}

function hideAllSubMenus() {
  allSubMenus.forEach(menu => menu.style.display = "none");
}

// ================= GENERAL INFO LOGIC =================
// Hover للابتوب
function openMenuOnHover() {
  if (window.innerWidth <= 768 || !sidebarIsOpen()) return;
  hideAllMenus();
  hideAllSubMenus();
  generalInfoMenu.style.display = "flex";
}

// Hover على submenus للابتوب
function openSubMenuOnHover(subMenu) {
  if (window.innerWidth <= 768 || !sidebarIsOpen()) return;
  hideAllMenus();
  hideAllSubMenus();
  generalInfoMenu.style.display = "flex";
  subMenu.style.display = "flex";
}

// Hover events للابتوب
generalInfo.addEventListener("mouseenter", openMenuOnHover);
generalInfoMenu.querySelector(".user").addEventListener("mouseenter", () => openSubMenuOnHover(userMenu));
generalInfoMenu.querySelector(".settings").addEventListener("mouseenter", () => openSubMenuOnHover(settingsMenu));
generalInfoMenu.querySelector(".database").addEventListener("mouseenter", () => openSubMenuOnHover(databaseMenu));

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
      [userMenu, settingsMenu, databaseMenu].forEach(menu => {
        if (menu !== submenu) menu.style.display = "none";
      });
      submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
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
  button.addEventListener("mouseenter", () => openSidebarMenu(subMenu, menuWrapper));
}

// ================= APPLY MAIN MENUS =================
addHoverMainMenu(sales, salesSubMenus, salesMenu);
addHoverMainMenu(inventory, inventorySubMenus, inventoryMenu);
addHoverMainMenu(purchases, purchasesSubMenus, purchasesMenu);
addHoverMainMenu(b2b, B2BSubMenus, B2BMenu);
addHoverMainMenu(clients, clientsSubMenus, clientsMenu);
addHoverMainMenu(suppliers, suppliersSubMenus, suppliersMenu);
addHoverMainMenu(accountAndFinance, accountsSubMenus, accountsMenu);
addHoverMainMenu(HR, HRSubMenus, HRMenu);
addHoverMainMenu(frames, framesSubMenus, framesMenu);
addHoverMainMenu(technicalHelp, techSubMenus, techMenu);

addClickMainMenu(sales, salesSubMenus, salesMenu);
addClickMainMenu(inventory, inventorySubMenus, inventoryMenu);
addClickMainMenu(purchases, purchasesSubMenus, purchasesMenu);
addClickMainMenu(b2b, B2BSubMenus, B2BMenu);
addClickMainMenu(clients, clientsSubMenus, clientsMenu);
addClickMainMenu(suppliers, suppliersSubMenus, suppliersMenu);
addClickMainMenu(accountAndFinance, accountsSubMenus, accountsMenu);
addClickMainMenu(HR, HRSubMenus, HRMenu);
addClickMainMenu(frames, framesSubMenus, framesMenu);
addClickMainMenu(technicalHelp, techSubMenus, techMenu);

// Mouse leave لإغلاق General Info مع حماية submenus
generalInfoHoverAreas.forEach(area => {
  area.addEventListener("mouseleave", (e) => {
    const to = e.relatedTarget;
    if (!generalInfoHoverAreas.some(el => el.contains(to))) {
      hideAllMenus();
      hideAllSubMenus();
    }
  });
});

// Click خارج أي قائمة لإغلاق كل شيء
document.addEventListener("click", () => {
  hideAllMenus();
  hideAllSubMenus();
});

// Mouse move خارج كل القوائم للتأكد من الإغلاق
document.addEventListener("mousemove", (e) => {
  const target = e.target;
  const allAreas = [sidebar, ...allSubMenus, ...generalInfoHoverAreas];
  const isInside = allAreas.some(el => el && el.contains(target));
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
const unlockPassInput = document.getElementById("unlockPass");
const unlockUserInput = document.getElementById("unlockUserName");
const lockScreen = document.getElementById("lockScreen");

const apiURL = "https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/unlock-screen/";
const token = localStorage.getItem("authToken");

// ================= فتح التطبيق =================
unlockButton.addEventListener("click", function () {
    const username = unlockUserInput.value;
    const password = unlockPassInput.value;
    if(true){
        lockScreen.style.display = "none";
    }
    if (!username || !password) {
        alert("من فضلك ادخل اليوزر والباسورد");
        return;
    }

    fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
            status: "unlock_attempt",
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            localStorage.removeItem("appLocked");
            lockScreen.style.display = "none";
            unlockPassInput.value = "";
            unlockUserInput.value = "";
        } else {
            alert("يوزر أو باسورد غلط!");
        }
    })
    .catch(err => {
        console.error("Unlock API Error:", err);
        alert("حدث خطأ في الاتصال بالسيرفر، تأكد من تشغيل Ngrok");
    });
});

// ================= CHANGE PASSWORD =================
const changePasswordBtn = document.getElementById("changePassword");
const saveNewPasswordBtn = document.getElementById("changePasswordButton");

const oldPasswordInput = document.getElementById("unlockOldPass");
const newPasswordInput = document.getElementById("unlockNewPass");
const confirmPasswordInput = document.getElementById("unlockNewPassConfirm");

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

    fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("تم تغيير الباسورد بنجاح ✅");
            changePasswordScreen.style.display = "none";
            oldPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";
        } else {
            alert((data.message));
        }
    })
    .catch(err => {
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
let selectedHandle = null;

async function chooseFolder() {
  try {
    selectedHandle = await window.showDirectoryPicker();
    document.getElementById("pathBox").innerText =
      "تم اختيار: " + selectedHandle.name;
  } catch (err) {
    console.log("تم الإلغاء");
  }
}

const backup = document.getElementById("backup");
backup.addEventListener("click", () => {
  document.getElementById("backupOverlay").style.display = "flex";
});

function closeBackupModal() {
  document.getElementById("backupOverlay").style.display = "none";
}

// ================= ARROWS =================
const generalInfoArrow = generalInfo.querySelector(".fa-chevron-down");
const salesArrow = sales.querySelector(".fa-chevron-down");
const inventoryArrow = inventory.querySelector(".fa-chevron-down");
const purchasesArrow = purchases.querySelector(".fa-chevron-down");
const b2bArrow = b2b.querySelector(".fa-chevron-down");
const clientsArrow = clients.querySelector(".fa-chevron-down");
const suppliersArrow = suppliers.querySelector(".fa-chevron-down");
const accountArrow = accountAndFinance.querySelector(".fa-chevron-down");
const HRArrow = HR.querySelector(".fa-chevron-down");
const framesArrow = frames.querySelector(".fa-chevron-down");
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
    if (!subMenu.contains(e.relatedTarget)) {
      rotateArrow(arrow, false);
      subMenu.style.display = "none";
    }
  });

  subMenu.addEventListener("mouseenter", () => rotateArrow(arrow, true));
  subMenu.addEventListener("mouseleave", (e) => {
    if (!menu.contains(e.relatedTarget)) {
      rotateArrow(arrow, false);
      subMenu.style.display = "none";
    }
  });
}

handleHoverWithArrow(generalInfo, generalInfoArrow, generalInfoMenu);
handleHoverWithArrow(sales, salesArrow, salesSubMenus);
handleHoverWithArrow(inventory, inventoryArrow, inventorySubMenus);
handleHoverWithArrow(purchases, purchasesArrow, purchasesSubMenus);
handleHoverWithArrow(b2b, b2bArrow, B2BSubMenus);
handleHoverWithArrow(clients, clientsArrow, clientsSubMenus);
handleHoverWithArrow(suppliers, suppliersArrow, suppliersSubMenus);
handleHoverWithArrow(accountAndFinance, accountArrow, accountsSubMenus);
handleHoverWithArrow(HR, HRArrow, HRSubMenus);
handleHoverWithArrow(frames, framesArrow, framesSubMenus);
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
      const isOpen = submenu.style.display === "flex";

      [userMenu, settingsMenu, databaseMenu].forEach(menu => {
        if (menu !== submenu) menu.style.display = "none";
      });

      submenu.style.display = isOpen ? "none" : "flex";
      generalInfoMenu.style.display = "flex";
    }
    e.stopPropagation();
  });
}

// تطبيق على كل الفرعيات
toggleSubMenuInsideGeneralInfo(generalInfoMenu.querySelector(".user"), userMenu);
toggleSubMenuInsideGeneralInfo(generalInfoMenu.querySelector(".settings"), settingsMenu);
toggleSubMenuInsideGeneralInfo(generalInfoMenu.querySelector(".database"), databaseMenu);

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
handleMainMenuClickWithArrow(inventory, inventoryArrow, inventorySubMenus, inventoryMenu);
handleMainMenuClickWithArrow(purchases, purchasesArrow, purchasesSubMenus, purchasesMenu);
handleMainMenuClickWithArrow(b2b, b2bArrow, B2BSubMenus, B2BMenu);
handleMainMenuClickWithArrow(clients, clientsArrow, clientsSubMenus, clientsMenu);
handleMainMenuClickWithArrow(suppliers, suppliersArrow, suppliersSubMenus, suppliersMenu);
handleMainMenuClickWithArrow(accountAndFinance, accountArrow, accountsSubMenus, accountsMenu);
handleMainMenuClickWithArrow(HR, HRArrow, HRSubMenus, HRMenu);
handleMainMenuClickWithArrow(frames, framesArrow, framesSubMenus, framesMenu);
handleMainMenuClickWithArrow(technicalHelp, techArrow, techSubMenus, techMenu);

// ================= END OF FILE =================



