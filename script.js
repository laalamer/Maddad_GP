function goParent() {
  window.location.href = "parent.html";
}

function goChild() {
  window.location.href = "child.html";
}

function showSignup() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("signupBox").style.display = "block";
}

function showLogin() {
  document.getElementById("signupBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function parentSignup() {
  const childName = document.getElementById("signupChildName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!childName || !email || !password) {
    alert("فضلاً عبئي جميع الحقول");
    return;
  }

  const account = {
    childName: childName,
    email: email,
    password: password
  };

  localStorage.setItem("maddadAccount", JSON.stringify(account));
  localStorage.setItem("maddadLoggedIn", "true");

  window.location.href = "home.html";
}

function parentLogin() {
  const email = document.getElementById("parentLoginEmail").value.trim();
  const password = document.getElementById("parentLoginPassword").value.trim();

  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (!email || !password) {
    alert("فضلاً أدخلي البريد الإلكتروني وكلمة المرور");
    return;
  }

  if (!savedAccount) {
    alert("لا يوجد حساب محفوظ حالياً. أنشئي حساب أولاً");
    return;
  }

  if (email === savedAccount.email && password === savedAccount.password) {
    localStorage.setItem("maddadLoggedIn", "true");
    window.location.href = "home.html";
  } else {
    alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
}

function childLogin() {
  const email = document.getElementById("childLoginEmail").value.trim();
  const password = document.getElementById("childLoginPassword").value.trim();

  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (!email || !password) {
    alert("فضلاً أدخل البريد الإلكتروني وكلمة المرور");
    return;
  }

  if (!savedAccount) {
    alert("لا يوجد حساب محفوظ حالياً");
    return;
  }

  if (email === savedAccount.email && password === savedAccount.password) {
    alert("تم تسجيل الدخول بنجاح. لاحقًا بنربطها بصفحة الألعاب");
    // لاحقًا:
    // window.location.href = "games.html";
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
}

function loadHomePage() {
  const loggedIn = localStorage.getItem("maddadLoggedIn");
  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (loggedIn !== "true" || !savedAccount) {
    window.location.href = "parent.html";
    return;
  }

  const welcomeMessage = document.getElementById("welcomeMessage");
  const childNameText = document.getElementById("childNameText");
  const emailText = document.getElementById("emailText");

  if (welcomeMessage) {
    welcomeMessage.textContent = "أهلًا ولي أمر " + savedAccount.childName;
  }

  if (childNameText) {
    childNameText.textContent = savedAccount.childName;
  }

  if (emailText) {
    emailText.textContent = savedAccount.email;
  }
}

function logout() {
  localStorage.removeItem("maddadLoggedIn");
  window.location.href = "index.html";
}

function startQuestionnaire() {
  window.location.href = "questionnaire.html";
}

/* =========================
   HELPERS
========================= */

function goBackHome() {
  window.location.href = "home.html";
}

function getAssessment() {
  return JSON.parse(localStorage.getItem("maddadAssessment")) || null;
}

function saveAssessment(data) {
  localStorage.setItem("maddadAssessment", JSON.stringify(data));
}

const skillKeys = [
  "response_to_name",
  "eye_contact",
  "social_smile",
  "imitation",
  "discrimination",
  "pointing_with_finger",
  "facial_expressions",
  "joint_attention",
  "play_skills",
  "response_to_commands"
];

const skillLabelsArabic = {
  response_to_name: "الاستجابة للاسم",
  eye_contact: "التواصل البصري",
  social_smile: "الابتسامة الاجتماعية",
  imitation: "التقليد",
  discrimination: "التمييز",
  pointing_with_finger: "الإشارة بالإصبع",
  facial_expressions: "تعابير الوجه",
  joint_attention: "الانتباه المشترك",
  play_skills: "مهارات اللعب",
  response_to_commands: "تنفيذ الأوامر"
};

function calculateScore(answersObj) {
  let score = 0;
  skillKeys.forEach(key => {
    score += Number(answersObj[key] || 0);
  });
  return score;
}

function classifyRisk(ageGroup, score) {
  if (ageGroup === "12-18") {
    if (score <= 2) return "low";
    if (score >= 3 && score <= 5) return "medium";
    return "high";
  }

  if (ageGroup === "19-24") {
    if (score <= 2) return "low";
    if (score >= 3 && score <= 4) return "medium";
    return "high";
  }

  if (ageGroup === "25-30") {
    if (score <= 1) return "low";
    if (score >= 2 && score <= 4) return "medium";
    return "high";
  }

  if (ageGroup === "31-36") {
    if (score <= 1) return "low";
    if (score >= 2 && score <= 3) return "medium";
    return "high";
  }

  return "low";
}

function riskTextArabic(risk) {
  if (risk === "low") return "منخفضة";
  if (risk === "medium") return "متوسطة";
  return "مرتفعة";
}

function getFailedSkills(answersObj) {
  return skillKeys.filter(key => Number(answersObj[key]) === 1);
}

/* =========================
   QUESTIONNAIRE PAGE
========================= */

const questionnaireSteps = [
  {
    key: "ageGroup",
    title: "كم عمر طفلك؟",
    description: "",
    options: [
      { label: "12 - 18 شهر", value: "12-18" },
      { label: "19 - 24 شهر", value: "19-24" },
      { label: "25 - 30 شهر", value: "25-30" },
      { label: "31 - 36 شهر", value: "31-36" }
    ]
  },
  {
    key: "gender",
    title: "ما جنس الطفل؟",
    description: "",
    options: [
      { label: "ذكر", value: "ذكر" },
      { label: "أنثى", value: "أنثى" }
    ]
  },
  {
    key: "response_to_name",
    title: "الاستجابة للاسم",
    description: "يستجيب طفلك عند مناداته باسمه، يلتفت أو ينظر إليك.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "eye_contact",
    title: "التواصل البصري",
    description: "يتواصل طفلك معك بصريًا / ينظر إليك لمدة 3 - 5 ثوانٍ أثناء لعبك، غنائك، أو تحدثك معه.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "social_smile",
    title: "الابتسامة الاجتماعية",
    description: "عندما يستيقظ طفلك صباحًا، أو عند مقابلة أحد الوالدين أو الأشخاص المألوفين؛ فإنه يبتسم لك / لهم.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "imitation",
    title: "التقليد",
    description: "يحاول طفلك تقليد أفعالك أو أفعال الأشخاص من حوله (مثل: يصلي بجانب شخص آخر، تقليد التحدث بالجوال، استخدام أدوات الطبخ، تقليد حركات الأغاني، أو أي من أدوار وأفعال من حوله).",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "discrimination",
    title: "التمييز",
    description: "يشير طفلك إلى أعضاء جسمه عند سؤاله، يميز أفراد الأسرة بأسمائهم عن طريق التوجه إليهم / النظر إليهم، يميز الأدوات اليومية (مثل: كرسي، ملعقة، ماء، تلفاز، لمبة).",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "pointing_with_finger",
    title: "الإشارة بالإصبع",
    description: "عند رغبة طفلك بالحصول على شيء معروض أمامه، أو عندما يريد لفت الانتباه إلى شيء معين؛ فإنه يشير إليه بإصبعه.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "facial_expressions",
    title: "تعابير الوجه",
    description: "يميز طفلك مشاعر الآخرين (الفرح، الحزن) ويعطي ردة فعل مناسبة لهذه المشاعر حسب الموقف (مثل: يتأثر ببكاء الآخرين، يفرح عند ضحك الآخرين له).",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "joint_attention",
    title: "الانتباه المشترك",
    description: "يحضر طفلك لعبة مهتمًا بها ويُريها للوالدين / الأشخاص المقربين ويطلب منهم المشاركة في اللعب أو ينتظر ردة فعل من الآخرين تجاهه أثناء اللعب.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "play_skills",
    title: "مهارات اللعب",
    description: "يندمج طفلك في أنواع مختلفة من اللعب: اللعب الوظيفي (مثل: دفع السيارة)، اللعب التخيلي (مثل: التظاهر بالتحدث بالهاتف، إطعام الدمية، الشرب من كأس فارغ، الطبخ بألعاب / أدوات المطبخ).",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  },
  {
    key: "response_to_commands",
    title: "تنفيذ الأوامر",
    description: "يتبع طفلك الأوامر اليومية البسيطة (مثل: أعطني، افتح / سكر الباب، نادِ ماما، اجلس، أعطني الريموت، جيب الشنطة).",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا", value: "1" }
    ]
  }
];

let questionnaireState = {
  currentStep: 0,
  answers: {}
};

function loadQuestionnairePage() {
  const loggedIn = localStorage.getItem("maddadLoggedIn");
  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (loggedIn !== "true" || !savedAccount) {
    window.location.href = "parent.html";
    return;
  }

  questionnaireState = {
    currentStep: 0,
    answers: {}
  };

  renderQuestionStep();
}

function renderQuestionStep() {
  const progress = document.getElementById("questionProgress");
  const title = document.getElementById("questionTitle");
  const description = document.getElementById("questionDescription");
  const optionsBox = document.getElementById("questionOptions");
  const nextBtn = document.getElementById("nextQuestionBtn");
  const error = document.getElementById("questionnaireError");

  if (!progress || !title || !description || !optionsBox || !nextBtn) return;

  const step = questionnaireSteps[questionnaireState.currentStep];
  const selectedValue = questionnaireState.answers[step.key] || "";

  progress.textContent = `السؤال: ${questionnaireState.currentStep + 1}/${questionnaireSteps.length}`;
  title.textContent = step.title;
  description.textContent = step.description || "";
  description.style.display = step.description ? "block" : "none";

  optionsBox.innerHTML = "";

  step.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "q-option-btn";

    if (String(selectedValue) === String(option.value)) {
      button.classList.add("selected");
    }

    button.textContent = option.label;
    button.onclick = function () {
      selectQuestionOption(option.value);
    };

    optionsBox.appendChild(button);
  });

  if (questionnaireState.currentStep === questionnaireSteps.length - 1) {
    nextBtn.textContent = "عرض النتيجة";
  } else {
    nextBtn.textContent = "التالي";
  }

  if (error) error.textContent = "";
}

