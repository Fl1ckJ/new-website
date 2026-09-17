/* ============================================================
   SteelTrace — live mirror of status.steeltrace.io
   Drop a mount point anywhere:  <div data-steeltrace-status></div>
   …then load this one script. It injects its own scoped CSS,
   reads https://status.steeltrace.io/index.json and re-polls
   every 60s (the feed is pull-only — Better Stack has no push).

   Verified 2026-09-17:
     • index.json sends  access-control-allow-origin: *   -> no proxy needed
     • Accept is a CORS-safelisted header                 -> no preflight
   Styling mirrors status.steeltrace.io (Better Stack theme):
     Inter/Poppins, #fafafa ground, Polaris status palette.
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = {
    URL: "https://status.steeltrace.io/index.json",
    REFRESH_MS: 60000,
    PAGE: "https://status.steeltrace.io"
  };

  /* ---- palette lifted from status.steeltrace.io/css/brand.min.css ---- */
  var CSS = ''
    + '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap");'
    + '.stl{--ok:#50b83c;--ok-tx:#21b062;--deg:#f49342;--down:#de3618;--maint:#5f59f7;--none:#454f5b;'
    + '--ground:#fafafa;--ink:#424761;--title:#222b35;--gray:#8186a2;--line:rgba(191,194,212,.3);'
    + '--sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
    + '--head:"Poppins","Inter",sans-serif;'
    + 'display:block;background:var(--ground);font-family:var(--sans);font-weight:500;'
    + 'color:var(--ink);line-height:1.5;text-align:left;padding:8px 0 0}'
    + '.stl *{box-sizing:border-box}'
    /* overview */
    + '.stl__overview{text-align:center;padding:1rem 0 3rem}'
    + '.stl__icon{width:88px;height:88px;margin:0 auto 22px;border-radius:50%;display:grid;place-items:center;color:#fff}'
    + '.stl__icon svg{width:46px;height:46px}'
    + '.stl__title{font-family:var(--head);font-weight:700;font-size:2rem;line-height:1.2;color:var(--title);margin:0}'
    + '.stl__sub{font-size:.875rem;color:var(--gray);margin:10px 0 0;font-weight:400}'
    /* section card */
    + '.stl__card{background:#fff;border:1px solid var(--line);border-radius:5px;margin-bottom:2rem}'
    + '.stl__card-h{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;'
    + 'padding:1.1rem 1.5rem;background:rgba(0,0,0,.03);border-bottom:1px solid var(--line);border-radius:4px 4px 0 0}'
    + '.stl__card-t{font-family:var(--head);font-weight:600;font-size:1rem;color:var(--title)}'
    + '.stl__legend{display:flex;gap:10px;align-items:center}'
    + '.stl__lg{width:17px;height:17px;color:#c3c7d6}'
    + '.stl__lg svg{width:100%;height:100%;display:block}'
    /* rows */
    + '.stl__row{padding:1.4rem 1.5rem;border-bottom:1px solid var(--line)}'
    + '.stl__row:last-child{border-bottom:0}'
    + '.stl__row-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}'
    + '.stl__name{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:600;color:var(--title);min-width:0}'
    + '.stl__name span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.stl__ico{width:17px;height:17px;flex:none;display:block}'
    + '.stl__up{font-size:.875rem;color:var(--gray);font-weight:400;font-variant-numeric:tabular-nums;flex:none}'
    + '.stl__bars{display:flex;gap:2px;height:34px}'
    + '.stl__bar{flex:1 1 0;min-width:0;border-radius:2px;background:var(--none);transition:opacity .12s}'
    + '.stl__bar:hover{opacity:.7}'
    + '.stl__scale{display:flex;justify-content:space-between;margin-top:9px;font-size:.75rem;color:var(--gray);font-weight:400}'
    /* footer */
    + '.stl__foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;'
    + 'margin-top:1rem;font-size:.8rem;color:var(--gray);font-weight:400}'
    + '.stl__foot a{color:var(--ink);text-decoration:none}'
    + '.stl__foot a:hover{text-decoration:underline}'
    + '.stl--operational{background:var(--ok)}.stl--degraded{background:var(--deg)}'
    + '.stl--downtime{background:var(--down)}.stl--maintenance{background:var(--maint)}'
    + '.stl--nodata{background:var(--none)}'
    + '.stl__err{text-align:center;padding:24px 0;font-size:.875rem;color:var(--gray)}'
    /* tooltip — lives on <body>, so every value here is literal, never var() */
    + '.stl__tip{position:fixed;z-index:60;pointer-events:none;opacity:0;transition:opacity .1s;'
    + 'background:#2b3038;color:#fff;padding:9px 13px;border-radius:7px;'
    + 'font:500 13px/1.45 "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
    + 'text-align:center;white-space:nowrap;box-shadow:0 6px 20px rgba(2,10,20,.25)}'
    + '.stl__tip i{display:block;font-style:normal;font-weight:400;opacity:.85;font-size:12.5px;margin-top:2px}'
    + '@media (max-width:600px){.stl__title{font-size:1.5rem}.stl__card-h,.stl__row{padding-left:1.1rem;padding-right:1.1rem}}'
    + '@media (prefers-reduced-motion:reduce){.stl__bar{transition:none}}';

  var LABEL = { operational:"Operational", degraded:"Degraded", downtime:"Downtime", maintenance:"Maintenance" };
  /* Wording taken from status.steeltrace.io. Only the operational string is
     verified against the live page — the page has been green throughout. */
  var HEADLINE = {
    operational:"All services are online", degraded:"Some services are degraded",
    downtime:"Some services are down", maintenance:"Under maintenance"
  };
  var TINT = { operational:"80,184,60", degraded:"244,147,66", downtime:"222,54,24", maintenance:"95,89,247" };

  var ICON = {
    operational:'<path d="M20 6L9 17l-5-5"/>',
    degraded:'<path d="M12 8v5"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/>',
    downtime:'<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
    maintenance:'<path d="M14.7 6.3a4 4 0 0 1-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5z"/>'
  };

  var SVG = {
    operational:'<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8 12.4l2.6 2.6L16 9.6" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>',
    degraded:'<path d="M12 3.2l9 15.6H3z" fill="currentColor"/><path d="M12 9v4M12 16h.01" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    downtime:'<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8 12h8" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/>',
    maintenance:'<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M14.5 8.5a3.2 3.2 0 0 0-4.3 4.1l-2.4 2.4 1.6 1.6 2.4-2.4a3.2 3.2 0 0 0 4.1-4.3l-1.6 1.6-1.4-1.4z" fill="#fff"/>',
    nodata:'<circle cx="12" cy="12" r="9.3" fill="none" stroke="currentColor" stroke-width="2"/>'
  };
  var TXTCOL = { operational:"#50b83c", degraded:"#f49342", downtime:"#de3618", maintenance:"#5f59f7", nodata:"#c3c7d6" };
  function icon(state, size){
    var c = cls(state);
    return '<svg class="stl__ico" style="width:' + size + 'px;height:' + size + 'px;color:' + TXTCOL[c] + '" viewBox="0 0 24 24">' + SVG[c] + '</svg>';
  }

  var mounts = [], strips = [], tip = null, last = null;

  function cls(s){ return LABEL[s] ? s : "nodata"; }
  function pct(v){
    if (v === null || v === undefined || isNaN(v)) return "—";
    v = Number(v); v = v <= 1 ? v * 100 : v;
    return (v >= 100 ? "100" : v.toFixed(3).replace(/0+$/,"").replace(/\.$/,"")) + "%";
  }
  function nameOf(n){ return String(n || "Service").replace(/^https?:\/\//,"").replace(/\/$/,""); }
  function day(d, opts){
    try { return new Date(d + "T00:00:00").toLocaleDateString(undefined,
      opts || { day:"numeric", month:"short", year:"numeric" }); }
    catch (e) { return d; }
  }
  /* Better Stack returns 90 buckets spanning ~1 year, i.e. ~4 days each —
     not 90 single days. Label each bar with the range it actually covers. */
  function bucketLabel(hist, i){
    var from = hist[i].day, next = hist[i+1] && hist[i+1].day, to;
    if (next) {
      var d = new Date(next + "T00:00:00"); d.setDate(d.getDate() - 1);
      to = d.toISOString().slice(0,10);
    } else { to = new Date().toISOString().slice(0,10); }
    return from === to ? day(from) : day(from, { day:"numeric", month:"short" }) + " – " + day(to);
  }
  function spanDays(hist){
    if (!hist || hist.length < 2) return 0;
    var a = new Date(hist[0].day + "T00:00:00"), b = new Date();
    return Math.round((b - a) / 864e5);
  }
  function spanLabel(n){
    if (n >= 330) return "1 year";
    if (n >= 60)  return Math.round(n / 30) + " months";
    return n + " days";
  }
  function dur(s){
    s = Number(s) || 0;
    if (s <= 0) return null;
    if (s < 90) return Math.round(s) + "s";
    if (s < 5400) return Math.round(s / 60) + " min";
    return (s / 3600).toFixed(1) + " h";
  }

  function drawBars(entry){
    var el = entry.el, hist = entry.history || [];
    var n = Math.max(30, Math.min(hist.length, Math.floor((el.clientWidth || 640) / 6)));
    var days = hist.slice(-n), frag = document.createDocumentFragment();
    days.forEach(function (d) {
      var b = document.createElement("div");
      b.className = "stl__bar stl--" + cls(d.status);
      var extra = [dur(d.downtime_duration) && dur(d.downtime_duration) + " down",
                   dur(d.maintenance_duration) && dur(d.maintenance_duration) + " maintenance"]
                  .filter(Boolean).join(" · ");
      b.setAttribute("data-tip", bucketLabel(days, days.indexOf(d)) + "|" + (LABEL[d.status] || d.status) + (extra ? " · " + extra : ""));
      frag.appendChild(b);
    });
    el.innerHTML = ""; el.appendChild(frag);
  }

  function render(json){
    var attrs = (json.data && json.data.attributes) || {};
    var inc = json.included || [];
    var agg = attrs.aggregate_state || "operational";

    var sections = inc.filter(function (i) { return i.type === "status_page_section"; })
      .map(function (s) { return { id:String(s.id), name:(s.attributes||{}).name||"", pos:(s.attributes||{}).position||0 }; })
      .sort(function (a,b) { return a.pos - b.pos; });

    var resources = inc.filter(function (i) { return i.type === "status_page_resource"; })
      .map(function (r) {
        var a = r.attributes || {};
        return { name:a.public_name, status:a.status, availability:a.availability,
                 history:a.status_history || [], sec:String(a.status_page_section_id), pos:a.position||0 };
      });

    var groups = sections.map(function (s) {
      return { name:s.name, items:resources.filter(function (r) { return r.sec === s.id; })
        .sort(function (a,b) { return a.pos - b.pos; }) };
    }).filter(function (g) { return g.items.length; });
    var claimed = {};
    groups.forEach(function (g) { g.items.forEach(function (r) { claimed[r.name] = 1; }); });
    var rest = resources.filter(function (r) { return !claimed[r.name]; });
    if (rest.length) groups.push({ name:"", items:rest });

    var html = ''
      + '<div class="stl__overview">'
      +   '<div class="stl__icon" style="background:' + (TXTCOL[cls(agg)] || "#c3c7d6") + '">'
      +     '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
      +     (ICON[agg] || ICON.operational) + '</svg>'
      +   '</div>'
      +   '<h2 class="stl__title">' + (HEADLINE[agg] || LABEL[agg] || "Status unknown") + '</h2>'
      +   '<p class="stl__sub" data-stl-upd></p>'
      + '</div>';

    var legendIcons = ["operational","degraded","downtime","maintenance","nodata"].map(function (st) {
      return '<span class="stl__lg" title="' + (LABEL[st] || "Not monitored") + '">'
           + '<svg viewBox="0 0 24 24">' + SVG[st] + '</svg></span>';
    }).join("");

    groups.forEach(function (g) {
      html += '<div class="stl__card">'
           +   '<div class="stl__card-h"><b class="stl__card-t">' + esc(g.name || "Services") + '</b>'
           +   '<span class="stl__legend">' + legendIcons + '</span></div>';
      g.items.forEach(function (r) {
        html += '<div class="stl__row">'
             +   '<div class="stl__row-top">'
             +     '<span class="stl__name">' + icon(r.status, 17) + '<span>' + esc(r.name || "Service") + '</span></span>'
             +     '<span class="stl__up">' + pct(r.availability) + ' uptime</span>'
             +   '</div>'
             +   '<div class="stl__bars" role="img" aria-label="' + esc(nameOf(r.name)) + ' — '
             +     pct(r.availability) + ' uptime over the last ' + spanLabel(spanDays(r.history)) + '"></div>'
             + '</div>';
      });
      html += '</div>';
    });

    var hist0 = resources.length ? (resources[0].history || []) : [];
    html += '<div class="stl__foot">'
         +   '<span>Live mirror of <a href="' + CONFIG.PAGE + '" target="_blank" rel="noopener">status.steeltrace.io</a>'
         +   (hist0.length ? ' · ' + spanLabel(spanDays(hist0)) + ' of history' : '') + '</span>'
         +   '<span>refreshes every 60s</span>'
         + '</div>';

    mounts.forEach(function (m) {
      m.innerHTML = html;
      strips = [];
      var bars = m.querySelectorAll(".stl__bars"), k = 0;
      groups.forEach(function (g) { g.items.forEach(function (r) {
        if (bars[k]) strips.push({ el:bars[k], history:r.history });
        k++;
      }); });
      strips.forEach(drawBars);
    });
    last = Date.now();
    stamp();
  }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function stamp(){
    if (!last) return;
    var d = new Date(last);
    var date = d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    var time = d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" })
                 .replace(" AM","am").replace(" PM","pm").replace(/^0/,"");
    var tz = (new Intl.DateTimeFormat(undefined, { timeZoneName:"short" })
                .formatToParts(d).find(function (x) { return x.type === "timeZoneName"; }) || {}).value || "";
    var txt = "Last updated " + date + " at " + time + (tz ? " " + tz : "");
    mounts.forEach(function (m) {
      var el = m.querySelector("[data-stl-upd]");
      if (el) el.textContent = txt;
    });
  }

  function fail(){
    if (last) return;                                  // keep the last good render
    mounts.forEach(function (m) {
      m.innerHTML = '<div class="stl__err">Live status is unavailable right now — '
        + '<a href="' + CONFIG.PAGE + '" target="_blank" rel="noopener">open status.steeltrace.io</a></div>';
    });
  }

  function load(){
    fetch(CONFIG.URL + "?_=" + Date.now(), { cache:"no-store", headers:{ Accept:"application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(render)
      .catch(function (e) { if (window.console) console.warn("[status] " + e.message); fail(); });
  }

  function boot(){
    mounts = [].slice.call(document.querySelectorAll("[data-steeltrace-status]"));
    if (!mounts.length) return;
    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    mounts.forEach(function (m) { m.classList.add("stl"); });

    tip = document.createElement("div");
    tip.className = "stl__tip";
    document.body.appendChild(tip);

    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains("stl__bar")) return;
      var p = (t.getAttribute("data-tip") || "").split("|");
      tip.innerHTML = esc(p[0]) + "<i>" + esc(p[1] || "") + "</i>";
      tip.style.opacity = "1"; move(e);
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target && e.target.classList && e.target.classList.contains("stl__bar")) tip.style.opacity = "0";
    });
    function move(e){
      var r = e.target.getBoundingClientRect();
      var x = r.left + r.width / 2 - tip.offsetWidth / 2;
      var y = r.top - tip.offsetHeight - 9;
      if (y < 6) y = r.bottom + 9;
      x = Math.max(6, Math.min(x, innerWidth - tip.offsetWidth - 6));
      tip.style.left = x + "px"; tip.style.top = y + "px";
    }

    var rz;
    addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { strips.forEach(drawBars); }, 160); });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") load(); });
    setInterval(stamp, 5000);
    setInterval(load, CONFIG.REFRESH_MS);
    load();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
