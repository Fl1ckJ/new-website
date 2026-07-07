/* SteelTrace — shared theme toggle for static pages.
   Reads/writes localStorage 'steeltrace-theme' ('light' | 'dark') so the
   choice persists across every page (and is shared with the explorer). */
(function () {
  var KEY = "steeltrace-theme";
  function current() {
    try { return localStorage.getItem(KEY) === "light" ? "light" : "dark"; }
    catch (e) { return "dark"; }
  }
  function apply(t) { document.documentElement.dataset.theme = t; }
  // initial (also set inline in <head> to avoid flash, but ensure here too)
  apply(current());
  function wire() {
    var btns = document.querySelectorAll("[data-theme-toggle]");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var next = current() === "light" ? "dark" : "light";
        try { localStorage.setItem(KEY, next); } catch (e) {}
        apply(next);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