function selectQuestionOption(value) {
  const step = questionnaireSteps[questionnaireState.currentStep];
  questionnaireState.answers[step.key] = value;
  renderQuestionStep();
}

function nextQuestionStep() {
  const error = document.getElementById("questionnaireError");
  const step = questionnaireSteps[questionnaireState.currentStep];
  const answer = questionnaireState.answers[step.key];

  if (answer === undefined || answer === null || answer === "") {
    if (error) error.textContent = "يرجى اختيار إجابة قبل المتابعة.";
    return;
  }

  if (questionnaireState.currentStep < questionnaireSteps.length - 1) {
    questionnaireState.currentStep += 1;
    renderQuestionStep();
  } else {
    finalizeQuestionnaire();
  }
}

function handleQuestionnaireBack() {
  if (questionnaireState.currentStep > 0) {
    questionnaireState.currentStep -= 1;
    renderQuestionStep();
  } else {
    window.location.href = "home.html";
  }
}

function finalizeQuestionnaire() {
  const ageGroup = questionnaireState.answers.ageGroup;
  const gender = questionnaireState.answers.gender;

  if (!ageGroup || !gender) {
    const error = document.getElementById("questionnaireError");
    if (error) error.textContent = "يرجى استكمال الإجابات أولًا.";
    return;
  }

  const answers = {};

  for (let key of skillKeys) {
    answers[key] = Number(questionnaireState.answers[key]);
  }

  const score = calculateScore(answers);
  const initialRisk = classifyRisk(ageGroup, score);
  const failedSkills = getFailedSkills(answers);

  const assessment = {
    ageGroup: ageGroup,
    gender: gender,
    initialAnswers: answers,
    currentAnswers: { ...answers },
    initialScore: score,
    initialRisk: initialRisk,
    failedSkills: failedSkills,
    followupNeeded: (initialRisk === "medium" || initialRisk === "high"),
    followupComplete: false,
    finalScore: score,
    finalRisk: initialRisk
  };

  saveAssessment(assessment);
  window.location.href = "result.html";
}
/* =========================
   RESULT PAGE
========================= */

