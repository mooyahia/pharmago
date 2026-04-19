/* ================= تعريف العناصر ================= */

const API_BASE = "https://your-api-url.com";

const searchByCode = document.getElementById("searchByCode");
const searchByName = document.getElementById("searchByName");

const searchTable = document.getElementById("searchTable");
const searchResults = document.getElementById("searchResults");

const invoiceBody = document.getElementById("invoiceBody");

const totalDiscountEl = document.getElementById("totalDiscount");
const totalAfterEl = document.getElementById("totalAfter");
const grandTotalEl = document.getElementById("grandTotal");

const extraFeesInput = document.getElementById("extraFees");

const cameraBtn = document.getElementById("cameraBtn");
const overlay = document.getElementById("cameraOverlay");
const reader = document.getElementById("reader");
const closeBtn = document.getElementById("closeCamera");

/* ================= بيانات الفاتورة ================= */

let selectedProduct = null;
let invoiceItems = [];
let html5QrCode = null;

/* ================= SEARCH EVENTS ================= */

searchByCode.addEventListener("input", handleSearch);
searchByName.addEventListener("input", handleSearch);

/* ================= SEARCH FUNCTION ================= */

async function handleSearch() {
  const code = searchByCode.value.trim();
  const name = searchByName.value.trim();

  if (code.length < 1 && name.length < 2) {
    searchTable.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/products?code=${code}&name=${name}`);
    const data = await res.json();

    renderSearchResults(data);

  } catch (err) {
    console.error(err);
  }
}

/* ================= RENDER SEARCH ================= */

function renderSearchResults(products) {
  searchResults.innerHTML = "";

  if (!products.length) {
    searchTable.style.display = "none";
    return;
  }

  searchTable.style.display = "block";

  products.forEach(p => {
    searchResults.innerHTML += `
      <tr>
        <td><span class="badge badge-primary">${p.code}</span></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.unit}</td>
        <td>${p.price}</td>
        <td>${p.availableQty}</td>
        <td>
          <button onclick='addToInvoice(${JSON.stringify(p)})'>
            اختيار
          </button>
        </td>
      </tr>
    `;
  });
}

/* ================= ADD TO INVOICE ================= */

function addToInvoice(product) {
  selectedProduct = product;

  const exist = invoiceItems.find(i => i.code === product.code);

  if (exist) {
    if (exist.qty + 1 > product.availableQty) {
      alert("الكمية غير متاحة");
      return;
    }
    exist.qty++;
  } else {
    invoiceItems.push({
      ...product,
      qty: 1,
      discount: 0,
      unitType: "unit"
    });
  }

  renderInvoice();
}

/* ================= RENDER INVOICE ================= */

function renderInvoice() {
  invoiceBody.innerHTML = "";

  invoiceItems.forEach((item, index) => {

    const price = getPriceByUnit(item);
    const before = item.qty * price;
    const discountValue = before * (item.discount / 100);
    const after = before - discountValue;

    invoiceBody.innerHTML += `
      <tr>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.availableQty}</td>
        <td>${item.limitQty}</td>

        <td>
          <input type="number" value="${item.qty}" min="1"
          onchange="updateQty(${index}, this.value)">
        </td>

        <td>
          <select onchange="changeUnit(${index}, this.value)">
            <option value="unit">شريط</option>
            <option value="box">علبة</option>
          </select>
        </td>

        <td>${price}</td>

        <td>
          <input type="number" value="${item.discount}" min="0" max="100"
          onchange="updateDiscount(${index}, this.value)">
        </td>

        <td>${before.toFixed(2)}</td>
        <td>${after.toFixed(2)}</td>

        <td>
          <button onclick="deleteItem(${index})">X</button>
        </td>
      </tr>
    `;
  });

  calcTotals();
}

/* ================= PRICE LOGIC ================= */

function getPriceByUnit(item) {
  return item.unitType === "box" ? item.boxPrice : item.unitPrice;
}

/* ================= UPDATE FUNCTIONS ================= */

function updateQty(index, value) {
  const item = invoiceItems[index];
  value = parseInt(value);

  if (value > item.availableQty) {
    alert("الكمية أكبر من المتاح");
    return;
  }

  if (value > item.limitQty) {
    alert("تعديت حد الطلب");
    return;
  }

  item.qty = value;
  renderInvoice();
}

function updateDiscount(index, value) {
  invoiceItems[index].discount = parseFloat(value) || 0;
  renderInvoice();
}

function changeUnit(index, value) {
  invoiceItems[index].unitType = value;
  renderInvoice();
}

/* ================= DELETE ================= */

function deleteItem(index) {
  invoiceItems.splice(index, 1);
  renderInvoice();
}

/* ================= TOTALS ================= */

function calcTotals() {
  let totalAfter = 0;
  let totalDiscount = 0;

  invoiceItems.forEach(item => {
    const price = getPriceByUnit(item);
    const before = item.qty * price;
    const discount = before * (item.discount / 100);

    totalDiscount += discount;
    totalAfter += before - discount;
  });

  const extra = parseFloat(extraFeesInput.value) || 0;

  totalDiscountEl.innerText = totalDiscount.toFixed(2);
  totalAfterEl.innerText = totalAfter.toFixed(2);
  grandTotalEl.innerText = (totalAfter + extra).toFixed(2);
}

/* ================= CAMERA ================= */

cameraBtn.addEventListener("click", async () => {
  overlay.style.display = "flex";

  html5QrCode = new Html5Qrcode("reader");

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {

        await html5QrCode.stop();

        overlay.style.display = "none";

        try {
          const res = await fetch(`${API_BASE}/products/barcode/${decodedText}`);
          const product = await res.json();

          addToInvoice(product);

        } catch {
          alert("المنتج غير موجود");
        }
      }
    );

  } catch (err) {
    console.error(err);
    alert("فشل تشغيل الكاميرا");
  }
});

/* ================= CLOSE CAMERA ================= */

closeBtn.onclick = async () => {
  try {
    if (html5QrCode) {
      await html5QrCode.stop();
      await html5QrCode.clear();
    }
  } catch {}

  overlay.style.display = "none";
};
