/**
 * Block 8 — 護肝營養素翻面圖卡
 * 觸控／粗指標裝置：點擊切換 .is-flipped（桌面仍用 CSS :hover）
 * 同一時間僅一張為背面；點另一張時其餘自動翻回正面。
 */
(function () {
  "use strict";

  var section = document.querySelector(".section-nutrition[data-nutrition-flip]");
  if (!section) return;

  var cards;

  function useTouchFlip() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }

  function setExpanded(card, on) {
    card.setAttribute("aria-expanded", on ? "true" : "false");
  }

  function closeAllExcept(exceptCard) {
    cards.forEach(function (other) {
      if (other !== exceptCard) {
        other.classList.remove("is-flipped");
        setExpanded(other, false);
      }
    });
  }

  function toggleCard(card) {
    if (card.classList.contains("is-flipped")) {
      card.classList.remove("is-flipped");
      setExpanded(card, false);
    } else {
      closeAllExcept(card);
      card.classList.add("is-flipped");
      setExpanded(card, true);
    }
  }

  function init() {
    cards = section.querySelectorAll("[data-nutrition-card]");
    if (!cards.length) return;

    if (!useTouchFlip()) return;

    section.setAttribute("data-touch-flip", "");

    cards.forEach(function (card) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-expanded", "false");

      card.addEventListener("click", function () {
        toggleCard(card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard(card);
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
