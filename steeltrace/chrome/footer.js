/* SteelTrace chrome — site footer.
   Registers window.STChrome.footer() → returns the footer markup. */
(function () {
  "use strict";
  window.STChrome = window.STChrome || {};

  window.STChrome.footer = function () {
    return '' +
      '<div class="foot-inner">' +
        '<div class="foot-brand">' +
          '<a class="brand" href="SteelTrace%20Home.html"><img class="brand-logo" src="https://steeltrace.co/wp-content/themes/steeltrace/images/logo_white.svg" alt="SteelTrace" onerror="window.__stBrand&&window.__stBrand(this)" /></a>' +
          '<p class="foot-blurb">Connecting the energy supply chain through Smart Manufacturing Records — verified data, end-to-end traceability, lifecycle value.</p>' +
        '</div>' +
        '<div class="foot-col"><h4>Platform</h4><a href="Product.html">Product</a><a href="How%20It%20Works.html">How It Works</a></div>' +
        '<div class="foot-col"><h4>Company</h4><a href="about.html">About SteelTrace</a><a href="careers.html">Careers</a><a href="blog.html">Blog</a><a href="contact.html">Contact</a></div>' +
        '<div class="foot-col"><h4>Get started</h4><a href="demo.html">Book a demo</a><a href="https://steeltrace.io/login" target="_blank" rel="noopener">Login to SteelTrace</a><a href="#newsletter" data-newsletter-open>Newsletter</a><a href="#brochure" data-brochure-open>Get a brochure</a></div>' +
      '</div>' +
      '<div class="foot-bottom"><span class="mono-note">© 2026 SteelTrace</span><span class="mono-note"><a class="foot-legal" href="privacy-policy.html">Privacy Statement</a></span><span class="mono-note"><a class="foot-legal" href="disclaimer.html">Disclaimer</a></span><span class="mono-note"><a class="foot-legal" href="#cookies" data-cookie-open>Change Cookie Consent</a></span><span class="mono-note">Smart Manufacturing Records · safety-critical industries</span></div>';
  };
})();
