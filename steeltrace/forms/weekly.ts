/* ============================================================
   SteelTrace forms — Weekly product demo (Mautic form 12).

   TypeScript source. Compiled to weekly.js (classic browser
   script) which chrome.js loads. Mirrors the try repo's
   weeklyDemoForm.ts: the same Mautic field set (incl. the
   webinar_consent field the backend expects), the same
   Europe/Paris upcoming-Thursday slot generation (alternating
   09:00 / 16:00 by ISO week parity) and submit-then-redirect
   behaviour, reusing the shared window.STMautic engine.

   Rebuild after editing:
     npx esbuild steeltrace/forms/weekly.ts \
       --bundle --format=iife --target=es2017 \
       --outfile=steeltrace/forms/weekly.js
   Trigger:  [data-weekly-open]   Close: [data-weekly-close]
   ============================================================ */

interface STMauticWireOptions {
  form: HTMLFormElement
  submitBtn: HTMLElement | null
  consent: HTMLInputElement | null
  hcap: HTMLElement | null
  error: HTMLElement | null
  onSuccess?: () => void
}

interface STMauticController {
  renderCaptcha: () => Promise<boolean>
}

interface STMauticApi {
  wire: (opts: STMauticWireOptions) => STMauticController | null
  loadHcaptcha: () => Promise<void>
  SITEKEY: string
  SUBMIT_URL: string
}

declare global {
  interface Window {
    STMautic?: STMauticApi
    STForms?: Record<string, () => void>
  }
}

interface DemoSlot {
  value: string
  label: string
}

const THANK_YOU_PATH = "form/message/"
const PARIS_TIME_ZONE = "Europe/Paris"
const DEFAULT_EVEN_WEEK_TIME = "09:00"
const DEFAULT_ODD_WEEK_TIME = "16:00"
const DEFAULT_SLOT_COUNT = 6
const COMPANY_TYPES = [
  "Laboratory",
  "NDT",
  "End Owner",
  "Inspections",
  "Manufacturer",
  "EPC",
  "Mill",
  "Other",
  "Stockist",
]

