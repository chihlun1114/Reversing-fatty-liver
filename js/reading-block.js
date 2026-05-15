/**
 * Block 10 — 延伸閱讀 Swiper（箭頭／分頁在 .reading-container 內、輪播外）
 */
(function () {
  "use strict";

  function init() {
    if (typeof window.Swiper !== "function") return;

    var container = document.querySelector("#section-10 .reading-container");
    var swiperEl = document.querySelector("#section-10 .reading-swiper");
    if (!container || !swiperEl) return;

    var prevEl = container.querySelector(".reading-prev");
    var nextEl = container.querySelector(".reading-next");
    var pagEl = container.querySelector(".reading-pagination");
    if (!prevEl || !nextEl || !pagEl) return;

    new window.Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      centeredSlides: false,
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
      },
      pagination: {
        el: pagEl,
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
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
