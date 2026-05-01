
      let rowCount = 1;

      function recalc(rowId, input) {
        const row = document.getElementById(rowId);
        if (!row) return;
        const qty = parseFloat(row.querySelector(".qty-input").value) || 1;
        const disc =
          parseFloat(row.querySelector(".discount-input").value) || 0;
        const price = 10; // fixed for this demo
        const before = qty * price;
        const after = before - disc;
        document.getElementById("before_" + rowId).textContent =
          before.toFixed(0);
        document.getElementById("after_" + rowId).textContent =
          after.toFixed(0);
        updateTotals();
      }

      function updateTotals() {
        const afters = document.querySelectorAll('[id^="after_"]');
        const befores = document.querySelectorAll('[id^="before_"]');
        let totalAfter = 0,
          totalBefore = 0;
        afters.forEach((el) => (totalAfter += parseFloat(el.textContent) || 0));
        befores.forEach(
          (el) => (totalBefore += parseFloat(el.textContent) || 0),
        );
        document.getElementById("totalAfter").textContent =
          totalAfter.toFixed(0);
        document.getElementById("totalDiscount").textContent = (
          totalBefore - totalAfter
        ).toFixed(0);
        document.getElementById("grandTotal").textContent =
          totalAfter.toFixed(0);
        document.getElementById("countItems").textContent = afters.length;
      }

      function deleteRow(rowId) {
        const row = document.getElementById(rowId);
        if (row) {
          row.style.opacity = "0";
          row.style.transform = "translateX(20px)";
          row.style.transition = "all 0.25s ease";
          setTimeout(() => {
            row.remove();
            updateTotals();
          }, 250);
        }
      }

      function addToInvoice() {
        rowCount++;
        const id = "row_" + rowCount;
        const tbody = document.getElementById("invoiceBody");
        const tr = document.createElement("tr");
        tr.id = id;
        tr.style.opacity = "0";
        tr.innerHTML = `
      <td><span class="badge badge-primary">MED008</span></td>
      <td style="font-weight:600; text-align:right; white-space:nowrap;">باراسيتامول شراب أطفال</td>
      <td><span class="badge badge-orange">مسكنات</span></td>
      <td>120</td>
      <td>6</td>
      <td><input type="number" class="qty-input" value="1" min="1" onchange="recalc('${id}', this)"></td>
      <td>
        <select class="unit-select">
          <option>شريط</option><option>زجاجة</option><option>علبة</option>
        </select>
      </td>
      <td>10</td>
      <td><input type="number" class="discount-input" value="0" min="0" onchange="recalc('${id}', this)"></td>
      <td class="price-before" id="before_${id}">10</td>
      <td class="price-after" id="after_${id}">10</td>
      <td>
        <button class="delete-btn" onclick="deleteRow('${id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </td>
    `;
        tbody.appendChild(tr);
        requestAnimationFrame(() => {
          tr.style.transition = "opacity 0.25s ease, transform 0.25s ease";
          tr.style.opacity = "1";
        });
        updateTotals();
      }