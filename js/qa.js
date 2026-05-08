/**
 * Block 4 — QA 風琴夾（互斥展開、GSAP 高度／泡泡／箭頭）
 * 依賴：全域 gsap（index.html 底部先載入）
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-qa-accordion]");
  if (!root) return;

  var items = root.querySelectorAll("[data-qa-item]");
  if (!items.length) return;

  function getParts(item) {
    return {
      panel: item.querySelector("[data-qa-panel]"),
      inner: item.querySelector("[data-qa-panel-inner]"),
      bubble: item.querySelector("[data-qa-bubble]"),
      avatar: item.querySelector(".qa-avatar"),
      trigger: item.querySelector("[data-qa-trigger]"),
      chevron: item.querySelector("[data-qa-chevron]"),
    };
  }

  function nudgeAvatar(avatar) {
    if (!avatar || typeof gsap === "undefined") return;
    gsap.killTweensOf(avatar);
    gsap.set(avatar, { x: 0, rotation: 0, transformOrigin: "50% 85%" });
    gsap.to(avatar, {
      keyframes: [
        { x: -4, rotation: -2.5, duration: 0.09 },
        { x: 4, rotation: 2.5, duration: 0.09 },
        { x: -3, rotation: -1.8, duration: 0.09 },
        { x: 3, rotation: 1.8, duration: 0.09 },
        { x: -2, rotation: -1, duration: 0.08 },
        { x: 0, rotation: 0, duration: 0.1 },
      ],
      ease: "none",
    });
  }

  function closeItem(item) {
    if (!item.classList.contains("is-open")) return;
    var p = getParts(item);
    if (!p.panel || !p.trigger) return;

    item.classList.remove("is-open");
    p.trigger.setAttribute("aria-expanded", "false");

    var h = p.panel.offsetHeight;
    if (h === 0) {
      gsap.set(p.panel, { height: 0 });
    } else {
      gsap.set(p.panel, { height: h });
    }

    var toKillC = [p.panel, p.bubble, p.chevron];
    if (p.avatar) toKillC.push(p.avatar);
    gsap.killTweensOf(toKillC);
    if (p.avatar) gsap.set(p.avatar, { x: 0, rotation: 0 });

    gsap.to(p.panel, {
      height: 0,
      duration: 0.38,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    if (p.bubble) {
      gsap.to(p.bubble, {
        y: 20,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
      });
    }

    if (p.chevron) {
      gsap.to(p.chevron, {
        rotation: 0,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function openItem(item) {
    var p = getParts(item);
    if (!p.panel || !p.inner || !p.trigger) return;

    item.classList.add("is-open");
    p.trigger.setAttribute("aria-expanded", "true");

    var toKillO = [p.panel, p.bubble, p.chevron];
    if (p.avatar) toKillO.push(p.avatar);
    gsap.killTweensOf(toKillO);
    if (p.avatar) gsap.set(p.avatar, { x: 0, rotation: 0 });

    if (p.bubble) {
      gsap.set(p.bubble, { y: 20, opacity: 0 });
    }

    p.panel.style.overflow = "hidden";
    var targetH = p.inner.offsetHeight;

    gsap.set(p.panel, { height: 0 });
    gsap.to(p.panel, {
      height: targetH,
      duration: 0.42,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: function () {
        p.panel.style.height = "auto";
      },
    });

    if (p.chevron) {
      gsap.to(p.chevron, {
        rotation: 180,
        duration: 0.32,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (p.bubble) {
      gsap.to(p.bubble, {
        y: 0,
        opacity: 1,
        duration: 0.38,
        delay: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (p.avatar) {
      gsap.delayedCall(0.34, nudgeAvatar, [p.avatar]);
    }
  }

  function initNoGsap() {
    items.forEach(function (item) {
      var p = getParts(item);
      if (!p.panel) return;
      p.panel.style.height = "0";
      p.panel.style.overflow = "hidden";
      item.classList.remove("is-open");
      if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
      if (p.bubble) {
        p.bubble.style.opacity = "0";
        p.bubble.style.transform = "translateY(20px)";
      }
      if (p.trigger) {
        p.trigger.addEventListener("click", function () {
          var open = item.classList.contains("is-open");
          items.forEach(function (other) {
            var op = getParts(other);
            if (op.panel) {
              op.panel.style.height = "0";
              other.classList.remove("is-open");
              if (op.trigger) op.trigger.setAttribute("aria-expanded", "false");
              if (op.bubble) {
                op.bubble.style.opacity = "0";
                op.bubble.style.transform = "translateY(20px)";
              }
              if (op.chevron) op.chevron.style.transform = "rotate(0deg)";
            }
          });
          if (!open) {
            item.classList.add("is-open");
            if (p.trigger) p.trigger.setAttribute("aria-expanded", "true");
            p.panel.style.height = "auto";
            if (p.bubble) {
              p.bubble.style.opacity = "1";
              p.bubble.style.transform = "translateY(0)";
            }
            if (p.chevron) p.chevron.style.transform = "rotate(180deg)";
          }
        });
      }
    });
  }

  if (typeof gsap === "undefined") {
    initNoGsap();
    return;
  }

  items.forEach(function (item) {
    var p = getParts(item);
    if (!p.panel) return;
    gsap.set(p.panel, { height: 0, overflow: "hidden" });
    if (p.bubble) gsap.set(p.bubble, { y: 20, opacity: 0 });
    if (p.chevron) gsap.set(p.chevron, { rotation: 0 });
    item.classList.remove("is-open");
    if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
  });

  items.forEach(function (item) {
    var p = getParts(item);
    if (!p.trigger) return;
    p.trigger.addEventListener("click", function () {
      var wasOpen = item.classList.contains("is-open");
      items.forEach(function (other) {
        if (other !== item) closeItem(other);
      });
      if (wasOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });
})();
