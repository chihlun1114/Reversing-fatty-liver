/**
 * Hero — 400 顆脂肪牆 + 360° 噴散；進場鎖屏 → 滾輪觸發 → 播完解鎖。
 * .bubble-wrap.fat-globule：CSS 獨立 scale/filter 呼吸；GSAP 僅動 wrap 的 left/top、內層 .bubble 的 scale／rotation。
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined") {
    return;
  }

  var hero = document.getElementById("hero");
  if (!hero) return;

  var bubbleContainer = hero.querySelector(".bubbles-container");
  if (!bubbleContainer) return;

  var bubbleSources = [
    "./images/bubble-1.webp",
    "./images/bubble-2.webp",
    "./images/bubble-3.webp",
  ];

  var activeTimeline = null;

  var mqNarrow =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 768px)").matches;

  var mqReduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** 初始版 random(0.6, 1.1)／結束 (0.5, 1.0)；窄螢幕整體 ×0.84（約縮小 16%），比例不變 */
  var MOBILE_SIZE_FACTOR = 0.84;

  function initTitleState() {
    var title = hero.querySelector(".layer-title");
    if (!title) return;
    gsap.set(title, { xPercent: -50, y: -150, opacity: 0 });
  }

  function initLiverState() {
    var liver = hero.querySelector(".layer-liver");
    if (!liver) return;
    gsap.set(liver, {
      opacity: 0,
      scale: 0.8,
      filter: "blur(20px)",
    });
  }

  bubbleContainer.innerHTML = "";

  var imgSize = 128;
  var scaleMin = 0.6;
  var scaleMax = 1.1;
  var endScaleMin = 0.5;
  var endScaleMax = 1.0;

  if (mqNarrow) {
    scaleMin *= MOBILE_SIZE_FACTOR;
    scaleMax *= MOBILE_SIZE_FACTOR;
    endScaleMin *= MOBILE_SIZE_FACTOR;
    endScaleMax *= MOBILE_SIZE_FACTOR;
  }

  var i;
  for (i = 0; i < 400; i++) {
    var shell = document.createElement("span");
    shell.className = "bubble-wrap fat-globule";
    shell.setAttribute("aria-hidden", "true");

    var img = document.createElement("img");
    img.src = bubbleSources[i % bubbleSources.length];
    img.className = "bubble fat-globule__img";
    img.alt = "";
    img.decoding = "async";
    img.width = imgSize;
    img.height = imgSize;

    if (mqReduceMotion) {
      shell.style.animation = "none";
    }

    shell.appendChild(img);
    bubbleContainer.appendChild(shell);
  }

  initLiverState();
  initTitleState();

  var w = window.innerWidth;
  var h = window.innerHeight;

  var wraps = gsap.utils.toArray(bubbleContainer.querySelectorAll(".bubble-wrap"));

  wraps.forEach(function (shell) {
    var bubble = shell.querySelector(".bubble");
    if (!bubble) return;
    var rx = gsap.utils.random(-100, w + 100);
    var ry = gsap.utils.random(-100, h + 100);
    gsap.set(shell, { left: rx, top: ry, x: 0, y: 0 });
    gsap.set(bubble, {
      transformOrigin: "50% 50%",
      scale: gsap.utils.random(scaleMin, scaleMax),
      rotation: gsap.utils.random(0, 360),
      opacity: 1,
    });
  });

  var tl = gsap.timeline({
    paused: true,
    onComplete: function () {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
  });

  tl.set(hero, { backgroundColor: "#e54524" }, 0);

  wraps.forEach(function (shell, index) {
    var bubble = shell.querySelector(".bubble");
    if (!bubble) return;

    var baseAngle = (index / wraps.length) * Math.PI * 2;
    var angle = baseAngle + gsap.utils.random(-0.2, 0.2);
    var distance = gsap.utils.random(2000, 3500);

    var dx = Math.cos(angle) * distance;
    var dy = Math.sin(angle) * distance;

    var randomStartTime = gsap.utils.random(0, 0.3);
    var randomDuration = gsap.utils.random(0.8, 1.2);

    tl.to(
      shell,
      {
        left: "+=" + dx,
        top: "+=" + dy,
        ease: "power2.inOut",
        duration: randomDuration,
      },
      randomStartTime
    );

    tl.to(
      bubble,
      {
        rotation: "+=" + gsap.utils.random(-720, 720),
        scale: gsap.utils.random(endScaleMin, endScaleMax),
        opacity: 1,
        ease: "power2.inOut",
        duration: randomDuration,
      },
      randomStartTime
    );
  });

  var liverEl = hero.querySelector(".layer-liver");
  var titleEl = hero.querySelector(".layer-title");
  if (liverEl) {
    tl.to(
      liverEl,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "back.out(1.2)",
        duration: 0.8,
      },
      0.2
    );
  }
  if (titleEl) {
    tl.fromTo(
      titleEl,
      { xPercent: -50, y: -150, opacity: 0 },
      {
        xPercent: -50,
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "bounce.out",
      },
      "-=0.4"
    );
  }

  activeTimeline = tl;

  if (window.scrollY === 0) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    var triggerAnim = function () {
      window.removeEventListener("wheel", triggerAnim);
      window.removeEventListener("touchmove", triggerAnim);
      if (activeTimeline && activeTimeline.paused()) {
        activeTimeline.play();
      }
    };

    window.addEventListener("wheel", triggerAnim);
    window.addEventListener("touchmove", triggerAnim);
  } else if (activeTimeline) {
    activeTimeline.progress(1);
  }
})();
