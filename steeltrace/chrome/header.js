/* SteelTrace chrome — site header (top nav).
   Registers window.STChrome.header(page) → returns the header markup.
   `page` marks the active nav item (home / solutions / prod / about / blog). */
(function () {
  "use strict";
  window.STChrome = window.STChrome || {};

  var caret =
    '<span class="caret"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';

  var SUPPLY = [
    ["Operators", "op"],
    ["EPC Contractors", "epc"],
    ["Welding &amp; NDT Contractors", "wld"],
    ["Manufacturers &amp; Material Suppliers", "mfg"],
    ["Testing &amp; Inspection Companies", "ndt"]
  ];
  var ROLE = [
    ["Executive Leadership", "exec"],
    ["QA / QC", "qaqc"],
    ["Project Management", "pm"],
    ["Operations &amp; Asset Integrity", "ops"],
    ["Digital Transformation", "dig"]
  ];
  var PRODUCT = [
    ["Rigid pipelines", "rigid"],
    ["Reeled pipelines", "reeled"],
    ["Flexible pipelines", "flex"],
    ["Bundle pipelines", "bundle"],
    ["Fitting &amp; Flanges", "fittings"]
  ];
  function ddLink(item) { return '<a class="dd-link" href="solution-' + item[1] + '.html">' + item[0] + "</a>"; }
  function ddLinkProduct(item) { return '<a class="dd-link" href="product-' + item[1] + '.html">' + item[0] + "</a>"; }

  window.STChrome.header = function (page) {
    function a(k) { return page === k ? " active" : ""; }
    return '' +
      '<a class="brand" href="SteelTrace%20Home.html">' +
        '<img class="brand-logo" src="https://steeltrace.co/wp-content/themes/steeltrace/images/logo_white.svg" alt="SteelTrace" onerror="window.__stBrand&&window.__stBrand(this)" />' +
      '</a>' +
      '<nav class="nav-links">' +
        '<a class="nav-link' + a("home") + '" href="SteelTrace%20Home.html">Home</a>' +
        '<div class="nav-dd">' +
          '<button class="nav-link' + a("solutions") + '" type="button" aria-haspopup="true">Solutions ' + caret + '</button>' +
          '<div class="nav-dd-menu mega" role="menu">' +
            '<div class="dd-col"><div class="dd-col-head">By Company Type</div>' + SUPPLY.map(ddLink).join("") + '</div>' +
            '<div class="dd-col"><div class="dd-col-head">By Stakeholder Type</div>' + ROLE.map(ddLink).join("") + '</div>' +
            '<div class="dd-col"><div class="dd-col-head">By Product Type</div>' + PRODUCT.map(ddLinkProduct).join("") + '</div>' +
          '</div>' +
        '</div>' +
        '<a class="nav-link' + a("prod") + '" href="Product.html">Product</a>' +
        '<div class="nav-dd">' +
          '<button class="nav-link' + a("about") + '" type="button" aria-haspopup="true">About Us ' + caret + '</button>' +
          '<div class="nav-dd-menu" role="menu">' +
            '<a class="dd-item" href="about.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M11 12h1v4h1"/></svg></span><span class="dd-tx"><b>About SteelTrace</b><span>Mission, vision &amp; what we build</span></span></a>' +
            '<div class="dd-sep"></div>' +
            '<a class="dd-item" href="careers.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span><span class="dd-tx"><b>Careers</b><span>Join the team</span></span></a>' +
            '<div class="dd-sep"></div>' +
            '<a class="dd-item" href="contact.html"><span class="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg></span><span class="dd-tx"><b>Contact</b><span>Talk to us</span></span></a>' +
          '</div>' +
        '</div>' +
        '<a class="nav-link' + a("blog") + '" href="blog.html">Blog</a>' +
      '</nav>' +
      '<div class="nav-actions">' +
        '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle light or dark theme">' +
          '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
          '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '</button>' +
        '<a class="nav-login" href="https://steeltrace.io/login" target="_blank" rel="noopener">Login</a>' +
        '<a class="nav-cta" href="demo.html">Book a demo <span class="cta-arrow">→</span></a>' +
      '</div>';
  };
})();
