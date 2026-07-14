/* SteelTrace forms — Contact page form (Mautic form 9).
   Wires the inline #mauticform_contact form if present on the page.
   Call window.STForms.contact() once. */
(function () {
  "use strict";
  window.STForms = window.STForms || {};

  window.STForms.contact = function () {
    if (!window.STMautic) return;
    var form = document.getElementById("mauticform_contact");
    if (!form) return; // only the contact page has this form
    var ctrl = window.STMautic.wire({
      form: form,
      submitBtn: form.querySelector('button[type="submit"]'),
      consent: form.querySelector(".c-consent"),
      hcap: form.querySelector("[data-hcap]"),
      error: form.querySelector("[data-err]"),
      onSuccess: function () { window.location.assign("form/message/"); }
    });
    if (ctrl) ctrl.renderCaptcha();
  };
})();
