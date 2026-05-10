/**
 * Hero — GSAP ScrollTrigger（油層 expo 爆發 + 肝／標題 back.out 回彈）
 */
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  var hero = document.getElementById("hero");
  if (!hero) return;

  gsap.registerPlugin(ScrollTrigger);

  // 初始狀態設定
  gsap.set(".layer-oil", { scale: 1, opacity: 1 });
  gsap.set(".layer-title", { scale: 0.5, opacity: 0 });
  gsap.set(".layer-liver", { scale: 0.8, filter: "blur(20px)" });

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=150%", // 滾動行程長度
      pin: true, // 完美釘選
      scrub: 1, // 平滑滾動
      pinSpacing: true,
    },
  });

  // --- 爆發式動畫邏輯開始 ---
  // 1. 油泡層：蓄力後瞬間炸開飛出螢幕
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
    // 2. 底層肝臟：從模糊中 Q 彈浮現
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
    // 3. 中層標題：充滿力道地擊出
    .to(
      ".layer-title",
      {
        scale: 1,
        opacity: 1,
        ease: "back.out(1.5)",
        duration: 0.8,
      },
      0.7
    );
  // --- 爆發式動畫邏輯結束 ---
})();
