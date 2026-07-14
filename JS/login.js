const subLabels = {
  panelLogin:      'تسجيل الدخول إلى حسابك',
  panelRegister:   'إنشاء حسابك',
  panelOtp:        'التحقق من حسابك',
  panelForgot:     'إعادة تعيين كلمة المرور',
  panelForgotOtp:  'أدخل رمز التحقق',
  panelNewPw:      'تعيين كلمة مرور جديدة',
  panelSuccess:    '',
};
// ================= EMAIL VERIFY =================
window.onload = function () {
    window.location.href = "HTML/sellingInvoice.html";
};

let userEmailOtp = null;
let userEmailOtpHash = null;

// ================= ADMIN VERIFY =================

let adminOtp = null;
let adminOtpHash = null;

// ================= STEP =================

let currentVerifyStep = "user";
function show(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('logoSub').textContent = subLabels[id] || '';
}

function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.className = 'toast', 2800);
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function setErr(fieldId, msg) {
  const f = document.getElementById('f-' + fieldId);
  if (!f) return;
  f.classList.add('has-err');
  const inp = f.querySelector('input');
  if (inp) inp.classList.add('err');
  if (msg) { const em = f.querySelector('.err-msg'); if (em) em.textContent = msg; }
}
function clearErr(fieldId) {
  const f = document.getElementById('f-' + fieldId);
  if (!f) return;
  f.classList.remove('has-err');
  const inp = f.querySelector('input');
  if (inp) inp.classList.remove('err');
}
function val(id) { return (document.getElementById(id)?.value || '').trim(); }

// ================= LOGIN =================

async function doLogin() {

  let ok = true;

  ['lu', 'lp'].forEach(id => {

    clearErr(id);

    if (!val(id)) {
      setErr(id);
      ok = false;
    }

  });

  if (!ok) return;

  const loginBtn = document.querySelector("#panelLogin .btn-primary");

  try {

    loginBtn.disabled = true;
    loginBtn.textContent = "جارٍ تسجيل الدخول...";

    toast("جارٍ تسجيل الدخول...");

    // ================= API REQUEST =================

    const response = await fetch(
      "http://100.80.3.109:8000/api/generalinfo/login/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username: val("lu"),
          password: val("lp")
        })
      }
    );

    const data = await response.json();

    console.log(data);

    // ================= SUCCESS =================

    if (data.token) {

      // token
      localStorage.setItem(
        "authToken",
        data.token
      );

      // username
      localStorage.setItem(
        "username",
        data.user.username
      );

      // full name
      localStorage.setItem(
        "fullName",
        data.user?.employee_details?.full_name ||
        data.user?.username ||
        ""
      );

      // role
      localStorage.setItem(
        "userRole",
        (data.user?.user_role || "").toLowerCase()
      );

      // employee id
      localStorage.setItem(
        "employeeId",
        data.user?.employee || ""
      );

      // pharmacy / branch
      localStorage.setItem(
        "branchId",
        data.user?.pharmacy || ""
      );

      localStorage.setItem(
        "branchName",
        data.user?.branch_name || ""
      );

      toast("تم تسجيل الدخول بنجاح!", "success");

      setTimeout(() => {

        window.location.href =
          "HTML/pharmacyInfo.html";

      }, 1000);

    }

    // ================= FAILED =================

    else {

      toast(
        "اسم المستخدم أو كلمة المرور غير صحيحة"
      );

      setErr("lu");
      setErr("lp");

    }

  }

  catch (error) {

    console.log(error);

    toast("حدث خطأ في الاتصال بالسيرفر");

  }

  finally {

    loginBtn.disabled = false;
    loginBtn.textContent = "تسجيل الدخول";

  }

}



function sendForgotCode() {
  clearErr('fp');
  const ph = val('fp');
  if (!ph || !/^\+?\d{7,15}$/.test(ph.replace(/\s/g,''))) {
    setErr('fp', 'رقم هاتف صحيح مطلوب'); return;
  }
  document.getElementById('forgotOtpTarget').textContent = ph;
  show('panelForgotOtp');
  resetOtpInputs('forgotOtpRow');
  toast('تم إرسال رمز التحقق!', 'success');
}

