/* SteelTrace forms — Product brochure (Mautic form 10).
   Faithful port of the `try` repo's product-brochure form: same fields,
   same hidden inputs, same submit flow (set return / h-captcha-response /
   hcdone, POST FormData to the backend). Only the visual styling uses the
   site's nl-* classes. Trigger: [data-brochure-open].
   Call window.STForms.brochure() once to mount. */
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

  function html() {
    return '' +
      '<div class="nl-backdrop" data-brochure-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="br-title">' +
        '<button class="nl-x" type="button" data-brochure-close aria-label="Close">×</button>' +
        '<span class="kicker">Product brochure</span>' +
        '<h3 id="br-title">Get the SteelTrace brochure.</h3>' +
        '<p>Learn more about the SteelTrace products and services. We will send the brochure to your inbox.</p>' +
        '<form autocomplete="off" role="form" method="post" id="mauticform_downloadtheproductbrochure" data-mautic-form="downloadtheproductbrochure" enctype="multipart/form-data" class="nl-form nl-form-stack" novalidate>' +
          '<input id="mauticform_input_downloadtheproductbrochure_first_name" name="mauticform[first_name]" value="" class="nl-input" type="text" placeholder="First Name" required aria-label="First Name">' +
          '<input id="mauticform_input_downloadtheproductbrochure_last_name" name="mauticform[last_name]" value="" class="nl-input" type="text" placeholder="Last Name" required aria-label="Last Name">' +
          '<input id="mauticform_input_downloadtheproductbrochure_business_email" name="mauticform[business_email]" value="" class="nl-input" type="email" placeholder="Email" required aria-label="Email">' +
          '<label class="nl-consent"><input class="nl-consent-box" id="mauticform_downloadtheproductbrochure_checkboxgrp_checkbox_consent_0" type="checkbox" value="yes"> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div id="mauticform_downloadtheproductbrochure_hcaptcha" class="nl-hcap h-captcha" data-sitekey="' + SITEKEY + '"></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" id="mauticform_downloadtheproductbrochure_id" value="10">' +
          '<input type="hidden" name="mauticform[return]" id="mauticform_downloadtheproductbrochure_return" value="">' +
          '<input type="hidden" name="mauticform[formName]" id="mauticform_downloadtheproductbrochure_name" value="downloadtheproductbrochure">' +
          '<input type="hidden" name="mauticform[submit]" id="mauticform_downloadtheproductbrochure_submit_value" value="1">' +
          '<div id="mauticform_downloadtheproductbrochure_tralala"></div>' +
          '<button id="mauticform_input_downloadtheproductbrochure_verify_and_submit" class="btn btn-primary nl-btn" type="submit">Email Me the Brochure!</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks — the brochure is on its way to your inbox. ✓</p>' +
      '</div>';
  }

  window.STForms.brochure = function () {
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
          .then(function () { loading(false); form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2600); })
          .catch(function (er) { loading(false); showErr(er.message || "Something went wrong. Please try again."); if (window.hcaptcha && widgetId !== undefined) window.hcaptcha.reset(widgetId); });
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-brochure-open]")) open(e);
      if (e.target.closest && e.target.closest("[data-brochure-close]")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  };
})();
