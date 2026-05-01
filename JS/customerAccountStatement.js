    /* ================= MOCK DATA ================= */
    const reportData = [
      {
        date: "14/06/2014 00:00",
        doc: "0",
        description: "رصيد اول الفترة",
        debit: 0,
        credit: 0,
        balance: 0,
        user: "-",
        notes: "-"
      },
      {
        date: "14/06/2014 01:32",
        doc: "13",
        description: "فاتورة بيع",
        debit: 66,
        credit: 0,
        balance: 66,
        user: "مدير الصيدلية",
        notes: "-"
      },
      {
        date: "14/06/2014 01:34",
        doc: "15",
        description: "فاتورة بيع",
        debit: 27,
        credit: 0,
        balance: 93,
        user: "مدير الصيدلية",
        notes: "-"
      },
      {
        date: "14/06/2014 02:34",
        doc: "0",
        description: "رصيد نهاية الفترة",
        debit: 0,
        credit: 0,
        balance: 93,
        user: "-",
        notes: "-"
      }
    ];

    /* ================= RENDER TABLE ================= */
    function renderTable() {
      const tableBody = document.getElementById("reportTableBody");
      tableBody.innerHTML = "";

      reportData.forEach(item => {
        const row = `
          <tr>
            <td>${item.date}</td>
            <td>${item.doc}</td>
            <td>${item.description} <br> ${item.description}</td>
            <td>${item.debit}</td>
            <td>${item.credit}</td>
            <td>${item.balance}</td>
            <td>${item.user}</td>
            <td>${item.notes}</td>
          </tr>
          <div style="width: 100%;">mohamed</div>
        `;
        tableBody.innerHTML += row;
      });
    }

    /* ================= EVENT LISTENERS ================= */

    // Search Button
    document.getElementById("searchButton").addEventListener("click", () => {
      alert("تم تنفيذ البحث (تجريبي)");
    });

    // Print Button
    document.getElementById("printButton").addEventListener("click", () => {
      window.print();
    });

    // Close Button
    document.getElementById("closeButton").addEventListener("click", () => {
      alert("اغلاق الصفحة (تجريبي)");
    });

    /* ================= INIT ================= */
    renderTable();