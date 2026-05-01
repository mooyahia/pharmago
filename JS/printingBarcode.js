
    const addItemBtn = document.getElementById("addItemBtn");
    const deleteItemBtn = document.getElementById("deleteItemBtn");
    const modal = document.getElementById("addItemModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const form = document.getElementById("addItemForm");
    const tableBody = document.getElementById("barcodeTableBody");

    let selectedRow = null;

    // فتح البوب اب
    addItemBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    // غلق البوب اب
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // إضافة صف
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("itemName").value;
      const price = document.getElementById("itemPrice").value;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${Math.floor(Math.random() * 100000)}</td>
        <td>${name}</td>
        <td>${name}</td>
        <td>${price}</td>
        <td>01/2026</td>
        <td>1</td>
        <td>10</td>
        <td>---</td>
      `;

      // ================= SELECT ROW =================
      row.addEventListener("click", () => {

        // إزالة التحديد من أي صف
        document.querySelectorAll("tr").forEach(r => {
          r.classList.remove("selected-row");
        });

        // تحديد الصف الحالي
        row.classList.add("selected-row");
        selectedRow = row;
      });

      tableBody.appendChild(row);

      form.reset();
      modal.classList.add("hidden");
    });

    // ================= DELETE =================
    deleteItemBtn.addEventListener("click", () => {
      if (selectedRow) {
        selectedRow.remove();
        selectedRow = null;
      } else {
        alert("من فضلك اختر صف الأول");
      }
    });