function loadResultPage() {
  const assessment = getAssessment();
  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  const resultBadge = document.getElementById("resultBadge");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const resultSummary = document.getElementById("resultSummary");
  const resultMainBtn = document.getElementById("resultMainBtn");

  let shownRisk = assessment.initialRisk;
  let shownScore = assessment.initialScore;
  let message = "";
  let btnText = "";

  if (assessment.followupComplete) {
    shownRisk = assessment.finalRisk;
    shownScore = assessment.finalScore;
  }

  if (shownRisk === "low") {
    resultBadge.style.background = "#E8F6EE";
    resultBadge.style.color = "#2E7D32";
    resultTitle.textContent = "النتيجة: خطورة منخفضة";
    message = "تشير النتيجة الحالية إلى أن طفلك يُظهر مؤشرات مطمئنة، مع الاستمرار في المتابعة الدورية.";
    btnText = "العودة للرئيسية";
  } else if (shownRisk === "medium") {
    resultBadge.style.background = "#FFF5DB";
    resultBadge.style.color = "#9C6B00";
    resultTitle.textContent = "النتيجة: خطورة متوسطة";
    message = assessment.followupComplete
      ? "بعد أسئلة المتابعة، ما زالت هناك بعض المؤشرات التي تحتاج متابعة واهتمام."
      : "ظهرت بعض المؤشرات التي تحتاج إلى توضيح إضافي عبر أسئلة المتابعة.";
    btnText = assessment.followupComplete ? "العودة للرئيسية" : "الانتقال لأسئلة المتابعة";
  } else {
    resultBadge.style.background = "#FDECEC";
    resultBadge.style.color = "#C62828";
    resultTitle.textContent = "النتيجة: خطورة مرتفعة";
    message = assessment.followupComplete
      ? "بعد أسئلة المتابعة، ما زالت هناك مؤشرات مرتفعة تستحق متابعة متخصصة."
      : "ظهرت مؤشرات مرتفعة وتحتاج إلى أسئلة متابعة لإعطاء صورة أدق.";
    btnText = assessment.followupComplete ? "العودة للرئيسية" : "الانتقال لأسئلة المتابعة";
  }

  resultText.textContent = message;

  resultSummary.innerHTML = `
    <strong>عمر الطفل:</strong> ${assessment.ageGroup} شهر تقريبًا<br>
    <strong>مجموع الإجابات (لا):</strong> ${shownScore}<br>
    <strong>مستوى الخطورة:</strong> ${riskTextArabic(shownRisk)}
  `;

  resultMainBtn.textContent = btnText;
}