function resetOtpInputs(rowId) {
  const inputs = [...document.getElementById(rowId).querySelectorAll('.otp-input')];
  inputs.forEach((inp, i) => {
    inp.value = '';
    inp.oninput = function () {
      const v = this.value.replace(/\D/g,'');
      this.value = v ? v[0] : '';
      if (v && i < inputs.length - 1) inputs[i+1].focus();
    };
    inp.onkeydown = function (e) {
      if (e.key === 'Backspace' && !this.value && i > 0) inputs[i-1].focus();
    };
    inp.onpaste = function(e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
      [...pasted].slice(0, inputs.length - i).forEach((ch, j) => { inputs[i+j].value = ch; });
      const next = Math.min(i + pasted.length, inputs.length - 1);
      inputs[next].focus();
    };
  });
  setTimeout(() => inputs[0].focus(), 80);
}

function getOtp(rowId) {
  return [...document.getElementById(rowId).querySelectorAll('.otp-input')].map(i=>i.value).join('');
}


function resendOtp() { toast('تم إرسال رمز جديد!', 'success'); }
function resendForgotOtp() { toast('تم إرسال رمز جديد!', 'success'); }

function setNewPassword() {
  let ok = true;
  clearErr('np'); clearErr('npc');
  if (!val('np')) { setErr('np', 'كلمة المرور مطلوبة'); ok = false; }
  if (!val('npc') || val('npc') !== val('np')) { setErr('npc', 'كلمتا المرور غير متطابقتين'); ok = false; }
  if (!ok) return;
  toast('جارٍ تحديث كلمة المرور…');
  setTimeout(() => {
    show('panelSuccess');
    document.getElementById('successTitle').textContent = 'تم إعادة تعيين كلمة المرور!';
    document.getElementById('successMsg').textContent = 'تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.';
    toast('تم إعادة تعيين كلمة المرور بنجاح!', 'success');
  }, 900);
}






// ================= CONFIG =================

const API_BASE = "http://100.80.3.109:8000/api/generalinfo";

const EMAILJS_SERVICE_ID = "service_m605ki5";
const EMAILJS_TEMPLATE_ID = "template_7bk073b";

// ================= REGISTER DATA =================

let pendingRegisterData = null;
let generatedOtpHash = null;
let generatedOtp = null;
let otpExpireAt = null;

// ================= HELPERS =================

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpExpireTime() {
  const d = new Date(Date.now() + 15 * 60 * 1000);

  return d.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ================= REGISTER =================

async function doRegister() {

  let ok = true;

  const checks = {

    rn: [
      val("rn"),
      "الاسم مطلوب"
    ],

    rph: [
      val("rph"),
      "اسم الصيدلية مطلوب"
    ],

    rphone: [
      val("rphone") &&
      /^01[0-2,5]{1}[0-9]{8}$/.test(val("rphone")),
      "رقم هاتف صحيح مطلوب"
    ],

    remail: [
      val("remail") &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("remail")),
      "بريد إلكتروني صحيح مطلوب"
    ],

    ru: [
      val("ru"),
      "اسم المستخدم مطلوب"
    ],

    rp: [
      val("rp"),
      "كلمة المرور مطلوبة"
    ],

    rpc: [
      val("rpc") &&
      val("rpc") === val("rp"),
      "كلمتا المرور غير متطابقتين"
    ],
  };

  Object.entries(checks).forEach(([k, [valid, msg]]) => {

    clearErr(k);

    if (!valid) {
      setErr(k, msg);
      ok = false;
    }

  });

  if (!ok) return;

  try {

    toast("جارٍ إرسال كود التحقق...");

    // ================= SAVE DATA =================

    pendingRegisterData = {

      full_name: val("rn"),

      email: val("remail"),

      phone: val("rphone"),

      pharmacy_name_ar: val("rph"),

      username: val("ru"),

      password: val("rp"),

      password_confirm: val("rpc"),
    };

    // ================= USER OTP =================

    userEmailOtp = generateOtp();

    userEmailOtpHash =
      await sha256(userEmailOtp);

    otpExpireAt =
      Date.now() + (15 * 60 * 1000);

    // ================= SEND TO USER EMAIL =================

// ================= SEND TO USER EMAIL =================

await emailjs.send(

  EMAILJS_SERVICE_ID,

  "template_kc92cdd",

  {

    passcode: userEmailOtp,

    time: getOtpExpireTime(),

    email: val("remail"),

  }

);

    currentVerifyStep = "user";

    document.getElementById("otpTarget")
      .textContent = val("remail");

    show("panelOtp");

    resetOtpInputs("otpRow");

    toast(
      "تم إرسال كود التحقق إلى بريد المستخدم",
      "success"
    );

  }

  catch (error) {

    console.log(error);

    toast("فشل إرسال كود التحقق");

  }

}

