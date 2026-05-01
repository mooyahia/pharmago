/***********************
 * CONFIG
 ***********************/
const API_BASE_URL = "https://your-api.com/api"; // غيّرها بسهولة

/***********************
 * TABS SYSTEM
 ***********************/
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});


/***********************
 * CAMERA WITH OVERLAY (html5-qrcode)
 ***********************/
let html5QrCode = null;
let scanning = false;

const cameraBtn = document.getElementById("cameraBtn");
const overlay = document.getElementById("cameraOverlay");
const closeCameraBtn = document.getElementById("closeCamera");

cameraBtn.addEventListener("click", startCamera);
closeCameraBtn.addEventListener("click", stopCamera);

async function startCamera() {
  overlay.style.display = "flex";

  html5QrCode = new Html5Qrcode("reader");

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 150 }
      },
      (decodedText) => {
        document.getElementById("companyCode").value = decodedText;
        stopCamera();
      }
    );

    scanning = true;

  } catch (err) {
    console.error("Camera error:", err);
  }
}

async function stopCamera() {
  if (html5QrCode && scanning) {
    await html5QrCode.stop();
    await html5QrCode.clear();
  }

  overlay.style.display = "none";
  scanning = false;
}


/***********************
 * SUPPLIERS DATA
 ***********************/
let suppliersContainer = [];
let selectedSupplierIndex = null;

/***********************
 * POPUP HANDLING
 ***********************/
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addSupplierBtn");
const editBtn = document.getElementById("editSupplierBtn");
const deleteBtn = document.getElementById("deleteSupplierBtn");
const closePopup = document.getElementById("closePopup");
const saveSupplierBtn = document.getElementById("supplierSaveBtn");

addBtn.onclick = () => openPopup("add");
editBtn.onclick = () => openPopup("edit");
deleteBtn.onclick = deleteSupplier;
closePopup.onclick = () => popup.style.display = "none";

function openPopup(mode) {
  popup.style.display = "flex";

  if (mode === "edit" && selectedSupplierIndex === null) {
    alert("اختر مورد أولاً");
    popup.style.display = "none";
    return;
  }

  if (mode === "edit") {
    fillPopup(suppliersContainer[selectedSupplierIndex]);
  } else {
    clearPopup();
  }

  popup.dataset.mode = mode;
}

function clearPopup() {
  document.getElementById("supplierCode").value = "";
  document.getElementById("supplierName").value = "";
  document.getElementById("itemCode").value = "";
  document.getElementById("buyPrice").value = "";
  document.getElementById("tax").value = "";
  document.getElementById("sellPrice").value = "";
  document.getElementById("disc1").value = "";
}

function fillPopup(data) {
  document.getElementById("supplierCode").value = data.code;
  document.getElementById("supplierName").value = data.name;
  document.getElementById("itemCode").value = data.itemCode;
  document.getElementById("buyPrice").value = data.buyPrice;
  document.getElementById("tax").value = data.tax;
  document.getElementById("sellPrice").value = data.sellPrice;
  document.getElementById("disc1").value = data.discount;
}

/***********************
 * SAVE SUPPLIER
 ***********************/
saveSupplierBtn.addEventListener("click", () => {
  const supplier = {
    code: supplierCode.value,
    name: supplierName.value,
    itemCode: itemCode.value,
    buyPrice: buyPrice.value,
    tax: tax.value,
    sellPrice: sellPrice.value,
    discount: disc1.value
  };

  const mode = popup.dataset.mode;

  if (mode === "edit") {
    suppliersContainer[selectedSupplierIndex] = supplier;
  } else {
    suppliersContainer.push(supplier);
  }

  renderSuppliers();
  popup.style.display = "none";
});

/***********************
 * DELETE SUPPLIER
 ***********************/
function deleteSupplier() {
  if (selectedSupplierIndex === null) {
    alert("اختار مورد");
    return;
  }

  suppliersContainer.splice(selectedSupplierIndex, 1);
  selectedSupplierIndex = null;
  renderSuppliers();
}

/***********************
 * RENDER TABLE
 ***********************/
function renderSuppliers() {
  const tbody = document.getElementById("suppliersTable");
  tbody.innerHTML = "";

  suppliersContainer.forEach((s, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.code}</td>
      <td>${s.name}</td>
      <td>${s.itemCode}</td>
      <td>${s.buyPrice}</td>
      <td>${s.tax}</td>
      <td>${s.sellPrice}</td>
      <td>${s.discount}</td>
    `;

    row.addEventListener("click", () => {
      selectedSupplierIndex = index;
      document.querySelectorAll("#suppliersTable tr")
        .forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
    });

    tbody.appendChild(row);
  });
}

/***********************
 * SUPPLIER SEARCH (AUTOCOMPLETE STYLE)
 ***********************/
const supplierSearchInput = document.getElementById("supplierName");

supplierSearchInput.addEventListener("input", () => {
  const value = supplierSearchInput.value.toLowerCase();

  const match = suppliersContainer.find(s =>
    s.name.toLowerCase().includes(value) ||
    s.code.includes(value)
  );

  if (match) {
    document.getElementById("supplierCode").value = match.code;
    document.getElementById("itemCode").value = match.itemCode;
    document.getElementById("buyPrice").value = match.buyPrice;
    document.getElementById("tax").value = match.tax;
    document.getElementById("sellPrice").value = match.sellPrice;
    document.getElementById("disc1").value = match.discount;
  }
});

/***********************
 * SAVE PRODUCT (API POST)
 ***********************/
document.getElementById("saveProductBtn").addEventListener("click", async () => {

  const product = {
    productCode1: productCode1.value,
    productNameAr: productNameAr.value,
    productNameEn: productNameEn.value,
    productCompany: productCompany.value,
    companyCode: companyCode.value,
    productType: productType.value,
    productGroup: productGroup.value,
    usageReasons: usageReasons.value,
    usageMethods: usageMethods.value,
    productNotes: productNotes.value,

    isRegular: isRegular.checked,
    isFridge: isFridge.checked,
    hasExpiry: hasExpiry.checked,
    noPurchaseReturn: noPurchaseReturn.checked,
    printName: printName.checked,
    printBarcode: printBarcode.checked,

    scientificGroup: scientificGroup.value,
    activeIngredient: activeIngredient.value,
    activeIngredientPercent: activeIngredientPercent.value,

    maxDiscountValue: maxDiscountValue.value,
    maxDiscountPercent: maxDiscountPercent.value,

    minQuantity: minQuantity.value,
    orderLimit: orderLimit.value,
    saleUnit: saleUnit.value,
    purchaseUnit: purchaseUnit.value,

    purchasePrice: purchasePrice.value,
    discountPercent: discountPercent.value,
    taxValue: taxValue.value,
    salePrice: salePrice.value,

    suppliers: suppliersContainer
  };

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    if (!res.ok) throw new Error("Failed to save product");

    alert("تم حفظ الصنف بنجاح");

  } catch (err) {
    console.error(err);
    alert("حصل خطأ في الحفظ");
  }
});