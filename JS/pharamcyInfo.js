/* ================= تعريف العناصر ================= */

const pharmacyID = document.getElementById("pharmacyID")
const pharmacyNameArabic = document.getElementById("pharmacyNameArabic")
const pharmacyNameEnglish = document.getElementById("pharmacyNameEnglish")
const pharmacyPhone = document.getElementById("pharmacyPhone")
const pharmacyMobile = document.getElementById("pharmacyMobile")
const pharmacyAddress = document.getElementById("pharmacyAddress")

const commercialRecordNumber = document.getElementById("commercialRecordNumber")
const taxCardNumber = document.getElementById("taxCardNumber")

const ownerName = document.getElementById("ownerName")
const ownerPhone = document.getElementById("ownerPhone")
const ownerMobile = document.getElementById("ownerMobile")
const ownerAddress = document.getElementById("ownerAddress")

const generalManagerName = document.getElementById("generalManagerName")
const generalManagerPhone = document.getElementById("generalManagerPhone")
const generalManagerMobile = document.getElementById("generalManagerMobile")
const generalManagerAddress = document.getElementById("generalManagerAddress")

const saveButton = document.getElementById("saveButton")
const editBtn = document.getElementById("editBtn")
const inputs = document.querySelectorAll(".content input")

/* ================= تعطيل الانبت عند تحميل الصفحة ================= */
window.addEventListener("DOMContentLoaded", function(){

    inputs.forEach(input => input.disabled = true)

    // ==== جلب البيانات من API وعرضها في الفورم ====
    const token = localStorage.getItem("authToken")
    fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/general-info/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
                "Accept": "application/json",
            "Authorization": `Token ${token}`
        }
    })
    .then(response => {
        const contentType = response.headers.get("content-type")
        if(contentType && contentType.includes("application/json")){
            return response.json()
        } else {
            return response.text()
        }
    })
    .then(data => {
        // لو رجع HTML بدل JSON
        if(typeof data === "string"){
            console.error("API returned HTML:", data)
            alert("الـ API رجع HTML مش JSON")
            return
        }

        // لو فيه مشكلة من الـ API
        if(data.status !== "success"){
            alert(data.message || "حدث خطأ من الـ API")
            return
        }

        // هنا نقرأ البيانات من data.data
        const pharma = data.data?.pharma || {}
        const owner = data.data?.owner || {}
        const manager = data.data?.manager || {}

        pharmacyID.value = pharma.pharmaId || ""
        pharmacyNameArabic.value = pharma.arabicName || ""
        pharmacyNameEnglish.value = pharma.englishName || ""
        pharmacyPhone.value = pharma.pharmaphone || ""
        pharmacyMobile.value = pharma.pharmamobile || ""
        pharmacyAddress.value = pharma.pharmaaddress || ""

        commercialRecordNumber.value = pharma.CommercialNumber || ""
        taxCardNumber.value = pharma.taxCard || ""

        ownerName.value = owner.ownername || ""
        ownerPhone.value = owner.ownerphone || ""
        ownerMobile.value = owner.ownermobile || ""
        ownerAddress.value = owner.owneraddress || ""

        generalManagerName.value = manager.Managername || ""
        generalManagerPhone.value = manager.Managerphone || ""
        generalManagerMobile.value = manager.Managermobile || ""
        generalManagerAddress.value = manager.Manageraddress || ""
    })
    .catch(err => {
        alert("حدث خطأ في الاتصال بالـ API: " + err)
        console.error(err)
    })

    /* ================= عند الضغط على زر التعديل ================= */
    editBtn.addEventListener("click", function(){
        inputs.forEach(input => input.disabled = false)
        if(inputs.length > 0) inputs[0].focus()
    })

    /* ================= عند الضغط على زر الحفظ ================= */
    saveButton.addEventListener("click", sendPharmacyData)

    function sendPharmacyData(){
        const token = localStorage.getItem("authToken")

        const data = {
            pharmaId: pharmacyID.value,
            arabicName: pharmacyNameArabic.value,
            englishName: pharmacyNameEnglish.value,
            pharmaphone: pharmacyPhone.value,
            pharmamobile: pharmacyPhone.value, // صححت هنا
            pharmaaddress: pharmacyAddress.value,
            branch: pharmacyID.value,

            CommercialNumber: commercialRecordNumber.value,
            taxCard: taxCardNumber.value,

            ownername: ownerName.value,
            ownermobile: ownerMobile.value,
            ownerphone: ownerPhone.value,
            owneraddress: ownerAddress.value,

            Managername: generalManagerName.value,
            Managerphone: generalManagerPhone.value,
            Managermobile: generalManagerMobile.value,
            Manageraddress: generalManagerAddress.value
        }

        fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/general-info/", {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            const contentType = response.headers.get("content-type")
            if(contentType && contentType.includes("application/json")){
                return response.json()
            } else {
                return response.text()
            }
        })
        .then(result => {
            if(typeof result === "string"){
                console.error("الـ API رجع HTML بدل JSON:", result)
                alert("حدث خطأ أثناء الحفظ: تحقق من الـ API")
            } else {
                console.log(result)
                alert(result.message || "تم حفظ البيانات بنجاح")
            }
        })
        .catch(error => {
            console.error(error)
            alert("خطأ في الاتصال بالـ API: " + error)
        })
    }

}) // ✅ نهاية DOMContentLoaded