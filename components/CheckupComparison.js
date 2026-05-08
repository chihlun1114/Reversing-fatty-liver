/**
 * Block 9 — CheckupComparison（精簡版：移除會衝突的內聯樣式計算）
 */
(function () {
  "use strict";

  function expandSlides(swiperEl) {
    var wrapper = swiperEl.querySelector(".swiper-wrapper");
    if (!wrapper || wrapper.getAttribute("data-expanded") === "1") return;

    var children = wrapper.children;
    var DATA = [];
    for (var i = 0; i < children.length; i++) {
      DATA.push(children[i].innerHTML);
    }
    if (!DATA.length) return;

    var DISPLAY_DATA = DATA.concat(DATA);
    wrapper.innerHTML = DISPLAY_DATA.map(function (html) {
      return '<div class="swiper-slide">' + html + "</div>";
    }).join("");
    wrapper.setAttribute("data-expanded", "1");
  }

  function init() {
    var swiperEl = document.querySelector("#section-9 [data-checkup-swiper]");
    if (!swiperEl || typeof window.Swiper !== "function") return;

    expandSlides(swiperEl);

    var prev = swiperEl.querySelector(".checkup-swiper__prev");
    var next = swiperEl.querySelector(".checkup-swiper__next");
    var pag = swiperEl.querySelector(".checkup-swiper__pagination");
    if (!prev || !next || !pag) return;

    new window.Swiper(swiperEl, {
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: 0,
      loop: true,
      speed: 600,
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          centeredSlides: true,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 3,
          centeredSlides: true,
          spaceBetween: 0,
        },
      },
      navigation: {
        prevEl: prev,
        nextEl: next,
      },
      pagination: {
        el: pag,
        clickable: true,
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();