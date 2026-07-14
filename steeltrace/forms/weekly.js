/* SteelTrace forms — Weekly product demo modal (Mautic form 12).
   Trigger with any element that has [data-weekly-open].
   Auto-generates the next 6 Thursday slots (alternating 09:00 / 16:00).
   Call window.STForms.weekly() once to mount it. */
(function () {
  "use strict";
  window.STForms = window.STForms || {};

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

  window.STForms.weekly = function () {
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
      onSuccess: function () { form.hidden = true; pop.querySelector(".nl-done").hidden = false; setTimeout(close, 2800); }
    });
    function open(e) { if (e) e.preventDefault(); pop.classList.add("open"); if (ctrl) ctrl.renderCaptcha(); var i = pop.querySelector(".nl-input"); if (i) setTimeout(function () { i.focus(); }, 60); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-weekly-open]") : null;
      if (t) open(e);
      var c = e.target.closest ? e.target.closest("[data-weekly-close]") : null;
      if (c) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  };
})();
