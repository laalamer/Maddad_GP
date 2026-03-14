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
  const childName     = document.getElementById("signupChildName").value.trim();
  const childAgeGroup = document.getElementById("signupAgeGroup").value;
  const childGender   = document.getElementById("signupGender").value;
  const email         = document.getElementById("signupEmail").value.trim();
  const password      = document.getElementById("signupPassword").value.trim();

  if (!childName || !childAgeGroup || !childGender || !email || !password) {
    alert("فضلاً عبئي جميع الحقول");
    return;
  }

  const account = {
    childName,
    childAgeGroup,
    childGender,
    email,
    password
  };

  localStorage.setItem("maddadAccount", JSON.stringify(account));
  localStorage.setItem("maddadLoggedIn", "true");

  window.location.href = "home.html";
}

function parentLogin() {
  const email    = document.getElementById("parentLoginEmail").value.trim();
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
  const email    = document.getElementById("childLoginEmail").value.trim();
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
    window.location.href = "games.html";
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
}

function loadHomePage() {
  const loggedIn     = localStorage.getItem("maddadLoggedIn");
  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (loggedIn !== "true" || !savedAccount) {
    window.location.href = "parent.html";
    return;
  }

  const welcomeMessage = document.getElementById("welcomeMessage");
  const childNameText  = document.getElementById("childNameText");
  const emailText      = document.getElementById("emailText");

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
  response_to_name:    "الاستجابة للاسم",
  eye_contact:         "التواصل البصري",
  social_smile:        "الابتسامة الاجتماعية",
  imitation:           "التقليد",
  discrimination:      "التمييز",
  pointing_with_finger:"الإشارة بالإصبع",
  facial_expressions:  "تعابير الوجه",
  joint_attention:     "الانتباه المشترك",
  play_skills:         "مهارات اللعب",
  response_to_commands:"تنفيذ الأوامر"
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
  if (risk === "low")    return "منخفضة";
  if (risk === "medium") return "متوسطة";
  return "مرتفعة";
}

function getFailedSkills(answersObj) {
  return skillKeys.filter(key => Number(answersObj[key]) === 1);
}

/* =========================
   QUESTIONNAIRE PAGE
========================= */

/* 
  تم حذف سؤالَي العمر والجنس من هنا.
  يتم أخذهما من بيانات الحساب المُسجَّل في parentSignup().
*/
const questionnaireSteps = [
  {
    key: "response_to_name",
    title: "الاستجابة للاسم",
    description: "يستجيب طفلك عند مناداته باسمه، يلتفت أو ينظر إليك.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "eye_contact",
    title: "التواصل البصري",
    description: "يتواصل طفلك معك بصريًا / ينظر إليك لمدة 3 - 5 ثوانٍ أثناء لعبك، غنائك، أو تحدثك معه.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "social_smile",
    title: "الابتسامة الاجتماعية",
    description: "عندما يستيقظ طفلك صباحًا، أو عند مقابلة أحد الوالدين أو الأشخاص المألوفين؛ فإنه يبتسم لك / لهم.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "imitation",
    title: "التقليد",
    description: "يحاول طفلك تقليد أفعالك أو أفعال الأشخاص من حوله.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "discrimination",
    title: "التمييز",
    description: "يشير طفلك إلى أعضاء جسمه عند سؤاله ويميز الأدوات اليومية والأشخاص.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "pointing_with_finger",
    title: "الإشارة بالإصبع",
    description: "عند رغبة طفلك بالحصول على شيء أو لفت الانتباه؛ فإنه يشير إليه بإصبعه.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "facial_expressions",
    title: "تعابير الوجه",
    description: "يميز طفلك مشاعر الآخرين ويعطي ردة فعل مناسبة حسب الموقف.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "joint_attention",
    title: "الانتباه المشترك",
    description: "يحضر طفلك لعبة مهتمًا بها ويُريها للآخرين وينتظر تفاعلهم.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "play_skills",
    title: "مهارات اللعب",
    description: "يندمج طفلك في اللعب الوظيفي أو التخيلي.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  },
  {
    key: "response_to_commands",
    title: "تنفيذ الأوامر",
    description: "يتبع طفلك الأوامر اليومية البسيطة.",
    options: [
      { label: "نعم", value: "0" },
      { label: "لا",  value: "1" }
    ]
  }
];

let currentQuestionIndex = 0;
let questionnaireAnswers  = {};

function loadQuestionnairePage() {
  const loggedIn     = localStorage.getItem("maddadLoggedIn");
  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));

  if (loggedIn !== "true" || !savedAccount) {
    window.location.href = "parent.html";
    return;
  }

  const savedProgress = JSON.parse(localStorage.getItem("maddadQuestionnaireProgress"));
  if (savedProgress) {
    currentQuestionIndex = savedProgress.currentQuestionIndex || 0;
    questionnaireAnswers = savedProgress.answers || {};
  } else {
    currentQuestionIndex = 0;
    questionnaireAnswers = {};
  }

  renderQuestionStep();
}

