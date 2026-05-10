/**
 * Block 3 — LiverEvolution（六階段）
 * 資料：STAGES（title、desc、liverImg、microImg）
 * 預加載：頁面初始化時預載所有肝臟層與微觀圖
 * 動畫：GSAP 圖層 opacity；標題／說明位移 + 淡入
 * 依賴：全域 gsap（由 Reversing-fatty-liver/index.html 底部載入）
 */
(function () {
  "use strict";

  var BASE = "./images/liver-evolution/";

  /** @type {{ title: string, desc: string, liverImg: string, microImg: string }[]} */
  var STAGES = [
    {
      title: "健康肝臟",
      desc:
        "外觀呈現紅褐色，平滑有彈性，有良好的代謝功能。",
      liverImg: BASE + "liver-0.png",
      microImg: BASE + "micro-0.png",
    },
    {
      title: "輕度脂肪肝",
      desc:
        "肝臟內含脂肪量為5％～33％，外觀漸漸變為油黃色。要注意脂肪量不等於發炎程度，此時少數人可能已處於肝臟發炎狀態。",
      liverImg: BASE + "liver-1.png",
      microImg: BASE + "micro-1.png",
    },
    {
      title: "中度脂肪肝",
      desc:
        "肝臟內含脂肪量為33％～66％，肝臟仍有彈性，但發炎機率更高。",
      liverImg: BASE + "liver-2.png",
      microImg: BASE + "micro-2.png",
    },
    {
      title: "重度脂肪肝",
      desc:
        "肝臟內含脂肪量大於66％，因脂肪堆積而顯得質地「粉粉的」，體積更大、更容易發炎。",
      liverImg: BASE + "liver-3.png",
      microImg: BASE + "micro-3.png",
    },
    {
      title: "肝纖維化",
      desc:
        "因反覆發炎、修復、結痂（早期纖維化），質地變硬、變粗。此時肝臟雖已受損，但仍可逆轉，恢復健康。",
      liverImg: BASE + "liver-4.png",
      microImg: BASE + "micro-4.png",
    },
    {
      title: "肝硬化",
      desc:
        "硬得像石頭，肝功能已難以逆轉，肝硬化患者每年更約有5％的機率轉變為肝癌。",
      liverImg: BASE + "liver-5.png",
      microImg: BASE + "micro-5.png",
    },
  ];

  function preloadStageAssets(stages) {
    stages.forEach(function (s) {
      var liver = new Image();
      liver.src = s.liverImg;
      var micro = new Image();
      micro.src = s.microImg;
    });
  }

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function init(root) {
    var section = root || qs(document, "#liver-evolution");
    if (!section) return;

    preloadStageAssets(STAGES);

    var liverLayers = section.querySelectorAll("[data-liver-layer]");
    var microImg = qs(section, "[data-micro-img]");
    var titleEl = qs(section, "[data-stage-title]");
    var descEl = qs(section, "[data-stage-desc]");
    var slider = qs(section, "[data-liver-slider]");
    var ticksRoot = qs(section, "[data-liver-ticks]");
    var stageIndexEl = qs(section, "[data-stage-index]");
    var stageTotalEl = qs(section, "[data-stage-total]");

    if (!slider || !liverLayers.length) return;

    var current = parseInt(slider.value, 10);
    if (isNaN(current)) current = 0;
    current = Math.max(0, Math.min(STAGES.length - 1, current));

    function applyStageData(index) {
      var d = STAGES[index];
      if (titleEl) titleEl.textContent = d.title;
      if (descEl) descEl.textContent = d.desc;
      if (microImg) {
        microImg.src = d.microImg;
        microImg.alt = d.title + " — 細胞微觀示意";
      }
      if (stageIndexEl) stageIndexEl.textContent = String(index + 1);
      if (stageTotalEl) stageTotalEl.textContent = String(STAGES.length);
    }

    function animateCopy() {
      if (typeof gsap === "undefined") return;
      var els = [];
      if (titleEl) els.push(titleEl);
      if (descEl) els.push(descEl);
      if (!els.length) return;
      gsap.killTweensOf(els);
      gsap.fromTo(
        els,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }

    /**
     * @param {number} index
     * @param {{ skipCopyAnim?: boolean }} [options]
     */
    function crossfadeTo(index, options) {
      options = options || {};
      var skipCopyAnim = !!options.skipCopyAnim;

      if (typeof gsap === "undefined") {
        liverLayers.forEach(function (img, i) {
          img.style.opacity = i === index ? "1" : "0";
        });
        applyStageData(index);
        return;
      }

      liverLayers.forEach(function (img, i) {
        gsap.to(img, {
          opacity: i === index ? 1 : 0,
          duration: 0.55,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });

      if (microImg) {
        gsap.killTweensOf(microImg);
        gsap.fromTo(
          microImg,
          { opacity: 0.35 },
          { opacity: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" }
        );
      }

      applyStageData(index);
      if (!skipCopyAnim) animateCopy();
    }

    liverLayers.forEach(function (img, i) {
      img.style.opacity = i === current ? "1" : "0";
      if (STAGES[i]) {
        img.src = STAGES[i].liverImg;
        img.alt = STAGES[i].title + " — 示意";
      }
    });

    if (microImg && STAGES[current]) {
      microImg.src = STAGES[current].microImg;
      microImg.alt = STAGES[current].title + " — 細胞微觀示意";
    }

    slider.addEventListener("input", function () {
      var v = parseInt(slider.value, 10);
      if (isNaN(v)) return;
      v = Math.max(0, Math.min(STAGES.length - 1, v));
      if (v === current) return;
      current = v;
      crossfadeTo(v);
    });

    if (ticksRoot) {
      ticksRoot.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest("[data-liver-tick]");
        if (!btn || !ticksRoot.contains(btn)) return;
        var v = parseInt(btn.getAttribute("data-liver-tick"), 10);
        if (isNaN(v)) return;
        v = Math.max(0, Math.min(STAGES.length - 1, v));
        slider.value = String(v);
        slider.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    crossfadeTo(current, { skipCopyAnim: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})();
