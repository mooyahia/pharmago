const API_BASE = "https://your-api-url.com"; // غيره

let selectedProduct = null;
let invoiceItems = [];

/* ================= SEARCH ================= */

const searchByCode = document.getElementById("searchByCode");
const searchByName = document.getElementById("searchByName");

searchByCode.addEventListener("input", handleSearch);
searchByName.addEventListener("input", handleSearch);

async function handleSearch() {
  const code = searchByCode.value.trim();
  const name = searchByName.value.trim();

  if (code.length < 1 && name.length < 2) {
    document.getElementById("searchTable").style.display = "none";
    return;
  }

  const res = await fetch(`${API_BASE}/products?code=${code}&name=${name}`);
  const data = await res.json();

  renderSearchResults(data);
}

/* ================= RENDER SEARCH ================= */

function renderSearchResults(products) {
  const tbody = document.getElementById("searchResults");
  tbody.innerHTML = "";

  if (!products.length) {
    document.getElementById("searchTable").style.display = "none";
    return;
  }

  document.getElementById("searchTable").style.display = "block";

  products.forEach(p => {
    const row = `
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
    tbody.innerHTML += row;
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
  const tbody = document.getElementById("invoiceBody");
  tbody.innerHTML = "";

  invoiceItems.forEach((item, index) => {
    const price = getPriceByUnit(item);

    const before = item.qty * price;
    const discountValue = before * (item.discount / 100);
    const after = before - discountValue;

    const row = `
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

    tbody.innerHTML += row;
  });

  calcTotals();
}

/* ================= PRICE LOGIC ================= */

function getPriceByUnit(item) {
  if (item.unitType === "box") return item.boxPrice;
  return item.unitPrice;
}

/* ================= UPDATE ================= */

function updateQty(index, value) {
  const item = invoiceItems[index];

  if (value > item.availableQty) {
    alert("الكمية أكبر من المتاح");
    return;
  }

  if (value > item.limitQty) {
    alert("تعديت حد الطلب");
    return;
  }

  item.qty = parseInt(value);
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
  let totalBefore = 0;
  let totalDiscount = 0;
  let totalAfter = 0;

  invoiceItems.forEach(item => {
    const price = getPriceByUnit(item);
    const before = item.qty * price;
    const discount = before * (item.discount / 100);

    totalBefore += before;
    totalDiscount += discount;
    totalAfter += (before - discount);
  });

  const extra = parseFloat(document.getElementById("extraFees").value) || 0;
  const grand = totalAfter + extra;

  document.getElementById("countItems").innerText = invoiceItems.length;
  document.getElementById("totalDiscount").innerText = totalDiscount.toFixed(2);
  document.getElementById("totalAfter").innerText = totalAfter.toFixed(2);
  document.getElementById("grandTotal").innerText = grand.toFixed(2);
}

/* ================= BUTTONS ================= */

document.getElementById("addNewItem").onclick = () => {
  window.location.href = "addProduct.html";
};

document.getElementById("editItem").onclick = async () => {
  if (!selectedProduct) {
    alert("اختار صنف الأول");
    return;
  }

  const res = await fetch(`${API_BASE}/products/${selectedProduct.id}`);
  const data = await res.json();

  localStorage.setItem("editProduct", JSON.stringify(data));
  window.location.href = "addProduct.html?edit=true";
};

document.getElementById("createNewInvoice").onclick = () => {
  window.open("sellingInvoice.html", "_blank");
};

document.getElementById("deleteInvoice").onclick = () => {
  if (!confirm("متأكد؟")) return;

  invoiceItems = [];
  renderInvoice();
};

document.getElementById("saveInvoice").onclick = async () => {
  await fetch(`${API_BASE}/invoices`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(invoiceItems)
  });

  alert("تم الحفظ");
};

document.getElementById("printInvoice").onclick = async () => {
  const res = await fetch(`${API_BASE}/invoices/print`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(invoiceItems)
  });

  const html = await res.text();

  const win = window.open("");
  win.document.write(html);
  win.print();
};

/* ================= CAMERA SCANNER ================= */

const cameraBtn = document.getElementById("cameraBtn");
const readerDiv = document.getElementById("reader");
const overlay = document.getElementById("cameraOverlay");

let html5QrCode;

cameraBtn.addEventListener("click", () => {
  document.getElementById("readerWrapper").style.display = "block";
document.getElementById("cameraOverlay").style.display = "block";

  html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText) => {

      await html5QrCode.stop();
      readerDiv.style.display = "none";
      overlay.style.display = "none";

      try {
        const res = await fetch(`${API_BASE}/products/barcode/${decodedText}`);
        const product = await res.json();

        addToInvoice(product);

      } catch (e) {
        alert("المنتج غير موجود");
      }
    },
    (error) => {
      console.log(error);
    }
  );
});

/* ================= CLOSE CAMERA ================= */

document.getElementById("closeCamera").onclick = async () => {
  if (html5QrCode) {
    await html5QrCode.stop();
  }
  document.getElementById("readerWrapper").style.display = "none";
document.getElementById("cameraOverlay").style.display = "none";
};