function startQuestionnaire() {
  localStorage.removeItem("maddadQuestionnaireProgress");
  localStorage.removeItem("maddadAssessment");
  window.location.href = "questionnaire.html";
}

function resetQuestionnaireAndGoHome() {
  localStorage.removeItem("maddadQuestionnaireProgress");
  localStorage.removeItem("maddadAssessment");
  currentQuestionIndex = 0;
  questionnaireAnswers = {};
  window.location.href = "home.html";
}

function renderQuestionStep() {
  const step = questionnaireSteps[currentQuestionIndex];
  if (!step) return;

  const progress    = document.getElementById("questionProgress");
  const title       = document.getElementById("questionTitle");
  const description = document.getElementById("questionDescription");
  const optionsBox  = document.getElementById("questionOptions");
  const error       = document.getElementById("questionnaireError");
  const navWrap     = document.getElementById("questionNav");

  if (error) error.textContent = "";

  progress.textContent    = `السؤال: ${currentQuestionIndex + 1}/${questionnaireSteps.length}`;
  title.textContent       = step.title;
  description.textContent = step.description || "";

  optionsBox.innerHTML = "";

  step.options.forEach(option => {
    const btn     = document.createElement("button");
    btn.type      = "button";
    btn.className = "questionnaire-option";

    if (questionnaireAnswers[step.key] === option.value) {
      btn.classList.add("selected");
    }

    btn.textContent = option.label;
    btn.onclick     = () => selectQuestionOption(step.key, option.value);

    optionsBox.appendChild(btn);
  });

  // بناء أزرار التنقل بنفس طريقة صفحة المتابعة
  const isFirst = currentQuestionIndex === 0;
  const isLast  = currentQuestionIndex === questionnaireSteps.length - 1;

  navWrap.innerHTML = `
    <button type="button" class="questionnaire-next-btn" onclick="goNextQuestion()">${isLast ? "إرسال" : "التالي"}</button>
    ${!isFirst ? `<button type="button" class="questionnaire-next-btn prev-btn" onclick="goPrevQuestion()">السابق</button>` : ""}
  `;

  localStorage.setItem("maddadQuestionnaireProgress", JSON.stringify({
    currentQuestionIndex,
    answers: questionnaireAnswers
  }));
}

function selectQuestionOption(key, value) {
  questionnaireAnswers[key] = value;
  renderQuestionStep();
}

function goNextQuestion() {
  const step  = questionnaireSteps[currentQuestionIndex];
  const error = document.getElementById("questionnaireError");

  if (!questionnaireAnswers[step.key]) {
    if (error) error.textContent = "يرجى اختيار إجابة قبل المتابعة.";
    return;
  }

  if (currentQuestionIndex < questionnaireSteps.length - 1) {
    currentQuestionIndex++;
    renderQuestionStep();
  } else {
    finishQuestionnaire();
  }
}

function goPrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestionStep();
  }
}

