/**
 * Block 5 — 食譜 Swiper、文案同步、做法 Modal
 */
(function () {
  "use strict";

  var RECIPES = [
    {
      id: "rainbow-breakfast",
      title: "護肝穩糖彩虹早餐盤",
      tags: "膳食纖維＋蛋白質",
      intro: "地瓜、蔬菜與豆乳搭配好油脂，減少血糖波動、避免脂肪堆積。",
      image: "./images/recipe-breakfast.webp",
      imageAlt: "護肝穩糖彩虹早餐盤",
      printTitle: "護肝穩糖彩虹早餐盤 · 抹茶亞麻籽豆乳",
      modalBlocks: [
        {
          title: "護肝穩糖彩虹早餐盤",
          ingredients:
            "水煮蛋1顆、連皮紫心地瓜（或黃地瓜）100克、綠花椰苗半碗（約50克）、蘿蔓生菜1碗（約50克）、秋葵2根（約30克）、玉米筍2根（約30克）、新鮮黑木耳（約20克）、小番茄3顆、藍莓5顆、無調味核桃2顆、南瓜籽1小匙、鹽少許、純白芝麻醬與冷壓初榨橄欖油（各半，混合均勻）1小匙",
          steps: [
            "連皮地瓜蒸熟、蘿蔓生菜洗淨，秋葵、玉米筍與黑木耳川燙，以上皆切小塊，並將小番茄切半。",
            "將上述食材連同切半的水煮蛋、綠花椰苗、藍莓、無調味核桃與南瓜籽置入盤中。",
            "淋上混合好的純白芝麻醬、橄欖油以及少許鹽。",
          ],
        },
        {
          title: "抹茶亞麻籽豆乳",
          ingredients:
            "熟黃豆100克、整粒亞麻籽1/2小匙（或使用亞麻籽粉）、純抹茶粉1/2小匙、飲用水300～400毫升",
          steps: [
            "黃豆先浸泡至少8～12小時，再蒸熟或煮熟備用。",
            "將熟黃豆、整粒亞麻籽與純抹茶粉加入調理機中，加入飲用水約300～400毫升高速攪打即可。",
          ],
        },
      ],
    },
    {
      id: "turmeric-fish",
      title: "薑黃香料橄欖油煨鱸魚",
      tags: "優質蛋白＋抗發炎脂肪",
      intro:
        "鱸魚搭配橄欖油、薑黃與薑，有助抗發炎；青花菜與高纖主食穩定血糖、支持肝臟代謝。",
      image: "./images/recipe-lunch.webp",
      imageAlt: "薑黃香料橄欖油煨鱸魚",
      printTitle: "薑黃香料橄欖油煨鱸魚",
      modalBlocks: [
        {
          title: "薑黃香料橄欖油煨鱸魚",
          ingredients:
            "去刺鱸魚片1片（約300克）、青花菜1碗（約200克）、小番茄 8顆、新鮮薑黃3片（或用薑黃粉1/2小匙）、薑片3片、大蒜3瓣、檸檬1/6顆、小茴香1/2小匙、彩色胡椒粒1小匙、鹽少許、冷壓初榨橄欖油1大匙、飲用水約100～150毫升",
          steps: [
            "鱸魚洗淨擦乾並抹少許鹽，青花菜切一口大小，小番茄切半，薑黃、薑、大蒜、檸檬片切片。",
            "鍋內加入橄欖油，放入薑黃、薑片、大蒜、小茴香與胡椒粒，用小火煸出香氣。再加入飲用水約100～150毫升，放進小番茄，煮至微滾。",
            "放入鱸魚片後，蓋上鍋蓋，以中小火煨煮約4～5分鐘至熟，可將鍋中湯汁輕輕淋在魚面上。",
            "最後加入青花菜，蓋鍋蓋悶2～3分鐘即可起鍋。",
          ],
        },
      ],
    },
    {
      id: "seafood-tofu-soup",
      title: "海鮮豆腐蔬菜豆乳湯",
      tags: "海鮮＋植物蛋白與膳食纖維",
      intro:
        "魚貝與豆類蛋白溫和好吸收，搭配蔬菜與菇類纖維，幫助穩定血糖血脂、減少脂肪堆積。",
      image: "./images/recipe-dinner.webp",
      imageAlt: "海鮮豆腐蔬菜豆乳湯",
      printTitle: "海鮮豆腐蔬菜豆乳湯",
      modalBlocks: [
        {
          title: "海鮮豆腐蔬菜豆乳湯",
          ingredients:
            "鮭魚片1/3片（約70克）、草蝦2尾、蛤蠣4個、板豆腐1/8盒（約80克）、青江菜2株（約150克）、鴻喜菇半包（約50克）、洋蔥1/8個（約40克）、南瓜1/8顆（約120克）、昆布1小片、無糖豆漿120毫升、鹽少許、黑胡椒粉 少許、冷壓初榨橄欖油1/2大匙",
          steps: [
            "洋蔥、南瓜、豆腐切絲或塊，青江菜與鴻喜菇洗淨。草蝦洗淨、剪鬚去腸泥；蛤蠣先吐沙並刷洗外殼。",
            "以中小火、少許橄欖油拌炒洋蔥、鴻喜菇與南瓜，加入飲用水與昆布，小火加熱至快煮沸時取出昆布，再放入豆腐，小火煮約5分鐘。",
            "加入鮭魚、草蝦與蛤蠣煮至接近熟透，可先將草蝦與蛤蠣撈出備用，避免過熟。加入青江菜、無糖豆漿，以小火加熱至微微冒泡即可關火。",
            "以少許鹽與黑胡椒調味，將草蝦與蛤蠣放回碗中即可享用。",
          ],
        },
      ],
    },
  ];

  function buildModalHtml(blocks, mainTitle) {
    var html = "";
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      var skipHeading = mainTitle && b.title === mainTitle && i === 0;
      if (!skipHeading) {
        html += "<h3>" + escapeHtml(b.title) + "</h3>";
      }
      html += '<p class="recipe-modal__ingredients"><strong>【食材】</strong>' + escapeHtml(b.ingredients) + "</p>";
      html += '<p class="recipe-modal__method-label"><strong>【作法】</strong></p>';
      html += '<ol class="recipe-modal__steps recipe-modal__steps--numbered">';
      for (var j = 0; j < b.steps.length; j++) {
        html +=
          '<li><span class="recipe-modal__step-text">' +
          escapeHtml(b.steps[j]) +
          "</span></li>";
      }
      html += "</ol>";
    }
    return html;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function init() {
    var root = document.querySelector("[data-recipe-showcase]");
    if (!root) return;

    var swiperEl = root.querySelector(".recipe-swiper");
    var modal = document.getElementById("recipe-modal");
    if (!modal || !swiperEl) return;

    var modalTitle = modal.querySelector("[data-modal-title]");
    var modalBody = modal.querySelector("[data-modal-body]");
    var modalClose = modal.querySelector("[data-modal-close]");

    var activeIndex = 0;
    var swiperInstance = null;

    function fillModal() {
      var r = RECIPES[activeIndex];
      if (!r || !modalBody) return;
      if (modalTitle) {
        modalTitle.textContent =
          r.modalBlocks.length > 1 && r.printTitle ? r.printTitle : r.title;
      }
      modalBody.innerHTML = buildModalHtml(r.modalBlocks, r.title);
    }

    function openModal() {
      fillModal();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      var focusBtn = root.querySelector(".swiper-slide-active [data-recipe-open-modal]");
      if (focusBtn) focusBtn.focus();
    }

    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    var pagEl = root.querySelector(".recipe-swiper__pagination");
    var prevEl = swiperEl.querySelector(".swiper-button-prev");
    var nextEl = swiperEl.querySelector(".swiper-button-next");
    if (pagEl && prevEl && nextEl && typeof window.Swiper === "function") {
      swiperInstance = new window.Swiper(swiperEl, {
        speed: 500,
        spaceBetween: 0,
        slidesPerView: 1,
        loop: true,
        grabCursor: true,
        autoHeight: false,
        pagination: {
          el: pagEl,
          clickable: true,
        },
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
        on: {
          init: function () {
            activeIndex = this.realIndex;
          },
          slideChange: function () {
            activeIndex = this.realIndex;
          },
        },
      });
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-recipe-open-modal]");
      if (!btn || !root.contains(btn)) return;
      if (swiperInstance) activeIndex = swiperInstance.realIndex;
      openModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
