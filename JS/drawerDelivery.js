
    // ===== Elements =====
    const cashInput = document.getElementById("cashInDrawer");
    const transferInput = document.getElementById("transferAmount");
    const remainingInput = document.getElementById("remainingAmount");

    const saveBtn = document.getElementById("saveBtn");
    const closeBtn = document.getElementById("closeBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    const modal = document.getElementById("posModal");

    // =========================
    // حساب المتبقي تلقائي
    // =========================
    function calculateRemaining() {
      const cash = parseFloat(cashInput.value) || 0;
      const transfer = parseFloat(transferInput.value) || 0;

      const remaining = cash - transfer;

      remainingInput.value = remaining >= 0 ? remaining : 0;
    }

    // Event Listeners للحساب
    cashInput.addEventListener("input", calculateRemaining);
    transferInput.addEventListener("input", calculateRemaining);

    // =========================
    // زر الحفظ
    // =========================
    saveBtn.addEventListener("click", () => {
      alert("تم الحفظ بنجاح ✅");
    });

    // =========================
    // زر الإغلاق
    // =========================
    function closeModal() {
      modal.style.display = "none";
    }

    closeBtn.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
