(() => {
  // steeltrace/forms/weekly.ts
  var THANK_YOU_PATH = "form/message/";
  var PARIS_TIME_ZONE = "Europe/Paris";
  var DEFAULT_EVEN_WEEK_TIME = "09:00";
  var DEFAULT_ODD_WEEK_TIME = "16:00";
  var DEFAULT_SLOT_COUNT = 6;
  var COMPANY_TYPES = [
    "Laboratory",
    "NDT",
    "End Owner",
    "Inspections",
    "Manufacturer",
    "EPC",
    "Mill",
    "Other",
    "Stockist"
  ];
  (function() {
    "use strict";
    const STForms = window.STForms = window.STForms || {};
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const parisFormatter = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      hour: "numeric",
      hour12: false,
      minute: "numeric",
      month: "numeric",
      timeZone: PARIS_TIME_ZONE,
      year: "numeric"
    });
    const parseTimeToMinutes = (value) => {
      const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
      if (!match) return 0;
      return Number.parseInt(match[1] || "0", 10) * 60 + Number.parseInt(match[2] || "0", 10);
    };
    const getParisNow = () => {
      const values = {};
      parisFormatter.formatToParts(/* @__PURE__ */ new Date()).forEach((part) => {
        if (part.type !== "literal") values[part.type] = part.value;
      });
      return {
        day: Number.parseInt(values.day || "1", 10),
        hour: Number.parseInt(values.hour || "0", 10),
        minute: Number.parseInt(values.minute || "0", 10),
        month: Number.parseInt(values.month || "1", 10),
        year: Number.parseInt(values.year || "1970", 10)
      };
    };
    const createParisDate = (year, month, day) => new Date(Date.UTC(year, month - 1, day));
    const getISOWeekNumber = (date) => {
      const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      const day = copy.getUTCDay() || 7;
      copy.setUTCDate(copy.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
      return Math.ceil(((copy.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
    };
    const getWeekTime = (date, evenWeekTime, oddWeekTime) => getISOWeekNumber(date) % 2 === 0 ? evenWeekTime : oddWeekTime;
    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const formatSlotLabel = (date, time) => {
      const day = date.getUTCDate();
      return WEEKDAYS[date.getUTCDay()] + ", " + day + getDaySuffix(day) + " of " + MONTHS[date.getUTCMonth()] + " " + date.getUTCFullYear() + ", start time: " + time;
    };
    const formatSlotValue = (date) => {
      const day = String(date.getUTCDate()).padStart(2, "0");
      return day + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear();
    };
    const buildUpcomingThursdaySlots = (slotCount, evenWeekTime, oddWeekTime) => {
      const now = getParisNow();
      const currentMinutes = now.hour * 60 + now.minute;
      const first = createParisDate(now.year, now.month, now.day);
      const daysUntilThursday = (4 - first.getUTCDay() + 7) % 7;
      first.setUTCDate(first.getUTCDate() + daysUntilThursday);
      if (daysUntilThursday === 0) {
        const todayTime = getWeekTime(first, evenWeekTime, oddWeekTime);
        if (currentMinutes >= parseTimeToMinutes(todayTime)) {
          first.setUTCDate(first.getUTCDate() + 7);
        }
      }
      const slots = [];
      for (let index = 0; index < Math.max(slotCount, 1); index++) {
        const date = new Date(first);
        date.setUTCDate(first.getUTCDate() + index * 7);
        slots.push({
          value: formatSlotValue(date),
          label: formatSlotLabel(date, getWeekTime(date, evenWeekTime, oddWeekTime))
        });
      }
      return slots;
    };
    const modalHtml = () => {
      const slots = buildUpcomingThursdaySlots(DEFAULT_SLOT_COUNT, DEFAULT_EVEN_WEEK_TIME, DEFAULT_ODD_WEEK_TIME);
      const dateOptions = '<option value="">Choose a date</option>' + slots.map((s) => '<option value="' + s.value + '">' + s.label + "</option>").join("");
      const typeOptions = '<option value="">Company type</option>' + COMPANY_TYPES.map((t) => '<option value="' + t + '">' + t + "</option>").join("");
      return '<div class="nl-backdrop" data-weekly-close></div><div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="wk-title"><button class="nl-x" type="button" data-weekly-close aria-label="Close">\xD7</button><span class="kicker">Weekly product demo</span><h3 id="wk-title">Join our free weekly demo.</h3><p>Every Thursday we run a live product demonstration via Teams. Sign up and we\u2019ll send you the invite.</p><form class="nl-form nl-form-stack" id="mauticform_weeklyproductdemo" method="post" novalidate><input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" /><input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" /><input class="nl-input" type="email" name="mauticform[email]" placeholder="Work email" required aria-label="Work email" /><select class="nl-input nl-select" name="mauticform[date]" required aria-label="Date">' + dateOptions + '</select><input class="nl-input" type="text" name="mauticform[company]" placeholder="Company" required aria-label="Company" /><select class="nl-input nl-select" name="mauticform[company_type]" aria-label="Company type">' + typeOptions + '</select><textarea class="nl-input nl-textarea" name="mauticform[anything_in_particular_yo]" placeholder="Anything particular you want to see? (optional)" aria-label="Notes"></textarea><label class="nl-consent"><input type="checkbox" class="nl-consent-box" name="mauticform[webinar_consent][]" value="true" /> <span>I consent to SteelTrace processing my data as per the <a href="/privacy-policy" target="_blank" rel="noopener">privacy statement</a>.</span></label><div class="nl-hcap" data-hcap></div><span class="nl-err" data-err></span><input type="hidden" name="mauticform[formId]" value="12"><input type="hidden" name="mauticform[formName]" value="weeklyproductdemo"><input type="hidden" name="mauticform[submit]" value="1"><button class="btn btn-primary nl-btn" type="submit">Sign up</button></form></div>';
    };
    STForms.weekly = function() {
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
        if (target.closest("[data-weekly-open]")) open(e);
        if (target.closest("[data-weekly-close]")) close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    };
  })();
})();
