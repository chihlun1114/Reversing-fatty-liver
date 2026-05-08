/**
 * Block 9 — CheckupComparison（精簡版：移除會衝突的內聯樣式計算）
 */
(function () {
  "use strict";

  function init() {
    var swiperEl = document.querySelector("#section-9 [data-checkup-swiper]");
    if (!swiperEl || typeof window.Swiper !== "function") return;

    var prev = swiperEl.querySelector(".checkup-swiper__prev");
    var next = swiperEl.querySelector(".checkup-swiper__next");
    var pag = swiperEl.querySelector(".checkup-swiper__pagination");
    if (!prev || !next || !pag) return;

    new window.Swiper(swiperEl, {
      loop: false,
      centeredSlides: true,
      centeredSlidesBounds: true,
      speed: 600,
      watchSlidesProgress: true,
      navigation: {
        nextEl: next,
        prevEl: prev,
      },
      pagination: {
        el: pag,
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
      },
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();