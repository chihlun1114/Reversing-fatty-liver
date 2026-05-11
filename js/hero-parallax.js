/**
 * Hero — 300 顆脂肪牆（緻密堆疊）+ 360° 錯落噴散、實體飛出（無淡出）
 * RWD：resize 時清空重建 timeline。
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  var hero = document.getElementById("hero");
  if (!hero) return;

  var bubbleContainer = hero.querySelector(".bubbles-container");
  if (!bubbleContainer) return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollTrigger.normalizeScroll === "function") {
    ScrollTrigger.normalizeScroll(true);
  }

  var bubbleSources = [
    "./images/bubble-1.webp",
    "./images/bubble-2.webp",
    "./images/bubble-3.webp",
  ];

  var activeTimeline = null;
  var resizeTimer;

  function isTitleMobileLayout() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function syncTitleBoxLayout() {
    var title = hero.querySelector(".layer-title");
    if (!title) return;
    var mobile = isTitleMobileLayout();
    gsap.set(title, {
      position: "absolute",
      left: "50%",
      top: mobile ? "32%" : "50%",
      xPercent: -50,
      yPercent: -50,
      width: mobile ? "90%" : "100%",
      height: mobile ? "auto" : "100%",
      maxHeight: mobile ? "48vh" : "none",
    });
  }

  function initTitleState() {
    var title = hero.querySelector(".layer-title");
    if (!title) return;
    var mobile = isTitleMobileLayout();
    gsap.set(title, {
      position: "absolute",
      left: "50%",
      top: mobile ? "32%" : "50%",
      xPercent: -50,
      yPercent: -50,
      width: mobile ? "90%" : "100%",
      height: mobile ? "auto" : "100%",
      maxHeight: mobile ? "48vh" : "none",
      scale: 0.5,
      opacity: 0,
    });
  }

  function initLiverState() {
    var liver = hero.querySelector(".layer-liver");
    if (!liver) return;
    gsap.set(liver, {
      position: "absolute",
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      width: "100%",
      height: "100%",
      scale: 0.8,
      filter: "blur(20px)",
    });
  }

  function killHeroTimeline() {
    if (activeTimeline) {
      if (activeTimeline.scrollTrigger) {
        activeTimeline.scrollTrigger.kill();
      }
      activeTimeline.kill();
      activeTimeline = null;
    }
  }

  function setupHeroAnimation() {
    killHeroTimeline();

    bubbleContainer.innerHTML = "";

    var i;
    for (i = 0; i < 300; i++) {
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
        x: gsap.utils.random(-200, w + 200),
        y: gsap.utils.random(-200, h + 200),
        scale: gsap.utils.random(0.8, 1.8),
        rotation: gsap.utils.random(0, 360),
        opacity: 1,
      });
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 0.5,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

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
          scale: 1,
          filter: "blur(0px)",
          ease: "back.out(1.2)",
          duration: 1,
        },
        0.4
      );
    }
    if (titleEl) {
      tl.to(
        titleEl,
        {
          scale: 1,
          opacity: 1,
          ease: "back.out(1.5)",
          duration: 0.8,
        },
        0.5
      );
    }

    activeTimeline = tl;
  }

  setupHeroAnimation();

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      syncTitleBoxLayout();
      setupHeroAnimation();
      ScrollTrigger.refresh();
    }, 200);
  });
})();
