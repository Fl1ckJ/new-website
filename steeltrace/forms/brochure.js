/* SteelTrace forms — Product brochure modal (Mautic form 10).
   Trigger with any element that has [data-brochure-open].
   Call window.STForms.brochure() once to mount it. */
(function () {
  "use strict";
  window.STForms = window.STForms || {};

  function html() {
    return '' +
      '<div class="nl-backdrop" data-brochure-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="br-title">' +
        '<button class="nl-x" type="button" data-brochure-close aria-label="Close">×</button>' +
        '<span class="kicker">Product brochure</span>' +
        '<h3 id="br-title">Get the SteelTrace brochure.</h3>' +
        '<p>Learn more about the SteelTrace products and services. We will send the brochure to your inbox.</p>' +
        '<form class="nl-form nl-form-stack" id="mauticform_brochure" method="post" novalidate>' +
          '<input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" />' +
          '<input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" />' +
          '<input class="nl-input" type="email" name="mauticform[business_email]" placeholder="Work email" required aria-label="Work email" />' +
          '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div class="nl-hcap" data-hcap></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" value="10">' +
          '<input type="hidden" name="mauticform[formName]" value="downloadtheproductbrochure">' +
          '<input type="hidden" name="mauticform[submit]" value="1">' +
          '<button class="btn btn-primary nl-btn" type="submit">Get the brochure</button>' +
        '</form>' +
        '<p class="nl-done" hidden>Thanks — the brochure is on its way to your inbox. ✓</p>' +
      '</div>';
  }

  window.STForms.brochure = function () {
    if (!window.STMautic) return;
    var pop = document.createElement("div");
    pop.className = "nl-pop";
    pop.innerHTML = html();
    document.body.appendChild(pop);
    var form = pop.querySelector(".nl-form");
    function close() { pop.classList.remove("open"); }
    var ctrl = window.STMautic.wire({
      form: form,
      submitBtn: form.querySelector(".nl-btn"),
      consent: form.querySelector(".nl-consent-box"),
      hcap: form.querySelector("[data-hcap]"),
      error: form.querySelector("[data-err]"),
      onSuccess: function () { form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2600); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-brochure-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-brochure-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  };
})();
