/* SteelTrace — reusable pagination widget.
   Renders a compact, non-overflowing pager into `container`: a window around the
   current page plus the last page, with ellipses for any gaps.
   Always shows the first and last page; the current page and its neighbours
   form a window in between, with ellipses for any gaps:
   - page 1        →  1 2 … last
   - page 2        →  1 2 3 … last
   - last page     →  1 … (last-1) last
   - a middle page →  1 … (n-1) n (n+1) … last
   Relies on the host page's .pager / .pg / .pg.on / .dots styles.

   Usage:
     STPager.render(containerEl, currentPage, totalPages, function (page) { ... });
*/
(function () {
  "use strict";
  window.STPager = window.STPager || {};

  window.STPager.render = function (container, current, total, onNavigate) {
    if (!container) return;
    container.innerHTML = "";
    total = Math.max(1, total | 0);
    if (total <= 1) { container.style.display = "none"; return; }
    current = Math.min(Math.max(1, current | 0), total);

    var go = function (n) {
      if (n >= 1 && n <= total && n !== current && typeof onNavigate === "function") onNavigate(n);
    };
    var num = function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pg" + (n === current ? " on" : "");
      b.textContent = n;
      b.setAttribute("aria-label", "Page " + n);
      if (n === current) b.setAttribute("aria-current", "page");
      b.addEventListener("click", function () { go(n); });
      container.appendChild(b);
    };
    var dots = function () {
      var s = document.createElement("span");
      s.className = "pg dots";
      s.textContent = "…";
      s.setAttribute("aria-hidden", "true");
      container.appendChild(s);
    };
    // always show first & last, plus a window around the current page
    var lo = Math.max(1, current - 1);
    var hi = Math.min(total, current + 1);
    var shown = {};
    shown[1] = true; shown[total] = true;
    for (var i = lo; i <= hi; i++) shown[i] = true;
    var list = Object.keys(shown).map(Number).sort(function (a, b) { return a - b; });

    var prev = 0;
    list.forEach(function (n) {
      if (prev && n - prev > 1) dots();
      num(n);
      prev = n;
    });

    container.style.display = "flex";
  };
})();