function finishQuestionnaire() {
  const answers = {
    response_to_name:     Number(questionnaireAnswers.response_to_name),
    eye_contact:          Number(questionnaireAnswers.eye_contact),
    social_smile:         Number(questionnaireAnswers.social_smile),
    imitation:            Number(questionnaireAnswers.imitation),
    discrimination:       Number(questionnaireAnswers.discrimination),
    pointing_with_finger: Number(questionnaireAnswers.pointing_with_finger),
    facial_expressions:   Number(questionnaireAnswers.facial_expressions),
    joint_attention:      Number(questionnaireAnswers.joint_attention),
    play_skills:          Number(questionnaireAnswers.play_skills),
    response_to_commands: Number(questionnaireAnswers.response_to_commands)
  };

  const score        = calculateScore(answers);

  // نقرأ العمر والجنس من بيانات الحساب المحفوظة عند التسجيل
  const savedAccount = JSON.parse(localStorage.getItem("maddadAccount"));
  const childAgeGroup= savedAccount?.childAgeGroup || "25-30";
  const childGender  = savedAccount?.childGender   || "";

  const initialRisk  = classifyRisk(childAgeGroup, score);

  let failedSkills = getFailedSkills(answers);
  // الاستجابة للاسم تظهر دائماً في أسئلة المتابعة
  if (!failedSkills.includes("response_to_name")) {
    failedSkills.push("response_to_name");
  }

  const assessment = {
    ageGroup:        childAgeGroup,
    gender:          childGender,
    initialAnswers:  answers,
    currentAnswers:  { ...answers },
    initialScore:    score,
    initialRisk:     initialRisk,
    failedSkills:    failedSkills,
    followupNeeded:  (initialRisk === "medium" || initialRisk === "high"),
    followupComplete: false,
    finalScore:      score,
    finalRisk:       initialRisk
  };

  saveAssessment(assessment);
  localStorage.removeItem("maddadQuestionnaireProgress");
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

  const resultBadge   = document.getElementById("resultBadge");
  const resultTitle   = document.getElementById("resultTitle");
  const resultText    = document.getElementById("resultText");
  const resultSummary = document.getElementById("resultSummary");
  const resultMainBtn = document.getElementById("resultMainBtn");

  let shownRisk  = assessment.initialRisk;
  let shownScore = assessment.initialScore;
  let message    = "";
  let btnText    = "";

  if (assessment.followupComplete) {
    shownRisk  = assessment.finalRisk;
    shownScore = assessment.finalScore;
  }

  if (shownRisk === "low") {
    resultBadge.style.background = "#E8F6EE";
    resultBadge.style.color      = "#2E7D32";
    resultTitle.textContent      = "النتيجة: خطورة منخفضة";
    message  = "تشير النتيجة الحالية إلى أن طفلك يُظهر مؤشرات مطمئنة، مع الاستمرار في المتابعة الدورية.";
    btnText  = "العودة للرئيسية";
  } else if (shownRisk === "medium") {
    resultBadge.style.background = "#FFF5DB";
    resultBadge.style.color      = "#9C6B00";
    resultTitle.textContent      = "النتيجة: خطورة متوسطة";
    message  = assessment.followupComplete
      ? "بعد أسئلة المتابعة، ما زالت هناك بعض المؤشرات التي تحتاج متابعة واهتمام."
      : "ظهرت بعض المؤشرات التي تحتاج إلى توضيح إضافي عبر أسئلة المتابعة.";
    btnText  = assessment.followupComplete ? "الأنشطة المقترحة" : "الانتقال لأسئلة المتابعة";
  } else {
    resultBadge.style.background = "#FDECEC";
    resultBadge.style.color      = "#C62828";
    resultTitle.textContent      = "النتيجة: خطورة مرتفعة";
    message  = assessment.followupComplete
      ? "بعد أسئلة المتابعة، ما زالت هناك مؤشرات مرتفعة تستحق متابعة متخصصة."
      : "ظهرت مؤشرات مرتفعة وتحتاج إلى أسئلة متابعة لإعطاء صورة أدق.";
    btnText  = assessment.followupComplete ? "الأنشطة المقترحة" : "الانتقال لأسئلة المتابعة";
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
    window.location.href = "games.html";
  }
}

/* =========================
   FOLLOWUP PAGE
========================= */

let followupSteps            = [];
let currentFollowupIndex     = 0;
let followupCollectedAnswers = {};

