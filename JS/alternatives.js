window.addEventListener("DOMContentLoaded", () => {

  // ================= API =================
  const API_BASE_URL = "http://100.80.3.109:8000/api/";

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

      return { ok: res.ok, status: res.status, data: json };
    } catch (err) {
      console.error(err);
      return { ok: false, status: 0, data: null };
    }
  }

  // ================= ELEMENTS =================
  const mainTableBody = document.getElementById("mainTableBody");
  const altTableBody = document.getElementById("altTable");

  const addBtn = document.getElementById("addBtn");
  const deleteBtn = document.getElementById("deleteBtn");
const searchCode = document.getElementById("searchCode");
const searchBtn = document.getElementById("searchBtn");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const saveAlter = document.getElementById("saveAlter");

  const f1 = document.getElementById("f1");
  const f2 = document.getElementById("f2");

  const alternativesTab = document.getElementById("alternativesTab");
  const alternativesContent = document.getElementById("alternatives");

  let selectedProduct = null;
  let selectedAlternative = null;
  let alternatives = [];

  // ================= SHOW TAB =================
  function showAlternativesTab() {
    alternativesContent.classList.add("active");
  }

  alternativesTab.addEventListener("click", showAlternativesTab);


searchBtn.addEventListener("click", async () => {
  const code = searchCode.value.trim();

  let url = "stocks/products?";

  if (code) {
    url += `id=${code}`;
  } 
  else {
    alert("اكتب كود للبحث");
    return;
  }

  const res = await apiRequest(url);

  if (!res.ok) {
    mainTableBody.innerHTML = "";
    return;
  }

  const data = res.data?.data || [];
  renderProducts(Array.isArray(data) ? data : [data]);
});
  // ================= RENDER PRODUCTS =================
  function renderProducts(list) {
    mainTableBody.innerHTML = "";

    list.forEach(p => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.trade_name ?? ""}</td>
        <td>${p.category ?? ""}</td>
        <td>${p.trade_name_en ?? ""}</td>
        <td>${p.scientific_name ?? ""}</td>
      `;

      row.addEventListener("click", () => {
        document.querySelectorAll("#mainTableBody tr")
          .forEach(r => r.classList.remove("active"));

        row.classList.add("active");

        selectedProduct = p;

        loadAlternatives(p.id);
      });

      mainTableBody.appendChild(row);
    });
  }

  // ================= RENDER ALTERNATIVES =================
function renderAlternatives(list) {
  altTableBody.innerHTML = "";

  if (!list || list.length === 0) {
    altTableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">لا يوجد بدائل</td>
      </tr>
    `;
    return;
  }

  // 👇 أهم سطر هنا
  const filtered = list.filter(
    a => a.product == selectedProduct.id
  );

  filtered.forEach(a => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${a.product}</td>
      <td>${a.product_name}</td>
      <td>${a.alternative}</td>
      <td>${a.alternative_name}</td>
    `;

    row.addEventListener("click", () => {
      document.querySelectorAll("#altTable tr")
        .forEach(r => r.classList.remove("active"));

      row.classList.add("active");

      selectedAlternative = a;
    });

    altTableBody.appendChild(row);
  });
}

  // ================= LOAD ALTERNATIVES =================
  async function loadAlternatives(productId) {
    console.log("Loading alternatives:", productId);

    const res = await apiRequest(
      `stocks/alternatives/?product_id=${productId}`
    );

    console.log(res);

    if (!res.ok) {
      altTableBody.innerHTML = "";
      alternatives = [];
      return;
    }

    alternatives = res.data?.data || [];
    renderAlternatives(alternatives);

    // 👇 show tab automatically
    showAlternativesTab();
  }

  // ================= ADD =================
  addBtn.onclick = () => {
    if (!selectedProduct) {
      alert("اختار صنف الأول");
      return;
    }

    modal.style.display = "flex";
    f1.value = selectedProduct.id;
    f2.value = "";
  };

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  // ================= SAVE =================
  saveAlter.onclick = async () => {
    const product = f1.value;
    const alt = f2.value;

    if (!product || !alt) {
      alert("ادخل البيانات");
      return;
    }

    const res = await apiRequest("stocks/alternatives/", "POST", {
      product,
      alternative: alt,
    });

    if (!res.ok) {
      alert("فشل الإضافة");
      return;
    }

    modal.style.display = "none";
    await loadAlternatives(product);
  };

  // ================= DELETE =================
deleteBtn.onclick = async () => {
  if (!selectedAlternative) {
    alert("اختار بديل");
    return;
  }

  const res = await apiRequest(
    "stocks/alternatives/",
    "DELETE",
    {
      product_id: selectedAlternative.product,
      alternative_id: selectedAlternative.alternative
    }
  );

  if (!res.ok) {
    alert("فشل الحذف");
    return;
  }

  await loadAlternatives(selectedProduct.id);
};

  // ================= INIT =================
  (async function init() {
    const res = await apiRequest("stocks/products/");
    const data = res.data?.data || [];
    renderProducts(data);
  })();



  let html5QrCode = null;

const cameraOverlay = document.getElementById("cameraOverlay");
const closeCameraBtn = document.getElementById("closeCamera");
const cameraBtn = document.getElementById("cameraBtn");

// ================= OPEN CAMERA =================
async function openCamera() {
  cameraOverlay.style.display = "flex";

  html5QrCode = new Html5Qrcode("reader");

  try {
    const devices = await Html5Qrcode.getCameras();

    if (!devices || devices.length === 0) {
      alert("مفيش كاميرا متاحة");
      return;
    }

    const cameraId = devices[0].id;

    await html5QrCode.start(
      cameraId,
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        console.log("SCAN RESULT:", decodedText);

        // حط النتيجة في البحث
        document.getElementById("searchCode").value = decodedText;

        closeCamera();
      }
    );

  } catch (err) {
    console.error(err);
    alert("مش قادر يفتح الكاميرا");
  }
}

// ================= CLOSE CAMERA =================
function closeCamera() {
  if (html5QrCode) {
    html5QrCode.stop()
      .then(() => {
        html5QrCode.clear();
        cameraOverlay.style.display = "none";
      })
      .catch(() => {
        cameraOverlay.style.display = "none";
      });
  }
}

// ================= EVENTS =================
cameraBtn.addEventListener("click", openCamera);
closeCameraBtn.addEventListener("click", closeCamera);
});