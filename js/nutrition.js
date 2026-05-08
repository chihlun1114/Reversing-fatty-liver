/**
 * Block 8 — 護肝營養素翻面圖卡
 * 觸控／粗指標裝置：點擊切換 .is-flipped（桌面仍用 CSS :hover）
 */
(function () {
  "use strict";

  var section = document.querySelector(".section-nutrition[data-nutrition-flip]");
  if (!section) return;

  function useTouchFlip() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }

  function setExpanded(card, on) {
    card.setAttribute("aria-expanded", on ? "true" : "false");
  }

  function init() {
    var cards = section.querySelectorAll("[data-nutrition-card]");
    if (!cards.length) return;

    if (!useTouchFlip()) return;

    section.setAttribute("data-touch-flip", "");

    cards.forEach(function (card) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-expanded", "false");

      card.addEventListener("click", function () {
        var open = card.classList.toggle("is-flipped");
        setExpanded(card, open);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var open = card.classList.toggle("is-flipped");
          setExpanded(card, open);
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
