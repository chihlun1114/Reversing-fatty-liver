/**
 * Block 1 — Swiper 輪播 + Chart.js 甜甜圈（進入視窗才繪製）
 */
(function () {
  "use strict";

  var SECTION_SEL = "#section-chart";
  var SWIPER_SEL = ".chart-swiper";
  var CANVAS_ID = "liverChart";

  var doughnutInstance = null;
  var chartCreated = false;
  var swiperInstance = null;
  var centerTextShown = false;

  function showCenterText() {
    if (centerTextShown) return;
    var el = document.querySelector(".chart-center-text");
    if (!el) return;
    centerTextShown = true;
    el.classList.remove("is-visible");
    void el.offsetWidth;
    el.classList.add("is-visible");
  }

  function createDoughnutChart() {
    if (typeof Chart === "undefined" || chartCreated) return;

    var canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (doughnutInstance && typeof doughnutInstance.destroy === "function") {
      doughnutInstance.destroy();
      doughnutInstance = null;
    }

    chartCreated = true;

    doughnutInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "有定期做健檢並留意數據",
          "完全不會／不確定",
          "額外超音波或進階檢查",
          "有脂肪肝未定期追蹤",
        ],
        datasets: [
          {
            data: [39.6, 24.1, 19.5, 16.8],
            backgroundColor: ["#00A650", "#4A5568", "#FEDE00", "#FF5A5F"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1500,
          onComplete: function () {
            showCenterText();
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    setTimeout(showCenterText, 1650);
  }

  function initSwiper() {
    var el = document.querySelector(SWIPER_SEL);
    if (!el || typeof Swiper === "undefined") return;

    swiperInstance = new Swiper(el, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 24,
      watchOverflow: true,
      navigation: {
        nextEl: ".chart-nav-next",
        prevEl: ".chart-nav-prev",
      },
    });
  }

  function init() {
    initSwiper();

    var section = document.querySelector(SECTION_SEL);
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      createDoughnutChart();
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            createDoughnutChart();
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.15 }
    );

    obs.observe(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
