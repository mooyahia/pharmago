
    // ===== Dummy Data =====
    const invoices = [
      { id: 1, type: 'بيع', code: 'INV001', customer: 'أحمد', date: '2026-03-01', items: 5, total: 500 },
      { id: 2, type: 'بيع', code: 'INV002', customer: 'محمد', date: '2026-03-02', items: 3, total: 300 }
    ];

    // ===== Render Table =====
    function renderInvoices(data) {
      const tableBody = document.getElementById('invoiceTableBody');
      tableBody.innerHTML = '';

      let total = 0;

      data.forEach(inv => {
        total += inv.total;

        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${inv.id}</td>
          <td>${inv.type}</td>
          <td>${inv.code}</td>
          <td>${inv.customer}</td>
          <td>${inv.date}</td>
          <td>${inv.items}</td>
          <td>${inv.total}</td>
        `;

        // ===== Row Selection =====
        row.addEventListener('click', () => {
          // Remove selection from all rows
          document.querySelectorAll('#invoiceTableBody tr').forEach(r => r.classList.remove('selected-row'));

          // Add selection to clicked row
          row.classList.add('selected-row');
        });

        tableBody.appendChild(row);
      });

      document.getElementById('totalInvoices').innerText = data.length;
      document.getElementById('totalAmount').innerText = total;
    }

    // ===== Search Function =====
    function searchInvoices() {
      const fromDate = document.getElementById('fromDate').value;
      const toDate = document.getElementById('toDate').value;

      let filtered = invoices;

      if (fromDate) {
        filtered = filtered.filter(i => i.date >= fromDate);
      }

      if (toDate) {
        filtered = filtered.filter(i => i.date <= toDate);
      }

      renderInvoices(filtered);
    }

    // ===== Reset Filters =====
    function resetFilters() {
      document.getElementById('fromDate').value = '';
      document.getElementById('toDate').value = '';
      renderInvoices(invoices);
    }

    // ===== Init =====
    renderInvoices(invoices);
    

    // ===== Init =====
    renderInvoices(invoices);