// ================= VERIFY OTP =================

async function verifyOtp() {

  const code = getOtp("otpRow");

  if (code.length < 6) {

    toast(
      "الرجاء إدخال الرمز المكوّن من 6 أرقام"
    );

    return;
  }

  try {

    // ================= USER VERIFY =================

    if (currentVerifyStep === "user") {

      const enteredHash =
        await sha256(code);

      if (
        enteredHash !== userEmailOtpHash
      ) {

        toast("كود التحقق غير صحيح");

        return;
      }

      // ================= SEND ADMIN OTP =================

      adminOtp = generateOtp();

      adminOtpHash =
        await sha256(adminOtp);

      await emailjs.send(

        EMAILJS_SERVICE_ID,

        EMAILJS_TEMPLATE_ID,

        {

          passcode: adminOtp,

          time: getOtpExpireTime(),

          customer: val("rn"),

          pharmacy: val("rph"),

          email: "mohamedyahiad8@gmail.com",

        }

      );

      currentVerifyStep = "admin";

      resetOtpInputs("otpRow");

      document.getElementById("otpTarget")
        .textContent = "إدارة Pharma Go";

      toast(
        "تم تأكيد الإيميل وإرسال كود تفعيل الصيدلية للإدارة",
        "success"
      );

      return;
    }

    // ================= ADMIN VERIFY =================

    if (currentVerifyStep === "admin") {

      const enteredHash =
        await sha256(code);

      if (
        enteredHash !== adminOtpHash
      ) {

        toast("كود الإدارة غير صحيح");

        return;
      }

      // ================= CREATE ACCOUNT =================

      const response = await fetch(
        "http://100.80.3.109:8000/api/generalinfo/signup/",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            pendingRegisterData
          )

        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {

        toast("فشل إنشاء الحساب");

        return;
      }

      // ================= SUCCESS =================

      show("panelSuccess");

      document.getElementById(
        "successTitle"
      ).textContent =
        "تم إنشاء الحساب!";

      document.getElementById(
        "successMsg"
      ).textContent =
        "تم تفعيل الصيدلية وإنشاء الحساب بنجاح.";

      toast(
        "تم إنشاء الحساب بنجاح",
        "success"
      );

    }

  }

  catch (error) {

    console.log(error);

    toast("حدث خطأ أثناء التحقق");

  }

}

// ================= RESEND OTP =================

async function resendOtp() {

  try {

    generatedOtp = generateOtp();

    generatedOtpHash = await sha256(generatedOtp);

    otpExpireAt = Date.now() + (15 * 60 * 1000);

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        passcode: generatedOtp,
        time: getOtpExpireTime(),
        email: pendingRegisterData.email,
      }
    );

    toast("تم إرسال رمز جديد!", "success");

  } catch (error) {

    console.error(error);

    toast("فشل إعادة إرسال الرمز");

  }

}