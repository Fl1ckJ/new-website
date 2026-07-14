/* SteelTrace forms — Weekly product demo (Mautic form 12).
   Faithful port of the `try` repo's weekly-demo form: same fields, same
   date-slot generation (next 6 Thursdays, alternating 09:00 / 16:00),
   same hidden inputs and submit flow. Only styling uses the nl-* classes.
   Trigger: [data-weekly-open]. Call window.STForms.weekly() once. */
(function () {
  "use strict";
  window.STForms = window.STForms || {};

  var BACKEND = "https://mautic-backend.onrender.com/submit";
  var SITEKEY = "54dbef36-8433-4901-9338-6a57133127c4";

  function loadHcaptcha() {
    if (window.hcaptcha) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.getElementById("st-hcaptcha");
      if (!s) {
        s = document.createElement("script");
        s.id = "st-hcaptcha";
        s.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
        s.async = true; s.defer = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", function () { window.hcaptcha ? resolve() : reject(); }, { once: true });
      s.addEventListener("error", reject, { once: true });
      if (window.hcaptcha) resolve();
    });
  }

  function setField(form, name, val) {
    var f = form.querySelector('[name="' + name + '"]');
    if (!f) { f = document.createElement("input"); f.type = "hidden"; f.name = name; form.appendChild(f); }
    f.value = val;
  }

  // Same slot logic as the try repo (even ISO week → 09:00, odd → 16:00).
  function thursdays(count, evenTime, oddTime) {
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

  function html() {
    var slots = thursdays(6, "09:00", "16:00");
    var opts = '<option value="">Choose time</option>' + slots.map(function (s) { return '<option value="' + s.value + '">' + s.label + '</option>'; }).join("");
    var types = ["Laboratory", "NDT", "End Owner", "Inspections", "Manufacturer", "EPC", "Mill", "Other", "Stockist"];
    var typeOpts = '<option value="">Choose</option>' + types.map(function (t) { return '<option value="' + t + '">' + t + '</option>'; }).join("");
    return '' +
      '<div class="nl-backdrop" data-weekly-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="wk-title">' +
        '<button class="nl-x" type="button" data-weekly-close aria-label="Close">×</button>' +
        '<span class="kicker">Weekly product demo</span>' +
        '<h3 id="wk-title">Join our free weekly demo.</h3>' +
        '<p>Every Thursday we run a live product demonstration via Teams. Sign up and we’ll send you the invite.</p>' +
        '<form autocomplete="off" role="form" method="post" id="mauticform_weeklyproductdemo" data-mautic-form="weeklyproductdemo" enctype="multipart/form-data" class="nl-form nl-form-stack" novalidate>' +
          '<input id="weekly_demo_input_first_name" name="mauticform[first_name]" value="" class="nl-input" type="text" placeholder="First name" required aria-label="First name">' +
          '<input id="weekly_demo_input_last_name" name="mauticform[last_name]" value="" class="nl-input" type="text" placeholder="Last name" required aria-label="Last name">' +
          '<input id="weekly_demo_input_email" name="mauticform[email]" value="" class="nl-input" type="email" placeholder="E-mail" required aria-label="E-mail">' +
          '<select id="weekly_demo_input_date" name="mauticform[date]" class="nl-input nl-select" required aria-label="Date">' + opts + '</select>' +
          '<input id="weekly_demo_input_company" name="mauticform[company]" value="" class="nl-input" type="text" placeholder="Company" aria-label="Company">' +
          '<select id="weekly_demo_input_company_type" name="mauticform[company_type]" class="nl-input nl-select" aria-label="Company type">' + typeOpts + '</select>' +
          '<textarea id="weekly_demo_input_notes" name="mauticform[anything_in_particular_yo]" class="nl-input nl-textarea" placeholder="Anything particular you want to see?" aria-label="Notes"></textarea>' +
          '<label class="nl-consent"><input class="nl-consent-box" id="weekly_demo_checkbox_consent_0" type="checkbox" value="yes"> <span>I consent to SteelTrace processing my data according to the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div id="mauticform_weeklyproductdemo_hcaptcha" class="nl-hcap h-captcha" data-sitekey="' + SITEKEY + '"></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" id="mauticform_weeklyproductdemo_id" value="12">' +
          '<input type="hidden" name="mauticform[return]" id="mauticform_weeklyproductdemo_return" value="">' +
          '<input type="hidden" name="mauticform[formName]" id="mauticform_weeklyproductdemo_name" value="weeklyproductdemo">' +
          '<input type="hidden" name="mauticform[submit]" id="mauticform_weeklyproductdemo_submit_value" value="1">' +
          '<div id="mauticform_weeklyproductdemo_tralala"></div>' +
          '<button id="mauticform_input_weeklyproductdemo_verify_and_submit" class="btn btn-primary nl-btn" type="submit">Submit</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks for signing up — we received your weekly demo registration. ✓</p>' +
      '</div>';
  }

  window.STForms.weekly = function () {
    var pop = document.createElement("div");
    pop.className = "nl-pop";
    pop.innerHTML = html();
    document.body.appendChild(pop);
    var form = pop.querySelector("form");
    var btn = pop.querySelector(".nl-btn");
    var consent = pop.querySelector(".nl-consent-box");
    var errEl = pop.querySelector("[data-err]");
    var capTarget = pop.querySelector(".h-captcha");
    var origBtn = btn.innerHTML;
    var widgetId;

    function showErr(m) { errEl.textContent = m; errEl.classList.add("show"); }
    function clearErr() { errEl.textContent = ""; errEl.classList.remove("show"); }
    function loading(on) { btn.disabled = on; btn.innerHTML = on ? "Sending…" : origBtn; }
    function renderCap() {
      if (widgetId !== undefined) return Promise.resolve(true);
      return loadHcaptcha().then(function () {
        if (!window.hcaptcha) return false;
        widgetId = window.hcaptcha.render(capTarget, { sitekey: SITEKEY });
        return true;
      }).catch(function () { showErr("Captcha failed to load. Refresh and try again."); return false; });
    }
    function close() { pop.classList.remove("open"); }
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); renderCap(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErr();
      if (!form.reportValidity()) return;
      if (consent && !consent.checked) { showErr("Please tick the consent box."); return; }
      renderCap().then(function (ready) {
        if (!ready || !window.hcaptcha || widgetId === undefined) { showErr("Captcha is still loading. Please try again."); return; }
        var token = window.hcaptcha.getResponse(widgetId);
        if (!token) { showErr("Please complete the captcha below, then submit again."); return; }
        setField(form, "mauticform[return]", location.href);
        setField(form, "h-captcha-response", token);
        setField(form, "mauticform[hcdone]", "bleh");
        loading(true);
        fetch(BACKEND, { method: "POST", body: new FormData(form) })
          .then(function (r) { return r.text().then(function (t) { var p = {}; try { p = JSON.parse(t); } catch (x) {} if (!r.ok || p.success !== true) throw new Error(p.message || ("Submission failed (HTTP " + r.status + ")")); return p; }); })
          .then(function () { loading(false); form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2800); })
          .catch(function (er) { loading(false); showErr(er.message || "Something went wrong. Please try again."); if (window.hcaptcha && widgetId !== undefined) window.hcaptcha.reset(widgetId); });
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-weekly-open]")) open(e);
      if (e.target.closest && e.target.closest("[data-weekly-close]")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  };
})();
