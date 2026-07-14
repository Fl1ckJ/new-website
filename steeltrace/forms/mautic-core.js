/* ============================================================
   SteelTrace forms — shared Mautic + hCaptcha core.
   Exposes window.STMautic used by the individual form files
   (newsletter.js, brochure.js, weekly.js, contact.js).
   Submissions POST to the proxy backend, which verifies
   hCaptcha and forwards to Mautic.
   ============================================================ */
(function () {
  "use strict";

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
})();
