(function () {
  "use strict";

  var quizApp = document.querySelector("[data-quiz-app]");
  if (!quizApp) return;

  var questions = [
    {
      image: "./images/quiz-q1.webp",
      title: "你的腰圍大約落在什麼範圍？",
      options: [
        { label: "腰圍正常（男 < 90公分，女 < 80公分）", score: 0 },
        { label: "腰圍稍微超出標準", score: 1 },
        { label: "腹部肥胖，有明顯的鮪魚肚", score: 2 },
      ],
    },
    {
      image: "./images/quiz-q2.webp",
      title: "你經常喝含糖飲料或吃甜食嗎？",
      options: [
        { label: "很少吃，大多喝無糖飲料或水", score: 0 },
        { label: "每週至少喝1次含糖飲料或吃甜食", score: 1 },
        { label: "幾乎每天都要喝含糖飲料或吃甜食", score: 2 },
      ],
    },
    {
      image: "./images/quiz-q3.webp",
      title: "你的日常運動量大約是多少？",
      options: [
        { label: "每週維持3次以上運動，每次至少30分鐘", score: 0 },
        { label: "偶爾運動，頻率不太固定", score: 1 },
        { label: "基本上不運動", score: 2 },
      ],
    },
    {
      image: "./images/quiz-q4.webp",
      title: "你平時的壓力大嗎？",
      options: [
        { label: "不覺得壓力大，身心輕鬆平衡", score: 0 },
        { label: "偶爾覺得壓力沉重", score: 1 },
        { label: "壓力超大！甚至影響到睡眠了", score: 2 },
      ],
    },
    {
      image: "./images/quiz-q5.webp",
      title: "你有高血壓、高血糖或高血脂嗎？",
      options: [
        { label: "完全沒有高血壓、高血糖或高血脂", score: 0 },
        { label: "沒有，但是指數逼近及格邊緣", score: 1 },
        { label: "確診高血壓、高血糖、高血脂其中任一項以上", score: 2 },
      ],
    },
  ];

  var resultRules = [
    {
      min: 0,
      max: 2,
      rangeLabel: "0-2分",
      image: "./images/quiz-res-green.webp",
      title: "暫時綠燈，但是不能掉以輕心",
      desc: "目前肝臟負擔較輕，請繼續維持良好的飲食與運動習慣，並定期進行追蹤檢查。",
      link: "#section-recipe",
    },
    {
      min: 3,
      max: 6,
      rangeLabel: "3-6分",
      image: "./images/quiz-res-yellow.webp",
      title: "亮黃燈囉！脂肪可能開始堆積",
      desc: "你的肝臟可能已經開始堆積脂肪。除了均衡飲食、增加運動量，也不妨更積極攝取降低肝臟發炎機會、減少氧化壓力的營養素。",
      link: "#section-nutrient",
    },
    {
      min: 7,
      max: 10,
      rangeLabel: "7-10分",
      image: "./images/quiz-res-red.webp",
      title: "亮紅燈啦！你有很高的脂肪肝風險",
      desc: "你的肝臟負擔沉重，脂肪肝風險很高！建議及早進行相關檢查，並依照醫師或營養師的建議，及早找回輕盈肝臟。",
      link: "#section-9",
    },
  ];

  var startView = quizApp.querySelector("[data-quiz-start]");
  var questionView = quizApp.querySelector("[data-quiz-questions]");
  var resultView = quizApp.querySelector("[data-quiz-result]");
  var startBtn = quizApp.querySelector("[data-quiz-start-btn]");
  var prevBtn = quizApp.querySelector("[data-quiz-prev]");
  var restartBtn = quizApp.querySelector("[data-quiz-restart]");
  var qImage = quizApp.querySelector("#quiz-q-img");
  var qTitle = quizApp.querySelector("#quiz-q-title");
  var qOptions = quizApp.querySelector("#quiz-options");
  var qProgress = quizApp.querySelector("#quiz-progress-current");
  var rImage = quizApp.querySelector("#quiz-r-img");
  var rRange = quizApp.querySelector("#quiz-r-range");
  var rTitle = quizApp.querySelector("#quiz-r-title");
  var rDesc = quizApp.querySelector("#quiz-r-desc");
  var shareFb = quizApp.querySelector('[data-share="fb"]');
  var shareLine = quizApp.querySelector('[data-share="line"]');

  var currentIndex = 0;
  var answers = new Array(questions.length).fill(null);
  var lockSelect = false;

  function showView(target) {
    startView.classList.add("d-none");
    questionView.classList.add("d-none");
    resultView.classList.add("d-none");
    startView.classList.remove("active");
    questionView.classList.remove("active");
    resultView.classList.remove("active");
    target.classList.remove("d-none");
    target.classList.add("active");
  }

  function renderQuestion() {
    var current = questions[currentIndex];
    qProgress.textContent = String(currentIndex + 1);
    qImage.src = current.image;
    qTitle.textContent = current.title;

    qOptions.innerHTML = "";
    current.options.forEach(function (option, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = String.fromCharCode(65 + idx) + ". " + option.label;
      btn.dataset.score = String(option.score);
      btn.addEventListener("click", function () {
        if (lockSelect) return;
        lockSelect = true;
        btn.classList.add("is-active");
        answers[currentIndex] = option.score;
        setTimeout(function () {
          lockSelect = false;
          if (currentIndex < questions.length - 1) {
            currentIndex += 1;
            renderQuestion();
          } else {
            renderResult();
          }
        }, 300);
      });
      qOptions.appendChild(btn);
    });

    prevBtn.disabled = currentIndex === 0;
  }

  function getTotalScore() {
    return answers.reduce(function (sum, val) {
      return sum + (typeof val === "number" ? val : 0);
    }, 0);
  }

  function getResultByScore(score) {
    return resultRules.find(function (rule) {
      return score >= rule.min && score <= rule.max;
    });
  }

  function renderResult() {
    var total = getTotalScore();
    var result = getResultByScore(total);
    if (!result) return;

    rImage.src = result.image;
    if (rRange) rRange.textContent = result.rangeLabel;
    rTitle.textContent = result.title;
    rDesc.textContent = result.desc;

    var sharePageUrl = "https://web.commonhealth.com.tw/fattyliver/index.html";
    if (shareFb) {
      shareFb.href =
        "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(sharePageUrl);
    }
    if (shareLine) {
      shareLine.href =
        "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(sharePageUrl);
    }

    showView(resultView);
  }

  function resetQuiz() {
    currentIndex = 0;
    answers = new Array(questions.length).fill(null);
    lockSelect = false;
    renderQuestion();
    showView(questionView);
  }

  startBtn.addEventListener("click", resetQuiz);

  prevBtn.addEventListener("click", function () {
    if (currentIndex === 0) return;
    answers[currentIndex] = null;
    currentIndex -= 1;
    answers[currentIndex] = null;
    renderQuestion();
  });

  restartBtn.addEventListener("click", resetQuiz);
})();