function loadFollowupPage() {
  const assessment = getAssessment();

  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  if (assessment.initialRisk === "low") {
    window.location.href = "result.html";
    return;
  }

  const failed = assessment.failedSkills || [];
  followupSteps            = [];
  followupCollectedAnswers = {};
  followupBtnState         = {};
  currentFollowupIndex     = 0;

  if (failed.includes("eye_contact"))          followupSteps.push("eye_contact");
  if (failed.includes("response_to_name"))     followupSteps.push("response_to_name");
  if (failed.includes("pointing_with_finger")) followupSteps.push("pointing_with_finger");
  if (failed.includes("imitation"))            followupSteps.push("imitation");
  if (failed.includes("discrimination"))       followupSteps.push("discrimination");

  if (followupSteps.length === 0) {
    document.getElementById("followupContainer").innerHTML = `
      <div class="question-progress">لا توجد أسئلة متابعة مدعومة حالياً</div>
      <div class="question-description" style="text-align:center; margin-top: 16px;">
        المهارات التي تحتاج متابعة إضافية سيتم دعمها في الخطوة القادمة.
      </div>
    `;
    return;
  }

  renderFollowupStep();
}

/* followup button state: { fieldName: Set([values]) or string for radio } */
let followupBtnState = {};

const FOLLOWUP_STEPS_CONFIG = {
  eye_contact: {
    title: "متابعة: التواصل البصري",
    question: "هل طفلك يناظر عينك؟",
    type: "checkbox",
    name: "eye_contact_context",
    options: [
      { label: "لما يحتاج شيء",        value: "needs"    },
      { label: "لما يلعب معك",          value: "play"     },
      { label: "أثناء الأكل",           value: "eating"   },
      { label: "أثناء اللبس",           value: "dressing" },
      { label: "عندما تقرأ له قصة",     value: "story"    },
      { label: "عندما تتحدث معه",       value: "talking"  }
    ],
    subQuestion: {
      id:    "eyeSubBox",
      title: "لما أنت وطفلك سوا خلال اليوم، هل ينظر إلى عينك على الأقل 5 ثوانٍ؟",
      name:  "eye_contact_sub"
    }
  },
  response_to_name: {
    title:    "متابعة: الاستجابة للاسم",
    question: "هل طفلك يستجيب لاسمه في مواقف أخرى حتى لو لم يكن الأمر ثابتًا؟ (مثال: قد يستجيب في الحديقة أو عند الحماس لكنه لا يستجيب أثناء مشاهدة التلفاز أو عندما يكون مركزًا على نشاط).",
    type:     "radio",
    name:     "response_to_name_followup",
    options: [
      { label: "نعم", value: "yes" },
      { label: "لا",  value: "no"  }
    ]
  },
  pointing_with_finger: {
    title:    "متابعة: الإشارة بالإصبع",
    question: "اختاري ما ينطبق على طفلك:",
    type:     "checkbox",
    name:     "pointing_context",
    options: [
      { label: "هل طفلك يمد يده للأشياء؟",                       value: "hand"  },
      { label: "هل يقودك بيده نحو الشيء؟",                       value: "lead"  },
      { label: "هل يحاول أخذ الشيء بنفسه؟",                      value: "take"  },
      { label: "هل يطلب الشيء باستخدام كلمات أو أصوات؟",         value: "voice" }
    ],
    subQuestion: {
      id:    "pointSubBox",
      title: 'إذا قلت له "وريني"، هل سيشير طفلك إلى الشيء؟',
      name:  "pointing_sub"
    }
  },
  imitation: {
    title:    "متابعة: التقليد",
    question: "اختاري ما ينطبق على طفلك:",
    type:     "checkbox",
    name:     "imitation_context",
    options: [
      { label: "هل يخرج لسانه؟",                                                          value: "tongue" },
      { label: "هل يصدر أصواتاً مضحكة؟",                                                  value: "sounds" },
      { label: 'هل يلوح قاصداً "وداعاً"؟ (أو يشير لـ "وداعاً"؟)',                        value: "wave"   },
      { label: "هل يصفق بيده؟",                                                            value: "clap"   },
      { label: 'هل يضع إصبعه على شفتيه كإشارة لـ "السكوت"/"الصمت"؟',                     value: "shush"  },
      { label: "هل يرسل قبلة في الهواء؟",                                                  value: "kiss"   },
      { label: "أخرى (صف)",                                                                value: "other", isOther: true }
    ]
  },
  discrimination: {
    title:    "متابعة: التمييز",
    question: "اختاري ما ينطبق على طفلك:",
    type:     "checkbox",
    name:     "discrimination_context",
    options: [
      { label: 'التعرّف على جزء من جسمهم عندما تسأل "أين أنفك؟" أو "أين عينك؟"',          value: "body_part"    },
      { label: 'الالتفات أو النظر إلى والد أو شقيق عندما تذكر اسمهم "أين ماما؟"',         value: "look_person"  },
      { label: 'الإشارة إلى غرض مألوف ويومي (مثل كرسي أو مصباح) عندما تسأل "أين الكرسي؟"', value: "point_object" },
      { label: 'إحضار غرض مألوف ويومي (مثل ملعقة أو بطانية) عندما تطلب منهم "أحضر الملعقة"', value: "bring_object" },
      { label: "أخرى (اذكر)",                                                              value: "other", isOther: true }
    ]
  }
};

