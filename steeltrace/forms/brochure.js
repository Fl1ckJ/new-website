(() => {
  // steeltrace/forms/brochure.ts
  var THANK_YOU_PATH = "form/message/";
  (function() {
    "use strict";
    const STForms = window.STForms = window.STForms || {};
    const modalHtml = () => '<div class="nl-backdrop" data-brochure-close></div><div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="br-title"><button class="nl-x" type="button" data-brochure-close aria-label="Close">\xD7</button><span class="kicker">Product brochure</span><h3 id="br-title">Get the SteelTrace brochure.</h3><p>Learn more about the SteelTrace products and services. We will send the brochure to your inbox.</p><form class="nl-form nl-form-stack" id="mauticform_downloadtheproductbrochure" method="post" novalidate><input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" /><input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" /><input class="nl-input" type="email" name="mauticform[business_email]" placeholder="Work email" required aria-label="Work email" /><label class="nl-consent"><input type="checkbox" class="nl-consent-box" name="mauticform[consent][]" value="yes" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy" target="_blank" rel="noopener">privacy statement</a>.</span></label><div class="nl-hcap" data-hcap></div><span class="nl-err" data-err></span><input type="hidden" name="mauticform[formId]" value="10"><input type="hidden" name="mauticform[formName]" value="downloadtheproductbrochure"><input type="hidden" name="mauticform[submit]" value="1"><button class="btn btn-primary nl-btn" type="submit">Get the brochure</button></form></div>';
    STForms.brochure = function() {
      if (!window.STMautic) return;
      const pop = document.createElement("div");
      pop.className = "nl-pop";
      pop.innerHTML = modalHtml();
      document.body.appendChild(pop);
      const form = pop.querySelector(".nl-form");
      if (!form) return;
      const close = () => {
        pop.classList.remove("open");
      };
      const ctrl = window.STMautic.wire({
        form,
        submitBtn: form.querySelector(".nl-btn"),
        consent: form.querySelector(".nl-consent-box"),
        hcap: form.querySelector("[data-hcap]"),
        error: form.querySelector("[data-err]"),
        // Match the try repo: on success, land the visitor on the thank-you page.
        onSuccess: () => {
          window.location.assign(THANK_YOU_PATH);
        }
      });
      const open = (e) => {
        if (e) e.preventDefault();
        pop.classList.add("open");
        if (ctrl) void ctrl.renderCaptcha();
        const first = pop.querySelector(".nl-input");
        if (first) window.setTimeout(() => first.focus(), 60);
      };
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target || !target.closest) return;
        if (target.closest("[data-brochure-open]")) open(e);
        if (target.closest("[data-brochure-close]")) close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    };
  })();
})();
