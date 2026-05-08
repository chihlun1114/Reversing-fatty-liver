/**
 * LiverEvolution — 六階段肝臟演進（GSAP crossfade）
 * 依賴：全域 gsap（由頁面底部 script 載入）
 */
(function () {
  "use strict";

  var STAGES = [
    {
      id: 0,
      title: "健康肝臟",
      description:
        "肝細胞排列緊密，脂肪含量極低；代謝、解毒與合成蛋白功能正常。維持均衡飲食與規律運動，有助長期保肝。",
      liverSrc: "./images/liver-evolution/stage-0.png",
      microSrc: "./images/liver-evolution/micro-0.png",
    },
    {
      id: 1,
      title: "輕度脂肪肝",
      description:
        "肝臟脂肪堆積略增，多數人無明顯症狀。常與體重、飲食與活動量有關；及早調整生活型態，多數仍可明顯改善。",
      liverSrc: "./images/liver-evolution/stage-1.png",
      microSrc: "./images/liver-evolution/micro-1.png",
    },
    {
      id: 2,
      title: "中度脂肪肝",
      description:
        "脂肪比例升高，肝臟可能出現發炎反應。部分檢查數值開始異常，建議由醫師評估並擬定飲食、運動與追蹤計畫。",
      liverSrc: "./images/liver-evolution/stage-2.png",
      microSrc: "./images/liver-evolution/micro-2.png",
    },
    {
      id: 3,
      title: "重度脂肪肝",
      description:
        "脂肪堆積顯著，發炎與纖維化風險升高。此階段需積極醫療介入與嚴格生活管理，避免進展為纖維化與硬化。",
      liverSrc: "./images/liver-evolution/stage-3.png",
      microSrc: "./images/liver-evolution/micro-3.png",
    },
    {
      id: 4,
      title: "肝纖維化",
      description:
        "肝組織出現明顯纖維疤痕，仍可能透過治療與生活型態調整延緩惡化。務必定期追蹤肝功能與影像，並遵從醫囑。",
      liverSrc: "./images/liver-evolution/stage-4.png",
      microSrc: "./images/liver-evolution/micro-4.png",
    },
    {
      id: 5,
      title: "肝硬化",
      description:
        "肝組織廣泛纖維化，結構不可逆改變；代償能力受限，需專科追蹤與合併症管理。預防惡化與定期監測至關重要。",
      liverSrc: "./images/liver-evolution/stage-5.png",
      microSrc: "./images/liver-evolution/micro-5.png",
    },
  ];

  /** 健康～中度脂肪肝（索引 0–2）為「可逆」區間 */
  var REVERSIBLE_MAX_INDEX = 2;

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function init(root) {
    var section = root || qs(document, "#liver-evolution");
    if (!section) return;

    var liverLayers = section.querySelectorAll("[data-liver-layer]");
    var microImg = qs(section, "[data-micro-img]");
    var titleEl = qs(section, "[data-stage-title]");
    var descEl = qs(section, "[data-stage-desc]");
    var slider = qs(section, "[data-liver-slider]");
    var badgeReversible = qs(section, "[data-badge-reversible]");
    var badgeIrreversible = qs(section, "[data-badge-irreversible]");
    var stageIndexEl = qs(section, "[data-stage-index]");
    var stageTotalEl = qs(section, "[data-stage-total]");

    if (!slider || !liverLayers.length) return;

    var current = parseInt(slider.value, 10);
    if (isNaN(current)) current = 0;
    current = Math.max(0, Math.min(STAGES.length - 1, current));

    function applyStageData(index) {
      var d = STAGES[index];
      if (titleEl) titleEl.textContent = d.title;
      if (descEl) descEl.textContent = d.description;
      if (microImg) {
        microImg.src = d.microSrc;
        microImg.alt = d.title + " — 細胞微觀示意";
      }
      if (stageIndexEl) stageIndexEl.textContent = String(index + 1);
      if (stageTotalEl) stageTotalEl.textContent = String(STAGES.length);

      var isReversible = index <= REVERSIBLE_MAX_INDEX;
      if (badgeReversible) {
        badgeReversible.classList.toggle("is-active", isReversible);
        badgeReversible.setAttribute("aria-current", isReversible ? "true" : "false");
      }
      if (badgeIrreversible) {
        badgeIrreversible.classList.toggle("is-active", !isReversible);
        badgeIrreversible.setAttribute("aria-current", !isReversible ? "true" : "false");
      }
    }

    function crossfadeTo(index) {
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

      if (microImg && typeof gsap !== "undefined") {
        gsap.fromTo(
          microImg,
          { opacity: 0.4 },
          { opacity: 1, duration: 0.45, ease: "power2.out" }
        );
      }

      applyStageData(index);
    }

    liverLayers.forEach(function (img, i) {
      img.style.opacity = i === current ? "1" : "0";
      if (STAGES[i]) {
        img.src = STAGES[i].liverSrc;
        img.alt = STAGES[i].title + " — 示意";
      }
    });

    slider.addEventListener("input", function () {
      var v = parseInt(slider.value, 10);
      if (isNaN(v)) return;
      v = Math.max(0, Math.min(STAGES.length - 1, v));
      if (v !== current) {
        current = v;
        crossfadeTo(v);
      }
    });

    crossfadeTo(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})();
