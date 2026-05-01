/* ================= تعريف العناصر ================= */

const pharmacyID = document.getElementById("pharmacyID")
const pharmacyNameArabic = document.getElementById("pharmacyNameArabic")
const pharmacyNameEnglish = document.getElementById("pharmacyNameEnglish")
const pharmacyMobile = document.getElementById("pharmacyMobile")
const pharmacyMobile2 = document.getElementById("pharmacyMobile2")
const pharmacyAddress = document.getElementById("pharmacyAddress")

const commercialRecordNumber = document.getElementById("commercialRecordNumber")
const taxCardNumber = document.getElementById("taxCardNumber")

const ownerName = document.getElementById("ownerName")
const ownerEmail = document.getElementById("ownerEmail")
const ownerMobile = document.getElementById("ownerMobile")

const generalManagerName = document.getElementById("generalManagerName")
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
            "Authorization": `Token ${token}`,
            'ngrok-skip-browser-warning': '69420'
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

        if(data.status == "success"){
            console.log("success");
            
        }

        // هنا نقرأ البيانات من data.data
        const pharma = data.data?.pharma || {}
        const owner = data.data?.owner || {}
        const manager = data.data?.manager || {}

        pharmacyID.value = pharma.id || ""
        pharmacyNameArabic.value = pharma.pharmacy_name_ar || ""
        pharmacyNameEnglish.value = pharma.pharmacy_name_en || ""
        pharmacyMobile.value = pharma.phone_1 || ""
        pharmacyMobile2.value = pharma.phone_2 || ""
        pharmacyAddress.value = pharma.address || ""

        commercialRecordNumber.value = pharma.commercial_register || ""
        taxCardNumber.value = pharma.tax_id || ""

        ownerName.value = owner.full_name || ""
        ownerMobile.value = owner.phone || ""
        ownerEmail.value = owner.email || ""

        generalManagerName.value = manager.full_name || ""
        generalManagerMobile.value = manager.phone || ""
        generalManagerAddress.value = manager.address || ""

        
    })
    .catch(err => {
        alert( err)
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
        pharma: {
            id: Number(pharmacyID.value),
            pharmacy_name_ar: pharmacyNameArabic.value,
            pharmacy_name_en: pharmacyNameEnglish.value,
            address: pharmacyAddress.value,
            phone_1: pharmacyMobile.value,
            phone_2: pharmacyMobile2.value,
            tax_id: taxCardNumber.value,
            commercial_register: commercialRecordNumber.value
        },

        owner: {
            full_name: ownerName.value,
            phone: ownerMobile.value,
            email: ownerEmail.value,
            title: "owner"
        },

        manager: {
            full_name: generalManagerName.value,
            phone: generalManagerMobile.value,
            address: generalManagerAddress.value,
            title: "manager"
        }
    };
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

}) 

