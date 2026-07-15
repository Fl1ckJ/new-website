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
    ["S-Lay &amp; J-Lay pipelines", "rigid"],
    ["Onshore pipelines", "onshore"],
    ["Reeled pipelines", "reeled"],
    ["Flexible pipelines &amp; Umbilicals", "flex"],
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
        '<a class="nav-login" href="https://steeltrace.io/login" target="_blank" rel="noopener">Login</a>' +
        '<a class="nav-cta" href="demo.html">Book a demo <span class="cta-arrow">→</span></a>' +
      '</div>' +
      '<button class="nav-burger" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '</button>' +
      '<nav class="mnav" data-mnav aria-label="Menu">' +
        '<a class="nav-link' + a("home") + '" href="SteelTrace%20Home.html">Home</a>' +
        '<div class="mnav-sec"><span class="mnav-h">Solutions</span>' +
          '<span class="mnav-sub">By Company Type</span>' + SUPPLY.map(ddLink).join("") +
          '<span class="mnav-sub">By Stakeholder Type</span>' + ROLE.map(ddLink).join("") +
          '<span class="mnav-sub">By Product Type</span>' + PRODUCT.map(ddLinkProduct).join("") +
        '</div>' +
        '<a class="nav-link' + a("prod") + '" href="Product.html">Product</a>' +
        '<a class="nav-link" href="How%20It%20Works.html">How It Works</a>' +
        '<div class="mnav-sec"><span class="mnav-h">Company</span>' +
          '<a href="about.html">About SteelTrace</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a>' +
        '</div>' +
        '<a class="nav-link' + a("blog") + '" href="blog.html">Blog</a>' +
        '<div class="mnav-foot">' +
          '<a class="nav-login" href="https://steeltrace.io/login" target="_blank" rel="noopener">Login</a>' +
          '<a class="nav-cta" href="demo.html">Book a demo <span class="cta-arrow">→</span></a>' +
        '</div>' +
      '</nav>';
  };
})();
