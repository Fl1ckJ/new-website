/* SteelTrace forms — Newsletter modal (Mautic form 13).
   Trigger with any element that has [data-newsletter-open].
   Call window.STForms.newsletter() once to mount it. */
(function () {
  "use strict";
  window.STForms = window.STForms || {};

  function html() {
    return '' +
      '<div class="nl-backdrop" data-newsletter-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="nl-title">' +
        '<button class="nl-x" type="button" data-newsletter-close aria-label="Close">×</button>' +
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
        '<p class="nl-done" hidden>Thanks — you are on the list. ✓</p>' +
      '</div>';
  }

  window.STForms.newsletter = function () {
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
      onSuccess: function () { window.location.assign("form/message/"); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-newsletter-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-newsletter-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  };
})();
