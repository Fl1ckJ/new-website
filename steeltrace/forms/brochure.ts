/* ============================================================
   SteelTrace forms — Product brochure (Mautic form 10).

   TypeScript source. Compiled to brochure.js (classic browser
   script) which chrome.js loads. Mirrors the try repo's
   productBrochureForm.ts: identical Mautic field set (incl. the
   consent field the backend expects) and submit-then-redirect
   behaviour, reusing the shared window.STMautic engine.

   Rebuild after editing:
     npx esbuild steeltrace/forms/brochure.ts \
       --bundle --format=iife --target=es2017 \
       --outfile=steeltrace/forms/brochure.js
   Trigger:  [data-brochure-open]   Close: [data-brochure-close]
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

// Relative path (all pages live at the site root, like the try repo's
// form/message/ page) so the redirect works from any host / base URL.
const THANK_YOU_PATH = "form/message/"

;(function () {
  "use strict"
  const STForms: Record<string, () => void> = (window.STForms = window.STForms || {})

  const modalHtml = (): string =>
    "" +
    '<div class="nl-backdrop" data-brochure-close></div>' +
    '<div class="nl-modal" role="dialog" aria-modal="true" aria-labelledby="br-title">' +
      '<button class="nl-x" type="button" data-brochure-close aria-label="Close">×</button>' +
      '<span class="kicker">Product brochure</span>' +
      '<h3 id="br-title">Get the SteelTrace brochure.</h3>' +
      "<p>Learn more about the SteelTrace products and services. We will send the brochure to your inbox.</p>" +
      '<form class="nl-form nl-form-stack" id="mauticform_downloadtheproductbrochure" method="post" novalidate>' +
        '<input class="nl-input" type="text" name="mauticform[first_name]" placeholder="First name" required aria-label="First name" />' +
        '<input class="nl-input" type="text" name="mauticform[last_name]" placeholder="Last name" required aria-label="Last name" />' +
        '<input class="nl-input" type="email" name="mauticform[business_email]" placeholder="Work email" required aria-label="Work email" />' +
        '<label class="nl-consent"><input type="checkbox" class="nl-consent-box" name="mauticform[consent][]" value="yes" /> <span>I consent to SteelTrace processing my data as per the <a href="privacy-policy.html" target="_blank" rel="noopener">privacy statement</a>.</span></label>' +
        '<div class="nl-hcap" data-hcap></div>' +
        '<span class="nl-err" data-err></span>' +
        '<input type="hidden" name="mauticform[formId]" value="10">' +
        '<input type="hidden" name="mauticform[formName]" value="downloadtheproductbrochure">' +
        '<input type="hidden" name="mauticform[submit]" value="1">' +
        '<button class="btn btn-primary nl-btn" type="submit">Get the brochure</button>' +
      "</form>" +
    "</div>"

  STForms.brochure = function (): void {
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
      if (target.closest("[data-brochure-open]")) open(e)
      if (target.closest("[data-brochure-close]")) close()
    })

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    })
  }
})()

export {}
