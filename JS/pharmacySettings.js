/* ================= تعريف الأزرار ================= */

const saveButton = document.querySelector(".save-btn")


/* ================= تحميل البيانات من API ================= */

function loadSettings(){

    const token = localStorage.getItem("authToken")

    fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/pharmacy-settings/",{

        method:"GET",

        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json",
            "Authorization": `Token ${token}`
        }

    })

    .then(res => res.json())

    .then(result => {

        const data = result.data || result

        const elements = document.querySelectorAll(".content input, .content select")

        elements.forEach(el => {

            if(!el.id) return

            if(el.type === "checkbox"){

                el.checked = data[el.id] || false

            }

            else{

                el.value = data[el.id] || ""

            }

        })

    })

    .catch(err => {

        console.error(err)

        alert("حدث خطأ في تحميل البيانات")

    })

}


/* ================= جمع كل الفيلدز تلقائي ================= */

function collectFormData(){

    const data = {}

    const elements = document.querySelectorAll(".content input, .content select")

    elements.forEach(el => {

        if(!el.id) return

        if(el.type === "checkbox"){

            data[el.id] = el.checked

        }

        else if(el.type === "file"){

            data[el.id] = el.files[0] ? el.files[0].name : null

        }

        else{

            data[el.id] = el.value

        }

    })

    return data
}


/* ================= إرسال البيانات للـ API ================= */

function sendSettingsData(){

    const token = localStorage.getItem("authToken")

    const data = collectFormData()

    fetch("https://tuppenny-diminishingly-vi.ngrok-free.dev/api/generalinfo/pharmacy-settings/",{

        method:"POST",

        headers:{
            "Content-Type":"application/json",
            "Authorization": `Token ${token}`
        },

        body: JSON.stringify(data)

    })

    .then(res => res.json())

    .then(result => {

        console.log(result)

        alert(result.message || "تم حفظ البيانات بنجاح")

    })

    .catch(err => {

        console.error(err)

        alert("حدث خطأ أثناء الحفظ")

    })

}


/* ================= زر الحفظ ================= */

saveButton.addEventListener("click", sendSettingsData)


/* ================= تشغيل العرض عند فتح الصفحة ================= */

window.addEventListener("DOMContentLoaded", loadSettings)