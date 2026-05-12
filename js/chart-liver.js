/**
 * Block 1 — slidesPerView:1、等高卡片、甜甜圈 cutout 55%、長條動畫與自訂 Tooltip
 */
(function () {
  "use strict";

  var SECTION_SEL = "#section-chart";
  var SWIPER_SEL = ".chart-swiper";
  var SWIPER_PAGINATION_SEL = ".chart-swiper__pagination";
  var CANVAS_ID = "liverChart";
  var TOOLTIP_ID = "custom-tooltip";

  var COLORS = ["#ff5d5f", "#555555", "#888888", "#bbbbbb"];

  var CENTER_META = [
    { pct: "39.6", label: "有定期健檢", color: "#ff5d5f" },
    { pct: "24.1", label: "完全不會", color: "#555555" },
    { pct: "19.5", label: "進階檢查", color: "#888888" },
    { pct: "16.8", label: "有脂肪肝沒追蹤", color: "#bbbbbb" },
  ];

  var doughnutInstance = null;
  var chartCreated = false;
  var swiperInstance = null;
  var barSlidesAnimated = typeof WeakSet === "function" ? new WeakSet() : null;
  var barSlidesAnimatedFallback = [];

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function qsa(root, sel) {
    return [].slice.call((root || document).querySelectorAll(sel));
  }

  function updateCenterText(index) {
    var wrap = qs(document, ".chart-doughnut-wrap");
    if (!wrap) return;
    var el = wrap.querySelector(".chart-center-text");
    if (!el) return;
    var meta = CENTER_META[index];
    if (!meta) meta = CENTER_META[0];
    var pctEl = el.querySelector(".pct");
    var labelEl = el.querySelector(".label");
    if (pctEl) {
      pctEl.style.color = meta.color;
      pctEl.innerHTML = meta.pct + '<span>%</span>';
    }
    if (labelEl) {
      labelEl.style.color = meta.color;
      labelEl.textContent = meta.label;
    }
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
          "有定期健檢",
          "完全不會",
          "進階檢查",
          "有脂肪肝沒追蹤",
        ],
        datasets: [
          {
            data: [39.6, 24.1, 19.5, 16.8],
            backgroundColor: COLORS,
            borderWidth: 0,
            clip: false,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: 8,
        },
        cutout: "55%",
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1200,
        },
        interaction: {
          mode: "nearest",
          intersect: true,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: 10,
            cornerRadius: 6,
            titleFont: { size: 13 },
            bodyFont: { size: 14 },
            displayColors: true,
            callbacks: {
              label: function (c) {
                return c.label + ": " + c.parsed + "%";
              },
            },
          },
        },
      },
    });

    updateCenterText(0);

    canvas.addEventListener("mousemove", function (e) {
      if (!doughnutInstance) return;
      var pts = doughnutInstance.getElementsAtEventForMode(
        e,
        "nearest",
        { intersect: true },
        true
      );
      if (pts.length) {
        updateCenterText(pts[0].index);
      } else {
        updateCenterText(0);
      }
    });
    canvas.addEventListener("mouseleave", function () {
      updateCenterText(0);
    });
  }

  function initSwiper() {
    var el = qs(document, SWIPER_SEL);
    if (!el || typeof Swiper === "undefined") return;
    var shell = el.parentElement;
    var pagEl =
      shell && shell.querySelector
        ? shell.querySelector(SWIPER_PAGINATION_SEL)
        : qs(document, SWIPER_PAGINATION_SEL);
    var prevEl =
      shell && shell.querySelector
        ? shell.querySelector(".chart-nav-prev")
        : null;
    var nextEl =
      shell && shell.querySelector
        ? shell.querySelector(".chart-nav-next")
        : null;

    swiperInstance = new Swiper(el, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 20,
      watchOverflow: true,
      speed: 450,
      pagination: {
        el: pagEl,
        clickable: true,
      },
      navigation: {
        nextEl: nextEl || ".chart-nav-next",
        prevEl: prevEl || ".chart-nav-prev",
      },
    });
  }

  function markBarSlideDone(slide) {
    if (barSlidesAnimated) {
      barSlidesAnimated.add(slide);
    } else if (barSlidesAnimatedFallback.indexOf(slide) === -1) {
      barSlidesAnimatedFallback.push(slide);
    }
  }

  function isBarSlideDone(slide) {
    if (barSlidesAnimated) return barSlidesAnimated.has(slide);
    return barSlidesAnimatedFallback.indexOf(slide) !== -1;
  }

  /** 長條內空間不足時將百分比移到軌道外（.chart-bar-row--pct-outside） */
  function updateBarOutsideLabels(root) {
    if (!root) return;
    var slides =
      root.matches && root.matches("[data-chart-bar-slide]")
        ? [root]
        : qsa(root, "[data-chart-bar-slide]");
    var padX = 26;

    slides.forEach(function (slide) {
      if (!slide.classList.contains("is-bar-animated")) return;
      qsa(slide, ".chart-bar-row--baronly").forEach(function (row) {
        var fill = row.querySelector(".bar-fill");
        var pct = row.querySelector(".bar-fill__pct");
        if (!fill || !pct) return;
        var avail = fill.clientWidth - padX;
        if (avail < 0) avail = 0;
        var need = pct.scrollWidth;
        if (need > avail + 1) {
          row.classList.add("chart-bar-row--pct-outside");
        } else {
          row.classList.remove("chart-bar-row--pct-outside");
        }
      });
    });
  }

  var resizeBarLabelsTimer = null;
  function scheduleBarLabelsResize(section) {
    if (resizeBarLabelsTimer) clearTimeout(resizeBarLabelsTimer);
    resizeBarLabelsTimer = setTimeout(function () {
      resizeBarLabelsTimer = null;
      updateBarOutsideLabels(section);
    }, 150);
  }

  function runBarAnimation(slide) {
    if (!slide || isBarSlideDone(slide)) return;
    markBarSlideDone(slide);
    slide.classList.add("is-bar-animated");
    qsa(slide, ".bar-fill").forEach(function (bar) {
      var w = bar.getAttribute("data-width");
      if (w == null || w === "") return;
      bar.style.width = "0%";
      requestAnimationFrame(function () {
        bar.style.width = w + "%";
      });
    });
    window.setTimeout(function () {
      updateBarOutsideLabels(slide);
    }, 1100);
  }

  function initBarSlideObserver(section) {
    var slides = qsa(section, "[data-chart-bar-slide]");
    if (!slides.length) return;

    if (typeof IntersectionObserver === "undefined") {
      slides.forEach(function (s) {
        runBarAnimation(s);
      });
      window.setTimeout(function () {
        updateBarOutsideLabels(section);
      }, 1150);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runBarAnimation(entry.target);
          }
        });
      },
      { root: null, threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );

    slides.forEach(function (s) {
      io.observe(s);
    });
  }

  function initBarTooltips(section) {
    var tip = document.getElementById(TOOLTIP_ID);
    if (!tip) return;

    function hideTip() {
      tip.textContent = "";
      tip.style.opacity = "0";
      tip.setAttribute("aria-hidden", "true");
    }

    function showTip(e, bar) {
      var label = bar.getAttribute("data-label") || "";
      var pct = bar.getAttribute("data-pct") || "";
      tip.textContent = label + ": " + pct + "%";
      tip.style.opacity = "1";
      tip.setAttribute("aria-hidden", "false");
      var pad = 14;
      var x = e.clientX + pad;
      var y = e.clientY + pad;
      var rect = tip.getBoundingClientRect();
      if (x + rect.width > window.innerWidth - 8) {
        x = e.clientX - rect.width - pad;
      }
      if (y + rect.height > window.innerHeight - 8) {
        y = e.clientY - rect.height - pad;
      }
      tip.style.left = Math.max(8, x) + "px";
      tip.style.top = Math.max(8, y) + "px";
    }

    qsa(section, ".bar-fill").forEach(function (bar) {
      bar.addEventListener("mouseenter", function (e) {
        showTip(e, bar);
      });
      bar.addEventListener("mousemove", function (e) {
        showTip(e, bar);
      });
      bar.addEventListener("mouseleave", hideTip);
    });
  }

  function initChartObserver(section) {
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
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
    );

    obs.observe(section);
  }

  function init() {
    var section = qs(document, SECTION_SEL);
    if (!section) return;

    initSwiper();
    initChartObserver(section);
    initBarSlideObserver(section);
    initBarTooltips(section);

    window.addEventListener("resize", function () {
      scheduleBarLabelsResize(section);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
