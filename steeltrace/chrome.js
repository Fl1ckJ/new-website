/* ============================================================
   SteelTrace — site chrome orchestrator.
   Drop these placeholders on any page:
     <header class="topbar" data-site-header data-page="home"></header>
     <footer class="site-footer" data-site-footer></footer>
   …then load this one script. It loads the modular pieces:
     steeltrace/chrome/header.js   → window.STChrome.header(page)
     steeltrace/chrome/footer.js   → window.STChrome.footer()
     steeltrace/forms/*.js         → window.STForms.{newsletter,brochure,weekly,contact}
   then fills the header/footer, sets the active nav item, wires the
   theme toggle + cookie banner, and mounts the forms.
   ============================================================ */
(function () {
  "use strict";

  // ---------- breadcrumbs (header-adjacent) ----------
  function crumbHTML(spec) {
    var sep = '<span class="sep">/</span>';
    var segs = spec.split("|");
    var out = ['<a href="SteelTrace%20Home.html">Home</a>'];
    for (var i = 0; i < segs.length; i++) {
      var m = segs[i].split(">>");
      var label = m[0].replace(/^\s+|\s+$/g, "");
      var href = m[1] ? m[1].replace(/^\s+|\s+$/g, "") : "";
      var isLast = i === segs.length - 1;
      if (href && !isLast) out.push('<a href="' + href + '">' + label + "</a>");
      else out.push('<span class="cur">' + label + "</span>");
    }
    return '<nav class="crumbs" aria-label="Breadcrumb">' + out.join(sep) + "</nav>";
  }
  function mountCrumbs(h) {
    var spec = h && h.getAttribute("data-crumb");
    if (!spec) return;
    var page = document.querySelector(".page");
    if (!page || page.querySelector(".crumbs")) return;
    var tmp = document.createElement("div");
    tmp.innerHTML = crumbHTML(spec);
    page.insertBefore(tmp.firstChild, page.firstChild);
  }

  // ---------- module loader (chrome parts + forms) ----------
  function loadScripts(list, done) {
    (function next(i) {
      if (i >= list.length) { if (done) done(); return; }
      var s = document.createElement("script");
      s.src = list[i];
      s.onload = function () { next(i + 1); };
      s.onerror = function () { next(i + 1); };
      document.head.appendChild(s);
    })(0);
  }

  // ---------- cookie consent ----------
  var CC_KEY = "steeltrace-cookie-consent";
  function ccGet() { try { return localStorage.getItem(CC_KEY); } catch (e) { return null; } }
  function ccSet(v) { try { localStorage.setItem(CC_KEY, v); } catch (e) {} }
  function cookieHTML() {
    return '' +
      '<div class="cc-card" role="dialog" aria-modal="false" aria-labelledby="cc-title">' +
        '<h4 id="cc-title">Cookies</h4>' +
        '<p>We use cookies to improve the security of our website, identify areas for enhancements, and better help our customers. See our <a href="privacy-policy.html#cookies">Privacy Policy</a> for details.</p>' +
        '<p>You can choose to accept all cookies, or manage cookies.</p>' +
        '<div class="cc-manage" hidden>' +
          '<div class="cc-row"><label><input type="checkbox" checked disabled /> <b>Required / Functional Cookies</b> <span class="cc-always">(Always Active)</span></label><p>These cookies allow us to record your privacy choices, log when you have dismissed our automated newsletter popup, and help ensure security on our various on-site forms.</p></div>' +
          '<div class="cc-row"><label><input type="checkbox" class="cc-analytics" checked /> <b>Analytical / Performance Cookies</b></label><p>These cookies allow us to analyse the usage of our site, so that we can review and improve on the user experience of the site. They also allow us to engage with potential customers who submit forms on this site in a proactive and relevant fashion. <a href="privacy-policy.html#cookies">Learn More</a></p></div>' +
          '<div class="cc-row"><label><b>Marketing Cookies</b></label><p>We do not use marketing cookies.</p></div>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button class="btn btn-primary cc-accept" type="button">Accept All</button>' +
          '<button class="btn btn-ghost cc-toggle" type="button">Manage...</button>' +
          '<button class="btn btn-primary cc-selected" type="button" hidden>Allow Selected</button>' +
          '<button class="btn btn-ghost cc-required" type="button" hidden>Allow Required</button>' +
        '</div>' +
      '</div>';
  }
  function wireCookieConsent() {
    var pop = document.createElement("div");
    pop.className = "cc-pop";
    pop.innerHTML = cookieHTML();
    document.body.appendChild(pop);
    var manage = pop.querySelector(".cc-manage");
    var bAccept = pop.querySelector(".cc-accept");
    var bToggle = pop.querySelector(".cc-toggle");
    var bSel = pop.querySelector(".cc-selected");
    var bReq = pop.querySelector(".cc-required");
    var analytics = pop.querySelector(".cc-analytics");
    function show() { pop.classList.add("open"); }
    function hide() { pop.classList.remove("open"); }
    function choose(v) { ccSet(v); hide(); }
    bAccept.addEventListener("click", function () { choose("all"); });
    bToggle.addEventListener("click", function () {
      manage.hidden = false;
      bToggle.hidden = true; bAccept.hidden = true;
      bSel.hidden = false; bReq.hidden = false;
      analytics.checked = ccGet() !== "required";
    });
    bSel.addEventListener("click", function () { choose(analytics.checked ? "all" : "required"); });
    bReq.addEventListener("click", function () { analytics.checked = false; choose("required"); });
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-cookie-open]") : null;
      if (t) { e.preventDefault(); manage.hidden = true; bToggle.hidden = false; bAccept.hidden = false; bSel.hidden = true; bReq.hidden = true; show(); }
    });
    if (!ccGet()) setTimeout(show, 900);
  }

  // ---------- theme toggle ----------
  var THEME_KEY = "steeltrace-theme";
  function curTheme() { try { return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"; } catch (e) { return "dark"; } }
  function applyTheme(t) { document.documentElement.dataset.theme = t === "light" ? "light" : "dark"; }
  function wireToggles() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-theme-toggle]") : null;
      if (!b) return;
      var next = curTheme() === "light" ? "dark" : "light";
      try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
      applyTheme(next);
    });
    window.addEventListener("storage", function (e) { if (!e || e.key === THEME_KEY) applyTheme(curTheme()); });
  }

  window.__stBrand = function (img) {
    img.outerHTML =
      '<span class="brand-mark"><svg viewBox="0 0 40 40" fill="none"><path d="M20 3l14.7 8.5v17L20 37 5.3 28.5v-17z" stroke="var(--accent)" stroke-width="1.6"/><path d="M20 11l7.8 4.5v9L20 29l-7.8-4.5v-9z" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.2"/><circle cx="20" cy="20" r="3.1" fill="var(--accent)"/></svg></span>' +
      '<span class="brand-text"><span class="brand-name">Steel<b>Trace</b></span><span class="brand-tag">Smart Manufacturing Records</span></span>';
  };

  function mountChrome() {
    var C = window.STChrome || {};
    var h = document.querySelector("[data-site-header]");
    if (h && C.header) { h.innerHTML = C.header(h.getAttribute("data-page") || ""); mountCrumbs(h); }
    var f = document.querySelector("[data-site-footer]");
    if (f && C.footer) f.innerHTML = C.footer();
    var logo = document.querySelector(".topbar .brand-logo");
    if (logo && logo.complete && logo.naturalWidth === 0) window.__stBrand(logo);
    var flogo = document.querySelector(".site-footer .brand-logo");
    if (flogo && flogo.complete && flogo.naturalWidth === 0) window.__stBrand(flogo);
  }

  function initForms() {
    var F = window.STForms || {};
    if (F.newsletter) F.newsletter();
    if (F.brochure) F.brochure();
    if (F.weekly) F.weekly();
    if (F.contact) F.contact();
  }

  function mount() {
    applyTheme(curTheme());
    loadScripts([
      "steeltrace/chrome/header.js?v=4",
      "steeltrace/chrome/footer.js?v=4",
      "steeltrace/forms/mautic-core.js?v=4",
      "steeltrace/forms/newsletter.js?v=4",
      "steeltrace/forms/brochure.js?v=4",
      "steeltrace/forms/weekly.js?v=4",
      "steeltrace/forms/contact.js?v=4"
    ], function () {
      mountChrome();
      wireToggles();
      wireCookieConsent();
      initForms();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
