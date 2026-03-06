function goToPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function parentSignup() {
  const childName = document.getElementById('signupChildName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!childName || !email || !password) {
    showToast('يرجى تعبئة جميع الحقول');
    return;
  }

  const accountData = {
    childName: childName,
    email: email,
    password: password
  };

  localStorage.setItem('maddadAccount', JSON.stringify(accountData));
  localStorage.setItem('maddadCurrentUser', JSON.stringify(accountData));

  document.getElementById('welcomeParentText').textContent = `أهلًا ولي أمر ${childName}`;
  showToast('تم إنشاء الحساب بنجاح');
  goToPage('parentHomePage');
}

function parentLogin() {
  const email = document.getElementById('parentLoginEmail').value.trim();
  const password = document.getElementById('parentLoginPassword').value.trim();

  const savedAccount = JSON.parse(localStorage.getItem('maddadAccount'));

  if (!savedAccount) {
    showToast('لا يوجد حساب محفوظ، أنشئ حساب أولًا');
    return;
  }

  if (email === savedAccount.email && password === savedAccount.password) {
    localStorage.setItem('maddadCurrentUser', JSON.stringify(savedAccount));
    document.getElementById('welcomeParentText').textContent = `أهلًا ولي أمر ${savedAccount.childName}`;
    showToast('تم تسجيل الدخول بنجاح');
    goToPage('parentHomePage');
  } else {
    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
}

function childLogin() {
  const email = document.getElementById('childLoginEmail').value.trim();
  const password = document.getElementById('childLoginPassword').value.trim();

  const savedAccount = JSON.parse(localStorage.getItem('maddadAccount'));

  if (!savedAccount) {
    showToast('لا يوجد حساب محفوظ، يجب إنشاء حساب ولي الأمر أولًا');
    return;
  }

  if (email === savedAccount.email && password === savedAccount.password) {
    localStorage.setItem('maddadCurrentUser', JSON.stringify(savedAccount));
    showToast('تم دخول الطفل بنجاح');
    goToPage('gamesPage');
  } else {
    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
}

function logout() {
  localStorage.removeItem('maddadCurrentUser');
  goToPage('rolePage');
  showToast('تم تسجيل الخروج');
}

window.onload = function () {
  const currentUser = JSON.parse(localStorage.getItem('maddadCurrentUser'));

  if (currentUser) {
    document.getElementById('welcomeParentText').textContent = `أهلًا ولي أمر ${currentUser.childName}`;
  }
};