/* =========================
   FOLLOWUP RENDER — matches questionnaire page structure exactly
========================= */
function renderFollowupStep() {
  const container = document.getElementById("followupContainer");
  const skill     = followupSteps[currentFollowupIndex];
  const total     = followupSteps.length;
  const isLast    = currentFollowupIndex === total - 1;
  const isFirst   = currentFollowupIndex === 0;
  const step      = FOLLOWUP_STEPS_CONFIG[skill];
  const assessment= getAssessment();

  // تغيير سؤال الاستجابة للاسم حسب جواب السؤال الأساسي
  if (skill === "response_to_name") {
    const initialAnswer = assessment.initialAnswers.response_to_name;

    if (initialAnswer === 1) {
      step.question = "هل طفلك يستجيب لاسمه في مواقف أخرى حتى لو لم يكن الأمر ثابتًا؟ (مثال: قد يستجيب في الحديقة أو عند الحماس لكنه لا يستجيب أثناء مشاهدة التلفاز أو عندما يكون مركزًا على نشاط).";
    } else {
      step.question = "هل استجابة طفلك مرتبطة فعلاً بمعرفته لاسمه، أم أنها تحدث بسبب نبرة الصوت أو التلميحات؟ (مثال: إذا قلت اسمه بصوت عادي من بعيد هل ينظر إليك؟)";
    }
  }

  // Ensure state exists for this field
  if (!followupBtnState[step.name]) {
    followupBtnState[step.name] = step.type === "radio" ? "" : new Set();
  }
  if (step.subQuestion && !followupBtnState[step.subQuestion.name]) {
    followupBtnState[step.subQuestion.name] = "";
  }

  /* ---- Build main options using questionnaire-option buttons ---- */
  let optionsHtml = "";
  step.options.forEach(opt => {
    const isSelected = step.type === "radio"
      ? followupBtnState[step.name] === opt.value
      : followupBtnState[step.name].has(opt.value);

    optionsHtml += `
      <button type="button"
        class="questionnaire-option${isSelected ? " selected" : ""}"
        data-field="${step.name}"
        data-value="${opt.value}"
        data-type="${step.type}"
        ${opt.isOther ? 'data-is-other="true"' : ""}
        onclick="handleFollowupOptionClick(this)">
        ${opt.label}
      </button>
    `;

    if (opt.isOther) {
      const isOtherSelected = step.type === "radio"
        ? followupBtnState[step.name] === "other"
        : followupBtnState[step.name].has("other");
      optionsHtml += `
        <div id="${step.name}_other_box" style="display:${isOtherSelected ? "block" : "none"}; margin-top:-6px; padding: 0 2px 8px;">
          <input type="text" id="${step.name}_other_text"
            placeholder="اكتب هنا..."
            style="width:100%; padding:10px 14px; border:1.5px solid #c5d5ee; border-radius:12px; font-size:15px; font-family:inherit; direction:rtl; background:#fff; outline:none; box-sizing:border-box;">
        </div>
      `;
    }
  });

  /* ---- Build sub-question (eye_contact / pointing_with_finger) ---- */
  let subHtml = "";
  if (step.subQuestion) {
    const checkedCount = followupBtnState[step.name].size;
    const subVisible   = checkedCount === 1;
    const subName      = step.subQuestion.name;

    let subOptHtml = "";
    ["yes", "no"].forEach(val => {
      const lbl = val === "yes" ? "نعم" : "لا";
      const sel = followupBtnState[subName] === val;
      subOptHtml += `
        <button type="button"
          class="questionnaire-option${sel ? " selected" : ""}"
          data-field="${subName}"
          data-value="${val}"
          data-type="radio"
          onclick="handleFollowupOptionClick(this)">
          ${lbl}
        </button>
      `;
    });

    subHtml = `
      <div id="${step.subQuestion.id}" style="display:${subVisible ? "block" : "none"}; margin-top: 32px;">
        <div id="subQuestionTitle" class="question-title">${step.subQuestion.title}</div>
        <div id="${subName}_options" class="question-options">
          ${subOptHtml}
        </div>
      </div>
    `;
  }

  /* ---- Assemble — identical structure to questionnaire page ---- */
  container.innerHTML = `
    <div id="questionProgress" class="question-progress">
      السؤال: ${currentFollowupIndex + 1}/${total}
    </div>

    <div id="questionTitle" class="question-title">${step.title}</div>

    <div id="questionDescription" class="question-description">${step.question}</div>

    <div id="questionOptions" class="question-options">
      ${optionsHtml}
    </div>

    ${subHtml}

    <div id="questionnaireError" style="color:red; text-align:center; margin-top:12px; min-height:20px; font-size:14px;"></div>

    <div class="questionnaire-nav">
      <button type="button" class="questionnaire-next-btn" onclick="goNextFollowup()">${isLast ? "إرسال" : "التالي"}</button>
      ${!isFirst ? `<button type="button" class="questionnaire-next-btn prev-btn" onclick="goPrevFollowup()">السابق</button>` : ""}
    </div>
  `;
}

