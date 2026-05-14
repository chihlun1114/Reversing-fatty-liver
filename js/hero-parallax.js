/**
 * Hero — 400 顆脂肪牆 + 360° 噴散；進場鎖屏 → 滾輪觸發 → 播完解鎖。
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

  var i;
  for (i = 0; i < 400; i++) {
    var img = document.createElement("img");
    img.src = bubbleSources[i % bubbleSources.length];
    img.className = "bubble";
    img.alt = "";
    img.decoding = "async";
    img.width = 128;
    img.height = 128;
    bubbleContainer.appendChild(img);
  }

  initLiverState();
  initTitleState();

  var w = window.innerWidth;
  var h = window.innerHeight;

  var bubbles = gsap.utils.toArray(bubbleContainer.querySelectorAll(".bubble"));

  bubbles.forEach(function (bubble) {
    gsap.set(bubble, {
      transformOrigin: "50% 50%",
      x: gsap.utils.random(-100, w + 100),
      y: gsap.utils.random(-100, h + 100),
      scale: gsap.utils.random(0.6, 1.1),
      rotation: gsap.utils.random(0, 360),
      opacity: 1,
    });
  });

  gsap.set(bubbleContainer, { autoAlpha: 1 });

  var tl = gsap.timeline({
    paused: true,
    onComplete: function () {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    },
  });

  tl.set(hero, { backgroundColor: "#e54524" }, 0);

  bubbles.forEach(function (bubble, index) {
    var baseAngle = (index / bubbles.length) * Math.PI * 2;
    var angle = baseAngle + gsap.utils.random(-0.2, 0.2);
    var distance = gsap.utils.random(2000, 3500);

    var endX = "+=" + Math.cos(angle) * distance;
    var endY = "+=" + Math.sin(angle) * distance;

    var randomStartTime = gsap.utils.random(0, 0.3);
    var randomDuration = gsap.utils.random(0.8, 1.2);

    tl.to(
      bubble,
      {
        x: endX,
        y: endY,
        rotation: "+=" + gsap.utils.random(-720, 720),
        scale: gsap.utils.random(0.5, 1.0),
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

    gsap.set(bubbleContainer, { autoAlpha: 1 });

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
