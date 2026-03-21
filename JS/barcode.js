
    // ===== Elements =====
    const previewBox = document.getElementById("previewBox");

    const drugName = document.getElementById("drugName");
    const scientificName = document.getElementById("scientificName");
    const quantity = document.getElementById("quantity");
    const price = document.getElementById("price");
    const expiryDate = document.getElementById("expiryDate");

    const barcodeValue = document.getElementById("barcodeValue");
    const barcodeType = document.getElementById("barcodeType");
    const generateBtn = document.getElementById("generateBarcodeBtn");

    // =========================
    // توليد باركود
    // =========================
    function generateBarcode() {

      let code = "";

      if (barcodeType.value === "EAN13") {
        // لازم 13 رقم
        for (let i = 0; i < 13; i++) {
          code += Math.floor(Math.random() * 10);
        }
      } else {
        // CODE128
        code = Math.random().toString(36).substring(2, 12).toUpperCase();
      }

      barcodeValue.value = code;
      updatePreview();
    }

    generateBtn.addEventListener("click", generateBarcode);

    // =========================
    // تحديث المعاينة + رسم الباركود
    // =========================
    function updatePreview() {

      previewBox.innerHTML = `
        <h3>${drugName.value || "اسم الدواء"}</h3>
        <p>${scientificName.value || ""}</p>
        <p>الكمية: ${quantity.value}</p>
        <p>السعر: ${price.value}</p>
        <p>الصلاحية: ${expiryDate.value}</p>
        <svg id="barcode"></svg>
      `;

      if (barcodeValue.value) {
        try {
          JsBarcode("#barcode", barcodeValue.value, {
            format: barcodeType.value,
            lineColor: "#000",
            width: 2,
            height: 60,
            displayValue: true
          });
        } catch (e) {
          console.error("Barcode Error:", e);
        }
      }
    }

    // تحديث تلقائي
    document.querySelectorAll("input, select").forEach(el => {
      el.addEventListener("input", updatePreview);
    });

    // =========================
    // طباعة
    // =========================
    document.getElementById("printBtn").addEventListener("click", () => {
      window.print();
    });