function handleFollowupOptionClick(btn) {
  const field   = btn.dataset.field;
  const value   = btn.dataset.value;
  const type    = btn.dataset.type;
  const isOther = btn.dataset.isOther === "true";

  if (type === "radio") {
    document.querySelectorAll(`[data-field="${field}"]`).forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    followupBtnState[field] = value;
  } else {
    if (followupBtnState[field].has(value)) {
      followupBtnState[field].delete(value);
      btn.classList.remove("selected");
    } else {
      followupBtnState[field].add(value);
      btn.classList.add("selected");
    }

    if (isOther) {
      const otherBox = document.getElementById(`${field}_other_box`);
      if (otherBox) otherBox.style.display = followupBtnState[field].has("other") ? "block" : "none";
      if (!followupBtnState[field].has("other")) {
        const otherTxt = document.getElementById(`${field}_other_text`);
        if (otherTxt) otherTxt.value = "";
      }
    }

    const skill = followupSteps[currentFollowupIndex];
    const step  = FOLLOWUP_STEPS_CONFIG[skill];
    if (step.subQuestion && step.name === field) {
      const subBox = document.getElementById(step.subQuestion.id);
      if (subBox) subBox.style.display = followupBtnState[field].size === 1 ? "block" : "none";
      if (followupBtnState[field].size !== 1) {
        followupBtnState[step.subQuestion.name] = "";
        document.querySelectorAll(`[data-field="${step.subQuestion.name}"]`)
          .forEach(b => b.classList.remove("selected"));
      }
    }
  }
}