function handleResultMainAction() {
  const assessment = getAssessment();
  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  if (!assessment.followupComplete && (assessment.initialRisk === "medium" || assessment.initialRisk === "high")) {
    window.location.href = "followup.html";
  } else {
    window.location.href = "home.html";
  }
}

/* =========================
   FOLLOWUP PAGE
========================= */

function loadFollowupPage() {
  const assessment = getAssessment();
  const container = document.getElementById("followupContainer");

  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  if (assessment.initialRisk === "low") {
    window.location.href = "result.html";
    return;
  }

  const failed = assessment.failedSkills || [];
  let html = "";

  if (failed.includes("eye_contact")) {
    html += `
      <div class="followup-section">
        <h3>متابعة: التواصل البصري</h3>
        <div class="followup-main-question">هل طفلك يناظر عينك؟</div>

        <div class="checkbox-list">
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="needs"> لما يحتاج شيء</label>
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="play"> لما يلعب معك</label>
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="eating"> أثناء الأكل</label>
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="dressing"> أثناء اللبس</label>
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="story"> عندما تقرأ له قصة</label>
          <label class="checkbox-item"><input type="checkbox" name="eye_contact_context" value="talking"> عندما تتحدث معه</label>
        </div>

        <div class="subquestion-box">
          <div class="subquestion-title">إذا تم اختيار خيار واحد فقط: لما أنت وطفلك سوا خلال اليوم، هل ينظر إلى عينك على الأقل 5 ثوانٍ؟</div>
          <div class="sub-yesno">
            <label><input type="radio" name="eye_contact_sub" value="yes"> نعم</label>
            <label><input type="radio" name="eye_contact_sub" value="no"> لا</label>
          </div>
        </div>
      </div>
    `;
  }

  if (failed.includes("response_to_name")) {
    html += `
      <div class="followup-section">
        <h3>متابعة: الاستجابة للاسم</h3>
        <div class="followup-main-question">
          هل طفلك يستجيب لاسمه في مواقف أخرى حتى لو لم يكن الأمر ثابتًا؟ على سبيل المثال، قد يستجيب في الحديقة أو عند الحماس، لكنه لا يستجيب عند مشاهدة التلفاز أو عند تركيزه الشديد على نشاط ما.
        </div>

        <div class="sub-yesno">
          <label><input type="radio" name="response_to_name_followup" value="yes"> نعم</label>
          <label><input type="radio" name="response_to_name_followup" value="no"> لا</label>
        </div>
      </div>
    `;
  }

  if (failed.includes("pointing_with_finger")) {
    html += `
      <div class="followup-section">
        <h3>متابعة: الإشارة بالإصبع</h3>
        <div class="followup-main-question">اختاري ما ينطبق على طفلك:</div>

        <div class="checkbox-list">
          <label class="checkbox-item"><input type="checkbox" name="pointing_context" value="hand"> هل طفلك يمد يده للأشياء؟</label>
          <label class="checkbox-item"><input type="checkbox" name="pointing_context" value="lead"> هل يقودك بيده نحو الشيء؟</label>
          <label class="checkbox-item"><input type="checkbox" name="pointing_context" value="take"> هل يحاول أخذ الشيء بنفسه؟</label>
          <label class="checkbox-item"><input type="checkbox" name="pointing_context" value="voice"> هل يطلب الشيء باستخدام كلمات أو أصوات؟</label>
        </div>

        <div class="subquestion-box">
          <div class="subquestion-title">إذا تم اختيار خيار واحد فقط: إذا قلت له "وريني"، هل سيشير طفلك إلى الشيء؟</div>
          <div class="sub-yesno">
            <label><input type="radio" name="pointing_sub" value="yes"> نعم</label>
            <label><input type="radio" name="pointing_sub" value="no"> لا</label>
          </div>
        </div>
      </div>
    `;
  }

  if (html === "") {
    html = `
      <div class="followup-section">
        <h3>لا توجد أسئلة متابعة مدعومة حاليًا</h3>
        <div class="followup-main-question">
          المهارات التي تحتاج متابعة إضافية سيتم دعمها في الخطوة القادمة.
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function submitFollowup(event) {
  event.preventDefault();

  const assessment = getAssessment();
  const error = document.getElementById("followupError");
  if (error) error.textContent = "";

  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  const updatedAnswers = { ...assessment.currentAnswers };

  if (assessment.failedSkills.includes("eye_contact")) {
    const eyeChecks = document.querySelectorAll('input[name="eye_contact_context"]:checked');
    const eyeCount = eyeChecks.length;

    if (eyeCount === 0) {
      updatedAnswers.eye_contact = 1;
    } else if (eyeCount >= 2) {
      updatedAnswers.eye_contact = 0;
    } else if (eyeCount === 1) {
      const eyeSub = document.querySelector('input[name="eye_contact_sub"]:checked');
      if (!eyeSub) {
        if (error) error.textContent = "يرجى استكمال سؤال المتابعة الخاص بالتواصل البصري.";
        return;
      }
      updatedAnswers.eye_contact = eyeSub.value === "yes" ? 0 : 1;
    }
  }

  if (assessment.failedSkills.includes("response_to_name")) {
    const nameFollow = document.querySelector('input[name="response_to_name_followup"]:checked');
    if (!nameFollow) {
      if (error) error.textContent = "يرجى الإجابة على سؤال متابعة الاستجابة للاسم.";
      return;
    }
    updatedAnswers.response_to_name = nameFollow.value === "yes" ? 0 : 1;
  }

  if (assessment.failedSkills.includes("pointing_with_finger")) {
    const pointChecks = document.querySelectorAll('input[name="pointing_context"]:checked');
    const pointCount = pointChecks.length;

    if (pointCount === 0) {
      updatedAnswers.pointing_with_finger = 1;
    } else if (pointCount >= 2) {
      updatedAnswers.pointing_with_finger = 0;
    } else if (pointCount === 1) {
      const pointSub = document.querySelector('input[name="pointing_sub"]:checked');
      if (!pointSub) {
        if (error) error.textContent = "يرجى استكمال سؤال المتابعة الخاص بالإشارة بالإصبع.";
        return;
      }
      updatedAnswers.pointing_with_finger = pointSub.value === "yes" ? 0 : 1;
    }
  }

  const finalScore = calculateScore(updatedAnswers);
  const finalRisk = classifyRisk(assessment.ageGroup, finalScore);

  assessment.currentAnswers = updatedAnswers;
  assessment.finalScore = finalScore;
  assessment.finalRisk = finalRisk;
  assessment.followupComplete = true;

  saveAssessment(assessment);
  window.location.href = "result.html";
}
