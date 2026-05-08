(function () {
  "use strict";

  function initMealTabs() {
    var root = document.querySelector("#section-6 .meal-advice");
    if (!root) return;

    var tabs = root.querySelectorAll("[data-meal-tab]");
    var panels = root.querySelectorAll("[data-meal-panel]");
    if (!tabs.length || !panels.length) return;

    function activate(key) {
      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var active = tab.getAttribute("data-meal-tab") === key;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      }

      for (var j = 0; j < panels.length; j++) {
        var panel = panels[j];
        var show = panel.getAttribute("data-meal-panel") === key;
        panel.classList.toggle("active", show);
        panel.hidden = !show;
      }
    }

    for (var k = 0; k < tabs.length; k++) {
      tabs[k].addEventListener("click", function () {
        activate(this.getAttribute("data-meal-tab"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMealTabs);
  } else {
    initMealTabs();
  }
})();