function goNextFollowup() {
  const error = document.getElementById("questionnaireError");
  if (error) error.textContent = "";

  const skill = followupSteps[currentFollowupIndex];
  const step  = FOLLOWUP_STEPS_CONFIG[skill];

  if (skill === "eye_contact") {
    const count = followupBtnState[step.name] ? followupBtnState[step.name].size : 0;
    if (count === 0) {
      followupCollectedAnswers.eye_contact = 1;
    } else if (count >= 2) {
      followupCollectedAnswers.eye_contact = 0;
    } else {
      const subVal = followupBtnState[step.subQuestion.name];
      if (!subVal) {
        if (error) error.textContent = "يرجى استكمال سؤال المتابعة الخاص بالتواصل البصري.";
        return;
      }
      followupCollectedAnswers.eye_contact = subVal === "yes" ? 0 : 1;
    }
  }

  else if (skill === "response_to_name") {
    const val = followupBtnState[step.name];
    if (!val) {
      if (error) error.textContent = "يرجى الإجابة على سؤال متابعة الاستجابة للاسم.";
      return;
    }
    followupCollectedAnswers.response_to_name = val === "yes" ? 0 : 1;
  }

  else if (skill === "pointing_with_finger") {
    const count = followupBtnState[step.name] ? followupBtnState[step.name].size : 0;
    if (count === 0) {
      followupCollectedAnswers.pointing_with_finger = 1;
    } else if (count >= 2) {
      followupCollectedAnswers.pointing_with_finger = 0;
    } else {
      const subVal = followupBtnState[step.subQuestion.name];
      if (!subVal) {
        if (error) error.textContent = "يرجى استكمال سؤال المتابعة الخاص بالإشارة بالإصبع.";
        return;
      }
      followupCollectedAnswers.pointing_with_finger = subVal === "yes" ? 0 : 1;
    }
  }

  else if (skill === "imitation") {
    const count = followupBtnState[step.name] ? followupBtnState[step.name].size : 0;
    followupCollectedAnswers.imitation = count >= 2 ? 0 : 1;
  }

  else if (skill === "discrimination") {
    const count = followupBtnState[step.name] ? followupBtnState[step.name].size : 0;
    followupCollectedAnswers.discrimination = count >= 2 ? 0 : 1;
  }

  if (currentFollowupIndex < followupSteps.length - 1) {
    currentFollowupIndex++;
    renderFollowupStep();
  } else {
    finalizeFollowup();
  }
}

function goPrevFollowup() {
  if (currentFollowupIndex > 0) {
    currentFollowupIndex--;
    renderFollowupStep();
  }
}

function finalizeFollowup() {
  const assessment = getAssessment();
  if (!assessment) {
    window.location.href = "questionnaire.html";
    return;
  }

  const updatedAnswers = { ...assessment.currentAnswers, ...followupCollectedAnswers };
  const finalScore     = calculateScore(updatedAnswers);
  const finalRisk      = classifyRisk(assessment.ageGroup, finalScore);

  assessment.currentAnswers  = updatedAnswers;
  assessment.finalScore      = finalScore;
  assessment.finalRisk       = finalRisk;
  assessment.followupComplete= true;

  // إضافة للداشبورد
  let history = JSON.parse(localStorage.getItem("maddadHistory")) || [];

  history.push({
    date:  new Date().toLocaleDateString("ar-SA"),
    risk:  riskTextArabic(finalRisk),
    score: finalScore
  });

  localStorage.setItem("maddadHistory", JSON.stringify(history));

  saveAssessment(assessment);
  window.location.href = "result.html";
}

function submitFollowup(event) {
  if (event) event.preventDefault();
}


document.addEventListener("DOMContentLoaded", function () {
  const gamesContainer = document.getElementById("gamesContainer");
  if (!gamesContainer) return;

  const assessment = JSON.parse(localStorage.getItem("maddadAssessment"));
  if (!assessment || !assessment.currentAnswers) return;

  const answers = assessment.currentAnswers;

  const responseGame  = document.getElementById("responseGame");
  const eyeContactGame= document.getElementById("eyeContactGame");

  if (responseGame)   responseGame.style.display  = "none";
  if (eyeContactGame) eyeContactGame.style.display = "none";

  const hasWeakResponse = Number(answers.response_to_name) === 1;
  const hasWeakEye      = Number(answers.eye_contact)      === 1;

  if (hasWeakResponse && responseGame) {
    responseGame.style.display = "flex";
  }

  if (hasWeakEye && eyeContactGame) {
    eyeContactGame.style.display = "flex";
  }

  if (!hasWeakResponse && !hasWeakEye) {
    gamesContainer.innerHTML = `
      <div class="game-layout" style="justify-content:center;">
        <div class="game-details" style="text-align:center;">
          <div class="game-title">لا توجد أنشطة مقترحة حالياً</div>
          <div class="game-description">
            لم تظهر في نتيجة الطفل حاجة حالية لأنشطة خاصة بمهارتي التواصل البصري أو الاستجابة للاسم.
          </div>
        </div>
      </div>
    `;
  }
});
