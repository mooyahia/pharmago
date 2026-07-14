window.addEventListener("DOMContentLoaded", () => {

  const API_BASE_URL = "http://100.80.3.109:8000/api/";

  // ================= API =================
  async function apiRequest(url, method = "GET", data = null) {
    try {
      const res = await fetch(API_BASE_URL + url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: data ? JSON.stringify(data) : null,
      });

      const json = await res.json().catch(() => null);
      return { ok: res.ok, data: json };
    } catch (err) {
      console.log(err);
      return { ok: false, data: null };
    }
  }

  // ================= ELEMENTS =================
  const searchByCode = document.getElementById("searchByCode");
  const searchByName = document.getElementById("searchByName");
  const searchResults = document.getElementById("searchResults");
  const searchResultBox = document.getElementById("searchResult");

  const barcodeValue = document.getElementById("barcodeValue");
  const generateBtn = document.getElementById("generateBarcodeBtn");
  const printBtn = document.getElementById("printAndSaveBtn");

  const previewBox = document.getElementById("previewBox");

  let selectedProduct = null;
  let generatedBarcode = null;

  // ================= SHOW TABLE =================
  function showTable() {
    searchResultBox.style.display = "block";
  }

  // ================= NORMALIZE RESPONSE =================
  function normalize(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data) return Array.isArray(data.data) ? data.data : [data.data];
    return [data];
  }

  // ================= RANDOM BARCODE =================
  function generateRandomBarcode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ================= SEARCH =================
  async function searchProducts() {
    const code = searchByCode.value.trim();
    const name = searchByName.value.trim();

    if (!code && !name) {
      searchResults.innerHTML = "";
      return;
    }

    let url = "stocks/products/?";

    if (code) url += `id=${code}`;
    else url += `name=${name}`;

    const res = await apiRequest(url);

    if (!res.ok) return;

    const list = normalize(res.data);

    render(list);
    showTable();
  }

  searchByCode.addEventListener("input", searchProducts);
  searchByName.addEventListener("input", searchProducts);

  // ================= RENDER =================
  function render(list) {
    searchResults.innerHTML = "";

    if (!list.length) {
      searchResults.innerHTML = `<tr><td colspan="2">لا يوجد نتائج</td></tr>`;
      return;
    }

    list.forEach(p => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.trade_name || ""}</td>
      `;

      row.onclick = () => {
        selectedProduct = p;

        barcodeValue.value = "";
        barcodeValue.disabled = true;

        previewBox.innerHTML = `<p>أدخل البيانات لعرض المعاينة</p>`;
      };

      searchResults.appendChild(row);
    });
  }

  // ================= GENERATE BARCODE =================
  generateBtn.addEventListener("click", () => {

    if (!selectedProduct) {
      alert("اختار صنف الأول");
      return;
    }

    // 🔥 توليد باركود عشوائي
    generatedBarcode = generateRandomBarcode();

    // input
    barcodeValue.value = generatedBarcode;

    // preview
    previewBox.innerHTML = `<svg id="barcode"></svg>`;

    JsBarcode("#barcode", generatedBarcode, {
      format: "CODE128",
      width: 2,
      height: 90,
      displayValue: true
    });
  });

  // ================= PRINT + SAVE =================
  printBtn.addEventListener("click", async () => {

    if (!selectedProduct || !generatedBarcode) {
      alert("اعمل توليد باركود الأول");
      return;
    }

    // send to backend
    const res = await apiRequest("stocks/generate_barcode/", "POST", {
      product_id: selectedProduct.id,
      barcode: generatedBarcode
    });

    if (!res.ok) {
  console.log("ERROR DATA:", res.data);
  alert(res.data?.message || "فشل الحفظ");
  return;
}
    // print
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body style="text-align:center;font-family:Arial">
          <h3>${selectedProduct.trade_name || ""}</h3>
          ${previewBox.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  });

});