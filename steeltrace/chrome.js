/* ============================================================
   SteelTrace — single shared site chrome (header + footer)
   Drop these placeholders on any page:
     <header class="topbar" data-site-header data-page="home"></header>
     <footer class="site-footer" data-site-footer></footer>
   …then load this script. It fills them, marks the active nav
   item (from data-page), and wires the light/dark theme toggle.
   Edit the markup HERE once — every page updates.
   ============================================================ */
(function () {
  "use strict";

  // ============================================================
  //  Mautic form backend (shared by newsletter / brochure / contact)
  //  Submissions POST to the same proxy the old site used, which
  //  verifies hCaptcha and forwards to Mautic. Exposed as window.STMautic.
  // ============================================================
  var MAUTIC_SUBMIT_URL = "https://mautic-backend.onrender.com/submit";
  var HCAPTCHA_SITEKEY = "54dbef36-8433-4901-9338-6a57133127c4";
  var _hcapPromise;

  function loadHcaptcha() {
    if (window.hcaptcha) return Promise.resolve();
    if (_hcapPromise) return _hcapPromise;
    _hcapPromise = new Promise(function (resolve, reject) {
      var s = document.getElementById("st-hcaptcha");
      if (!s) {
        s = document.createElement("script");
        s.id = "st-hcaptcha";
        s.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
        s.async = true; s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", function () { window.hcaptcha ? resolve() : reject(new Error("hCaptcha init failed")); }, { once: true });
      s.addEventListener("error", function () { _hcapPromise = null; reject(new Error("hCaptcha load failed")); }, { once: true });
    });
    return _hcapPromise;
  }

  function submitMautic(form, token) {
    function setField(name, val) {
      var f = form.querySelector('[name="' + name + '"]');
      if (!f) { f = document.createElement("input"); f.type = "hidden"; f.name = name; form.appendChild(f); }
      f.value = val;
    }
    setField("mauticform[return]", window.location.href);
    setField("h-captcha-response", token);
    setField("mauticform[hcdone]", "bleh");
    return fetch(MAUTIC_SUBMIT_URL, { method: "POST", body: new FormData(form) })
      .then(function (r) {
        return r.text().then(function (txt) {
          var p = {};
          try { p = JSON.parse(txt); } catch (e) {}
          if (!r.ok || p.success !== true) {
            throw new Error(p.message || ("Submission failed (HTTP " + r.status + ")"));
          }
          return p;
        });
      });
  }

  // wire a Mautic form. opts: { form, submitBtn, consent, hcap, error, onSuccess }
  function wireMautic(opts) {
    var form = opts.form, btn = opts.submitBtn, hcap = opts.hcap, err = opts.error;
    if (!form || form.dataset.mauticWired === "1") return null;
    form.dataset.mauticWired = "1";
    var widgetId;
    var origBtn = btn ? btn.innerHTML : "";
    function showErr(m) { if (err) { err.textContent = m; err.classList.add("show"); } }
    function clearErr() { if (err) { err.textContent = ""; err.classList.remove("show"); } }
    function setLoading(on) {
      if (!btn) return;
      btn.disabled = on;
      if (on) { btn.dataset.loading = "1"; btn.innerHTML = "Sending…"; }
      else if (btn.dataset.loading) { btn.innerHTML = origBtn; delete btn.dataset.loading; }
    }
    function renderCap() {
      if (widgetId !== undefined) return Promise.resolve(true);
      return loadHcaptcha().then(function () {
        if (!window.hcaptcha) return false;
        widgetId = window.hcaptcha.render(hcap, { sitekey: HCAPTCHA_SITEKEY });
        return true;
      }).catch(function () { showErr("Captcha failed to load. Refresh and try again."); return false; });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErr();
      if (!form.reportValidity()) return;
      if (opts.consent && !opts.consent.checked) { showErr("Please tick the consent box."); return; }
      renderCap().then(function (ready) {
        if (!ready || !window.hcaptcha || widgetId === undefined) { showErr("Captcha is still loading. Please try again in a moment."); return; }
        var token = window.hcaptcha.getResponse(widgetId);
        if (!token) { showErr("Please complete the captcha below, then submit again."); return; }
        setLoading(true);
        submitMautic(form, token).then(function () {
          setLoading(false);
          if (opts.onSuccess) opts.onSuccess();
        }).catch(function (er) {
          setLoading(false);
          showErr((er && er.message) ? er.message : "Something went wrong. Please try again.");
          if (window.hcaptcha && widgetId !== undefined) window.hcaptcha.reset(widgetId);
        });
      });
    });
    return { renderCaptcha: renderCap };
  }

  window.STMautic = { wire: wireMautic, loadHcaptcha: loadHcaptcha, SITEKEY: HCAPTCHA_SITEKEY, SUBMIT_URL: MAUTIC_SUBMIT_URL };

  var EXP = "SteelTrace%20Matrix%20Explorer.html";

  var caret =
    '<span class="caret"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';
  var sun =
    '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon =
    '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  var SUPPLY = [
    ["Operators", "op"],
    ["EPC Contractors", "epc"],
    ["Welding &amp; NDT Contractors", "wld"],
    ["Manufacturers &amp; Material Suppliers", "mfg"],
    ["Testing &amp; Inspection Companies", "ndt"]
  ];
  var ROLE = [
    ["Executive Leadership", "exec"],
    ["QA / QC", "qaqc"],
    ["Project Management", "pm"],
    ["Operations &amp; Asset Integrity", "ops"],
    ["Digital Transformation", "dig"]
  ];
  var PRODUCT = [
    ["Rigid pipelines", "rigid"],
    ["Reeled pipelines", "reeled"],
    ["Flexible pipelines", "flex"],
    ["Bundle pipelines", "bundle"],
    ["Fitting &amp; Flanges", "fittings"]
  ];
  function ddLink(item) {
    return '<a class="dd-link" href="solution-' + item[1] + '.html">' + item[0] + "</a>";
  }
  function ddLinkProduct(item) {
    return '<a class="dd-link" href="product-' + item[1] + '.html">' + item[0] + "</a>";
  }

  function headerHTML(page) {
    function a(k) { return page === k ? " active" : ""; }
    return '' +
      '<a class="brand" href="SteelTrace%20Home.html">' +
        '<img class="brand-logo" src="https://steeltrace.co/wp-content/themes/steeltrace/images/logo_white.svg" alt="SteelTrace" onerror="window.__stBrand&&window.__stBrand(this)" />' +
      '</a>' +
      '<nav class="nav-links">' +
        '<a class="nav-link' + a("home") + '" href="SteelTrace%20Home.html">Home</a>' +
        '<div class="nav-dd">' +
          '<button class="nav-link' + a("solutions") + '" type="button" aria-haspopup="true">Solutions ' + caret + '</button>' +
          '<div class="nav-dd-menu mega" role="menu">' +
            '<div class="dd-col"><div class="dd-col-head">By Company Type</div>' + SUPPLY.map(ddLink).join("") + '</div>' +
            '<div class="dd-col"><div class="dd-col-head">By Stakeholder Type</div>' + ROLE.map(ddLink).join("") + '</div>' +
            '<div class="dd-col"><div class="dd-col-head">By Product Type</div>' + PRODUCT.map(ddLinkProduct).join("") + '</div>' +
          '</div>' +
        '</div>' +
        '<a class="nav-link' + a("prod") + '" href="Product.html">Product</a>' +
        '<div class="nav-dd">' +
          '<button class="nav-link' + a("about") + '" type="button" aria-haspopup="true">About Us ' + caret + '</button>' +
          '<div class="nav-dd-menu" role="menu">' +
            '<a class="dd-item" href="about.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M11 12h1v4h1"/></svg></span><span class="dd-tx"><b>About SteelTrace</b><span>Mission, vision &amp; what we build</span></span></a>' +
            '<div class="dd-sep"></div>' +
            '<a class="dd-item" href="careers.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span><span class="dd-tx"><b>Careers</b><span>Join the team</span></span></a>' +
            '<div class="dd-sep"></div>' +
            '<a class="dd-item" href="contact.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg></span><span class="dd-tx"><b>Contact</b><span>Talk to us</span></span></a>' +
          '</div>' +
        '</div>' +
        '<a class="nav-link' + a("blog") + '" href="blog.html">Blog</a>' +
      '</nav>' +
      '<div class="nav-actions">' +
        '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle light or dark theme">' +
          '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
          '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '</button>' +
        '<a class="nav-login" href="https://steeltrace.io/login" target="_blank" rel="noopener">Login</a>' +
        '<a class="nav-cta" href="demo.html">Book a demo <span class="cta-arrow">\u2192</span></a>' +
      '</div>';
  }

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
    var nav = document.createElement("nav");
    var tmp = document.createElement("div");
    tmp.innerHTML = crumbHTML(spec);
    page.insertBefore(tmp.firstChild, page.firstChild);
  }

  function footerHTML() {
    return '' +
      '<div class="foot-inner">' +
        '<div class="foot-brand">' +
          '<a class="brand" href="SteelTrace%20Home.html"><img class="brand-logo" src="https://steeltrace.co/wp-content/themes/steeltrace/images/logo_white.svg" alt="SteelTrace" onerror="window.__stBrand&&window.__stBrand(this)" /></a>' +
          '<p class="foot-blurb">Connecting the energy supply chain through Smart Manufacturing Records — verified data, end-to-end traceability, lifecycle value.</p>' +
        '</div>' +
        '<div class="foot-col"><h4>Platform</h4><a href="Product.html">Product</a><a href="How%20It%20Works.html">How It Works</a></div>' +
        '<div class="foot-col"><h4>Company</h4><a href="about.html">About SteelTrace</a><a href="careers.html">Careers</a><a href="blog.html">Blog</a><a href="contact.html">Contact</a></div>' +
        '<div class="foot-col"><h4>Get started</h4><a href="demo.html">Book a demo</a><a href="https://steeltrace.io/login" target="_blank" rel="noopener">Login to SteelTrace</a><a href="#newsletter" data-newsletter-open>Newsletter</a><a href="#brochure" data-brochure-open>Get a brochure</a></div>' +
      '</div>' +
      '<div class="foot-bottom"><span class="mono-note">© 2026 SteelTrace</span><span class="mono-note"><a class="foot-legal" href="privacy-policy.html">Privacy Statement</a></span><span class="mono-note"><a class="foot-legal" href="disclaimer.html">Disclaimer</a></span><span class="mono-note"><a class="foot-legal" href="#cookies" data-cookie-open>Change Cookie Consent</a></span><span class="mono-note">Smart Manufacturing Records · safety-critical industries</span></div>';
  }

  // ---------- newsletter popup ----------
  var NL_KEY = "steeltrace-newsletter";
  function newsletterHTML() {
    return '' +
      '<div class="nl-backdrop" data-newsletter-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="nl-title">' +
        '<button class="nl-x" type="button" data-newsletter-close aria-label="Close">\u00d7</button>' +
        '<span class="kicker">Newsletter</span>' +
        '<h3 id="nl-title">Proof, not paper — in your inbox.</h3>' +
        '<p>Occasional updates on Smart Manufacturing Records, traceability and product news. No spam, unsubscribe anytime.</p>' +
        '<form class="nl-form nl-form-stack" id="mauticform_newsletter" method="post" novalidate>' +
          '<input type="hidden" name="mauticform[first_name]" value="">' +
          '<input type="hidden" name="mauticform[last_name]" value="">' +
          '<input class="nl-input" type="email" name="mauticform[email]" placeholder="Work email" required aria-label="Work email" />' +
          '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div class="nl-hcap" data-hcap></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" value="13">' +
          '<input type="hidden" name="mauticform[formName]" value="newsletter">' +
          '<input type="hidden" name="mauticform[submit]" value="1">' +
          '<button class="btn btn-primary nl-btn" type="submit">Subscribe</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks — you are on the list. \u2713</p>' +
      '</div>';
  }
  function wireNewsletter() {
    var pop = document.createElement("div");
    pop.className = "nl-pop";
    pop.innerHTML = newsletterHTML();
    document.body.appendChild(pop);
    var form = pop.querySelector(".nl-form");
    var ctrl = window.STMautic.wire({
      form: form,
      submitBtn: form.querySelector(".nl-btn"),
      consent: form.querySelector(".nl-consent-box"),
      hcap: form.querySelector("[data-hcap]"),
      error: form.querySelector("[data-err]"),
      onSuccess: function () { form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2400); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    function close() { pop.classList.remove("open"); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-newsletter-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-newsletter-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // ---------- brochure popup ----------
  var BR_KEY = "steeltrace-brochure";
  function brochureHTML() {
    return '' +
      '<div class="nl-backdrop" data-brochure-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="br-title">' +
        '<button class="nl-x" type="button" data-brochure-close aria-label="Close">\u00d7</button>' +
        '<span class="kicker">Product brochure</span>' +
        '<h3 id="br-title">Get the SteelTrace brochure.</h3>' +
        '<p>Learn more about the SteelTrace products and services. We will send the brochure to your inbox.</p>' +
        '<form class="nl-form nl-form-stack" id="mauticform_brochure" method="post" novalidate>' +
          '<input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" />' +
          '<input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" />' +
          '<input class="nl-input" type="email" name="mauticform[email]" placeholder="Work email" required aria-label="Work email" />' +
          '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div class="nl-hcap" data-hcap></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" value="10">' +
          '<input type="hidden" name="mauticform[formName]" value="downloadtheproductbrochure">' +
          '<input type="hidden" name="mauticform[submit]" value="1">' +
          '<button class="btn btn-primary nl-btn" type="submit">Get the brochure</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks \u2014 the brochure is on its way to your inbox. \u2713</p>' +
      '</div>';
  }
  function wireBrochure() {
    var pop = document.createElement("div");
    pop.className = "nl-pop";
    pop.innerHTML = brochureHTML();
    document.body.appendChild(pop);
    var form = pop.querySelector(".nl-form");
    var ctrl = window.STMautic.wire({
      form: form,
      submitBtn: form.querySelector(".nl-btn"),
      consent: form.querySelector(".nl-consent-box"),
      hcap: form.querySelector("[data-hcap]"),
      error: form.querySelector("[data-err]"),
      onSuccess: function () { form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2600); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    function close() { pop.classList.remove("open"); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-brochure-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-brochure-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // ---------- weekly product demo popup ----------
  function weeklyThursdays(count, evenTime, oddTime) {
    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var WD = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    function suf(n) { if (n >= 11 && n <= 13) return "th"; switch (n % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; } }
    function isoWeek(d) { var c = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); var day = c.getUTCDay() || 7; c.setUTCDate(c.getUTCDate() + 4 - day); var ys = new Date(Date.UTC(c.getUTCFullYear(), 0, 1)); return Math.ceil((((c - ys) / 86400000) + 1) / 7); }
    var first = new Date(); first = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate()));
    var d2t = (4 - first.getUTCDay() + 7) % 7; first.setUTCDate(first.getUTCDate() + d2t);
    if (d2t === 0) first.setUTCDate(first.getUTCDate() + 7);
    var out = [];
    for (var i = 0; i < count; i++) {
      var dt = new Date(first); dt.setUTCDate(first.getUTCDate() + i * 7);
      var t = (isoWeek(dt) % 2 === 0) ? evenTime : oddTime;
      var day = dt.getUTCDate();
      var val = (day < 10 ? "0" + day : "" + day) + "-" + (dt.getUTCMonth() + 1) + "-" + dt.getUTCFullYear();
      var label = WD[dt.getUTCDay()] + ", " + day + suf(day) + " of " + MONTHS[dt.getUTCMonth()] + " " + dt.getUTCFullYear() + " — start " + t;
      out.push({ value: val, label: label });
    }
    return out;
  }
  function weeklyHTML() {
    var slots = weeklyThursdays(6, "09:00", "16:00");
    var opts = '<option value="">Choose a date</option>' + slots.map(function (s) { return '<option value="' + s.value + '">' + s.label + '</option>'; }).join("");
    var types = ["Laboratory", "NDT", "End Owner", "Inspections", "Manufacturer", "EPC", "Mill", "Stockist", "Other"];
    var typeOpts = '<option value="">Company type</option>' + types.map(function (t) { return '<option value="' + t + '">' + t + '</option>'; }).join("");
    return '' +
      '<div class="nl-backdrop" data-weekly-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="wk-title">' +
        '<button class="nl-x" type="button" data-weekly-close aria-label="Close">×</button>' +
        '<span class="kicker">Weekly product demo</span>' +
        '<h3 id="wk-title">Join our free weekly demo.</h3>' +
        '<p>Every Thursday we run a live product demonstration via Teams. Sign up and we’ll send you the invite.</p>' +
        '<form class="nl-form nl-form-stack" id="mauticform_weekly" method="post" novalidate>' +
          '<input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" />' +
          '<input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" />' +
          '<input class="nl-input" type="email" name="mauticform[email]" placeholder="Work email" required aria-label="Work email" />' +
          '<select class="nl-input nl-select" name="mauticform[date]" required aria-label="Date">' + opts + '</select>' +
          '<input class="nl-input" type="text" name="mauticform[company]" placeholder="Company" aria-label="Company" />' +
          '<select class="nl-input nl-select" name="mauticform[company_type]" aria-label="Company type">' + typeOpts + '</select>' +
          '<textarea class="nl-input nl-textarea" name="mauticform[anything_in_particular_yo]" placeholder="Anything particular you want to see? (optional)" aria-label="Notes"></textarea>' +
          '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div class="nl-hcap" data-hcap></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" value="12">' +
          '<input type="hidden" name="mauticform[formName]" value="weeklyproductdemo">' +
          '<input type="hidden" name="mauticform[submit]" value="1">' +
          '<button class="btn btn-primary nl-btn" type="submit">Sign up</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks for signing up — we’ll email you the weekly demo invite. ✓</p>' +
      '</div>';
  }
  function wireWeekly() {
    var pop = document.createElement("div");
    pop.className = "nl-pop";
    pop.innerHTML = weeklyHTML();
    document.body.appendChild(pop);
    var form = pop.querySelector(".nl-form");
    var ctrl = window.STMautic.wire({
      form: form,
      submitBtn: form.querySelector(".nl-btn"),
      consent: form.querySelector(".nl-consent-box"),
      hcap: form.querySelector("[data-hcap]"),
      error: form.querySelector("[data-err]"),
      onSuccess: function () { form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2800); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    function close() { pop.classList.remove("open"); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-weekly-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-weekly-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
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
  function mount() {
    applyTheme(curTheme());
    var h = document.querySelector("[data-site-header]");
    if (h) h.innerHTML = headerHTML(h.getAttribute("data-page") || "");
    if (h) mountCrumbs(h);
    var f = document.querySelector("[data-site-footer]");
    if (f) f.innerHTML = footerHTML();
    var logo = document.querySelector(".topbar .brand-logo");
    if (logo && logo.complete && logo.naturalWidth === 0) window.__stBrand(logo);
    var flogo = document.querySelector(".site-footer .brand-logo");
    if (flogo && flogo.complete && flogo.naturalWidth === 0) window.__stBrand(flogo);
    wireToggles();
    wireNewsletter();
    wireBrochure();
    wireWeekly();
    wireCookieConsent();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