;(function () {
  "use strict"
  const STForms: Record<string, () => void> = (window.STForms = window.STForms || {})

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const parisFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    month: "numeric",
    timeZone: PARIS_TIME_ZONE,
    year: "numeric",
  })

  const parseTimeToMinutes = (value: string): number => {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return 0
    return Number.parseInt(match[1] || "0", 10) * 60 + Number.parseInt(match[2] || "0", 10)
  }

  const getParisNow = () => {
    const values: Record<string, string> = {}
    parisFormatter.formatToParts(new Date()).forEach((part) => {
      if (part.type !== "literal") values[part.type] = part.value
    })
    return {
      day: Number.parseInt(values.day || "1", 10),
      hour: Number.parseInt(values.hour || "0", 10),
      minute: Number.parseInt(values.minute || "0", 10),
      month: Number.parseInt(values.month || "1", 10),
      year: Number.parseInt(values.year || "1970", 10),
    }
  }

  const createParisDate = (year: number, month: number, day: number): Date =>
    new Date(Date.UTC(year, month - 1, day))

  const getISOWeekNumber = (date: Date): number => {
    const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const day = copy.getUTCDay() || 7
    copy.setUTCDate(copy.getUTCDate() + 4 - day)
    const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1))
    return Math.ceil(((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  const getWeekTime = (date: Date, evenWeekTime: string, oddWeekTime: string): string =>
    getISOWeekNumber(date) % 2 === 0 ? evenWeekTime : oddWeekTime

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th"
    switch (day % 10) {
      case 1: return "st"
      case 2: return "nd"
      case 3: return "rd"
      default: return "th"
    }
  }

  const formatSlotLabel = (date: Date, time: string): string => {
    const day = date.getUTCDate()
    return (
      WEEKDAYS[date.getUTCDay()] + ", " + day + getDaySuffix(day) + " of " +
      MONTHS[date.getUTCMonth()] + " " + date.getUTCFullYear() + ", start time: " + time
    )
  }

  const formatSlotValue = (date: Date): string => {
    const day = String(date.getUTCDate()).padStart(2, "0")
    return day + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear()
  }

  const buildUpcomingThursdaySlots = (
    slotCount: number,
    evenWeekTime: string,
    oddWeekTime: string,
  ): DemoSlot[] => {
    const now = getParisNow()
    const currentMinutes = now.hour * 60 + now.minute
    const first = createParisDate(now.year, now.month, now.day)
    const daysUntilThursday = (4 - first.getUTCDay() + 7) % 7
    first.setUTCDate(first.getUTCDate() + daysUntilThursday)

    // If today is the demo day but the start time has passed, skip to next week.
    if (daysUntilThursday === 0) {
      const todayTime = getWeekTime(first, evenWeekTime, oddWeekTime)
      if (currentMinutes >= parseTimeToMinutes(todayTime)) {
        first.setUTCDate(first.getUTCDate() + 7)
      }
    }

    const slots: DemoSlot[] = []
    for (let index = 0; index < Math.max(slotCount, 1); index++) {
      const date = new Date(first)
      date.setUTCDate(first.getUTCDate() + index * 7)
      slots.push({
        value: formatSlotValue(date),
        label: formatSlotLabel(date, getWeekTime(date, evenWeekTime, oddWeekTime)),
      })
    }
    return slots
  }

  const modalHtml = (): string => {
    const slots = buildUpcomingThursdaySlots(DEFAULT_SLOT_COUNT, DEFAULT_EVEN_WEEK_TIME, DEFAULT_ODD_WEEK_TIME)
    const dateOptions =
      '<option value="">Choose a date</option>' +
      slots.map((s) => '<option value="' + s.value + '">' + s.label + "</option>").join("")
    const typeOptions =
      '<option value="">Company type</option>' +
      COMPANY_TYPES.map((t) => '<option value="' + t + '">' + t + "</option>").join("")

    return (
      "" +
      '<div class="nl-backdrop" data-weekly-close></div>' +
      '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="wk-title">' +
        '<button class="nl-x" type="button" data-weekly-close aria-label="Close">×</button>' +
        '<span class="kicker">Weekly product demo</span>' +
        '<h3 id="wk-title">Join our free weekly demo.</h3>' +
        "<p>Every Thursday we run a live product demonstration via Teams. Sign up and we’ll send you the invite.</p>" +
        '<form class="nl-form nl-form-stack" id="mauticform_weeklyproductdemo" method="post" novalidate>' +
          '<input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" />' +
          '<input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" />' +
          '<input class="nl-input" type="email" name="mauticform[email]" placeholder="Work email" required aria-label="Work email" />' +
          '<select class="nl-input nl-select" name="mauticform[date]" required aria-label="Date">' + dateOptions + "</select>" +
          '<input class="nl-input" type="text" name="mauticform[company]" placeholder="Company" required aria-label="Company" />' +
          '<select class="nl-input nl-select" name="mauticform[company_type]" aria-label="Company type">' + typeOptions + "</select>" +
          '<textarea class="nl-input nl-textarea" name="mauticform[anything_in_particular_yo]" placeholder="Anything particular you want to see? (optional)" aria-label="Notes"></textarea>' +
          '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" name="mauticform[webinar_consent][]" value="true" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
          '<div class="nl-hcap" data-hcap></div>' +
          '<span class="nl-err" data-err></span>' +
          '<input type="hidden" name="mauticform[formId]" value="12">' +
          '<input type="hidden" name="mauticform[formName]" value="weeklyproductdemo">' +
          '<input type="hidden" name="mauticform[submit]" value="1">' +
          '<button class="btn btn-primary nl-btn" type="submit">Sign up</button>' +
        "</form>" +
      "</div>"
    )
  }

  STForms.weekly = function (): void {
    if (!window.STMautic) return

    const pop = document.createElement("div")
    pop.className = "nl-pop"
    pop.innerHTML = modalHtml()
    document.body.appendChild(pop)

    const form = pop.querySelector<HTMLFormElement>(".nl-form")
    if (!form) return

    const close = (): void => {
      pop.classList.remove("open")
    }

    const ctrl = window.STMautic.wire({
      form,
      submitBtn: form.querySelector<HTMLButtonElement>(".nl-btn"),
      consent: form.querySelector<HTMLInputElement>(".nl-consent-box"),
      hcap: form.querySelector<HTMLElement>("[data-hcap]"),
      error: form.querySelector<HTMLElement>("[data-err]"),
      // Match the try repo: on success, land the visitor on the thank-you page.
      onSuccess: () => {
        window.location.assign(THANK_YOU_PATH)
      },
    })

    const open = (e?: Event): void => {
      if (e) e.preventDefault()
      pop.classList.add("open")
      if (ctrl) void ctrl.renderCaptcha()
      const first = pop.querySelector<HTMLInputElement>(".nl-input")
      if (first) window.setTimeout(() => first.focus(), 60)
    }

    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target || !target.closest) return
      if (target.closest("[data-weekly-open]")) open(e)
      if (target.closest("[data-weekly-close]")) close()
    })

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    })
  }
})()

export {}
