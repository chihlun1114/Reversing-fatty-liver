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
            "水煮蛋1顆、連皮地瓜（紫或黃）100克、綠花椰苗半碗、蘿蔓生菜1碗、秋葵2根、玉米筍2根、黑木耳20克、小番茄3顆、藍莓5顆、無調味核桃2顆、南瓜籽1小匙、芝麻醬＋橄欖油1小匙、鹽少許",
          steps: [
            "地瓜蒸熟；蔬菜洗淨，秋葵、玉米筍、黑木耳汆燙後切小塊，小番茄對切。",
            "所有食材（含蛋、堅果、莓果）裝盤。",
            "淋芝麻醬＋橄欖油，少許鹽調味。",
          ],
        },
        {
          title: "抹茶亞麻籽豆乳",
          ingredients:
            "熟黃豆100克、抹茶粉1/2小匙、亞麻籽（或粉）1/2小匙、水300～400毫升",
          steps: [
            "黃豆浸泡8～12小時後煮熟。",
            "所有材料加水打勻即可。",
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
            "鱸魚片1片（約300克）、青花菜1碗、小番茄8顆、薑黃3片（或粉1/2小匙）、薑片3片大蒜3瓣、檸檬1/6顆、小茴香1/2小匙、彩色胡椒粒1小匙、鹽少許、橄欖油1大匙、水約100～150毫升",
          steps: [
            "魚抹鹽；青花菜切塊，小番茄對切，薑黃、薑、大蒜、檸檬切片。",
            "橄欖油小火炒香薑黃、薑、大蒜與香料，加水與番茄煮至微滾。",
            "放入魚，加蓋中小火煨4～5分鐘至熟。",
            "加入青花菜，燜2～3分鐘即可。",
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
            "鮭魚片約70克、草蝦2尾、蛤蜊4個、板豆腐1/8盒、青江菜2株、鴻喜菇半包、洋蔥1/8個、南瓜1/8顆、昆布1小片、無糖豆漿120毫升、鹽、黑胡椒少許、橄欖油1/2大匙",
          steps: [
            "食材切塊，蔬菜、海鮮處理乾淨。",
            "橄欖油炒洋蔥、菇與南瓜，加水與昆布煮至將沸，取出昆布，加入豆腐煮5分鐘。",
            "放入海鮮煮至熟，加入青江菜與豆漿，加熱至微滾。",
            "鹽與胡椒調味即可。",
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
