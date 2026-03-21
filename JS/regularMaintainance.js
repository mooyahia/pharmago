/* ================= WAIT FOR DOM LOAD ================= */
document.addEventListener("DOMContentLoaded", function () {

  /* ================= SELECT ELEMENTS ================= */
  const statusText = document.getElementById("statusText");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const maintenanceForm = document.getElementById("maintenanceForm");
  const createOperationBtn = document.getElementById("createOperationBtn");

  const lockScreen = document.getElementById("lockScreen");
  const lockAppBtn = document.getElementById("lockApp");

  const changePasswordScreen = document.getElementById("changePasswordScreen");
  const changePasswordBtn = document.getElementById("changePassword");
  const closeChangePasswordScreen = document.getElementById("closeChangePasswordScreen");

  const backupOverlay = document.getElementById("backupOverlay");
  const backupBtn = document.getElementById("backup");

  const themeOverlay = document.getElementById("themeOverlay");
  const themeBtn = document.getElementById("theme");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");

  /* ================= OPEN CREATE OPERATION MODAL ================= */
  if (createOperationBtn && modalOverlay) {
    createOperationBtn.addEventListener("click", function () {
      modalOverlay.style.display = "flex";
    });
  }

  /* ================= CLOSE MODAL ================= */
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener("click", function () {
      modalOverlay.style.display = "none";
    });

    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
      }
    });
  }

  /* ================= FORM SUBMIT ================= */
  if (maintenanceForm) {
    maintenanceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("تم حفظ العملية بنجاح ✅");
      modalOverlay.style.display = "none";
    });
  }

  /* ================= ACTIVATE OPERATION ================= */
  window.activateOperation = function () {
    if (statusText) {
      statusText.textContent = "نشط";
      statusText.className = "status-active";
    }
  };

  /* ================= STOP OPERATION ================= */
  window.stopOperation = function () {
    if (statusText) {
      statusText.textContent = "متوقف";
      statusText.className = "status-stopped";
    }
  };

  /* ================= DELETE OPERATION ================= */
  window.deleteOperation = function () {
    alert("تم حذف العملية");
  };

  /* ================= CLOSE PAGE ================= */
  window.closePage = function () {
    alert("تم إغلاق الصفحة");
  };

  /* ================= LOCK APP ================= */
  if (lockAppBtn && lockScreen) {
    lockAppBtn.addEventListener("click", function () {
      lockScreen.style.display = "flex";
    });
  }

  window.unlock = function () {
    lockScreen.style.display = "none";
  };

  /* ================= CHANGE PASSWORD ================= */
  if (changePasswordBtn && changePasswordScreen) {
    changePasswordBtn.addEventListener("click", function () {
      changePasswordScreen.style.display = "flex";
    });
  }

  if (closeChangePasswordScreen && changePasswordScreen) {
    closeChangePasswordScreen.addEventListener("click", function () {
      changePasswordScreen.style.display = "none";
    });
  }

  /* ================= BACKUP MODAL ================= */
  if (backupBtn && backupOverlay) {
    backupBtn.addEventListener("click", function () {
      backupOverlay.style.display = "flex";
    });
  }

  window.closeModal = function () {
    backupOverlay.style.display = "none";
  };

  window.chooseFolder = function () {
    const pathBox = document.getElementById("pathBox");
    if (pathBox) {
      pathBox.textContent = "D:\\PharmaGo\\Backup";
    }
  };

  /* ================= THEME MODAL ================= */
  if (themeBtn && themeOverlay) {
    themeBtn.addEventListener("click", function () {
      themeOverlay.style.display = "flex";
    });
  }

  if (saveSettingsBtn && themeOverlay) {
    saveSettingsBtn.addEventListener("click", function () {
      alert("تم حفظ الإعدادات ✅");
      themeOverlay.style.display = "none";
    });
  }

});