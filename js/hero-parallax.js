/**
 * Hero — GSAP ScrollTrigger（油層 expo 爆發 + 肝／標題 back.out 回彈）
 * 手機版同步標題版面（top / width / height），避免 transform 與 RWD 衝突。
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  var hero = document.getElementById("hero");
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  function isTitleMobileLayout() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  /** 僅更新標題盒模型與置中，不重置 scale／opacity（方便 resize 時不打斷捲動動畫） */
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

  // 初始狀態設定
  gsap.set(".layer-oil", { scale: 1, opacity: 1 });
  gsap.set(".layer-liver", { scale: 0.8, filter: "blur(20px)" });
  initTitleState();

  // 手機版結尾略放大，易讀（僅依首次載入斷點；橫豎轉後請重新整理或觸發 resize refresh）
  var titleEndScale = isTitleMobileLayout() ? 1.08 : 1;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=150%", // 滾動行程長度
      pin: true, // 完美釘選
      scrub: 1, // 平滑滾動（可改 0.5 更黏捲動）
      pinSpacing: true,
    },
  });

  // --- 爆發式動畫邏輯開始 ---
  tl.to(
    ".layer-oil",
    {
      scale: 20,
      opacity: 0,
      ease: "expo.in",
      duration: 1.5,
    },
    0
  )
    .to(
      ".layer-liver",
      {
        scale: 1,
        filter: "blur(0px)",
        ease: "back.out(1.2)",
        duration: 1,
      },
      0.5
    )
    .to(
      ".layer-title",
      {
        scale: titleEndScale,
        opacity: 1,
        ease: "back.out(1.5)",
        duration: 0.8,
      },
      0.7
    );
  // --- 爆發式動畫邏輯結束 ---

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      syncTitleBoxLayout();
      ScrollTrigger.refresh();
    }, 150);
  });
})();
