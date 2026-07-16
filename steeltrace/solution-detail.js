(function () {
  "use strict";
  var S = window.STEELTRACE_SOLUTIONS;
  var el = document.getElementById("detail");
  if (!S || !el) return;
  var e = S.esc;

  function param(n) { return new URLSearchParams(location.search).get(n); }

  // ---- stakeholder hero backdrops (line-art motifs matching the home cards) ----
  var VB = 'viewBox="0 0 1440 480" preserveAspectRatio="xMidYMid slice" fill="none"';
  var ROLE_HERO = {
    exec: {
      bg: 'radial-gradient(125% 130% at 50% 6%, #1a222e 0%, #0d131d 54%, #070b12 100%)',
      svg: '<svg ' + VB + '>' +
        '<g stroke="#9aa4b2" stroke-opacity=".5">' +
          '<path d="M900 330 A230 230 0 0 1 1360 330" stroke-width="11" stroke-linecap="round"/>' +
        '</g>' +
        '<g stroke="#aeb8c2" stroke-opacity=".42" stroke-width="3" stroke-linecap="round">' +
          '<path d="M896 330 L872 330"/><path d="M950 176 L933 159"/><path d="M1130 118 L1130 94"/><path d="M1310 176 L1327 159"/><path d="M1364 330 L1388 330"/>' +
        '</g>' +
        '<path d="M1130 330 L1250 165" stroke="#c9d0d8" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="1130" cy="330" r="10" fill="#c9d0d8" fill-opacity=".5"/>' +
        '<polyline points="70,430 210,405 350,418 490,352 630,384" stroke="#8a94a2" stroke-opacity=".42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g fill="#aeb8c2" fill-opacity=".5"><circle cx="70" cy="430" r="5"/><circle cx="210" cy="405" r="5"/><circle cx="350" cy="418" r="5"/><circle cx="490" cy="352" r="5"/><circle cx="630" cy="384" r="5"/></g>' +
        '</svg>'
    },
    qaqc: {
      bg: 'radial-gradient(125% 130% at 50% 6%, #0e2b28 0%, #0a1c1a 54%, #061210 100%)',
      svg: (function () {
        var c = '#57e0c8', op = '.26', s = '';
        function grid(ox, oy, checks) {
          var cell = 74, gap = 8, step = cell + gap;
          for (var r = 0; r < 3; r++) for (var col = 0; col < 3; col++) {
            var x = ox + col * step, y = oy + r * step;
            s += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" rx="12" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="3"/>';
            if (checks[r * 3 + col]) s += '<path d="M' + (x + 20) + ' ' + (y + 40) + ' L' + (x + 33) + ' ' + (y + 53) + ' L' + (x + 56) + ' ' + (y + 20) + '" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
          }
        }
        grid(70, 70, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
        grid(1116, 60, [0, 0, 1, 1, 0, 0, 0, 1, 0]);
        var cx = 1260, cy = 208;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="52" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="3"/>';
        s += '<path d="M' + cx + ' ' + (cy - 68) + ' L' + cx + ' ' + (cy + 68) + ' M' + (cx - 68) + ' ' + cy + ' L' + (cx + 68) + ' ' + cy + '" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="3" stroke-linecap="round"/>';
        return '<svg ' + VB + '>' + s + '</svg>';
      })()
    },
    pm: {
      bg: 'radial-gradient(125% 130% at 50% 6%, #13224a 0%, #0c1330 54%, #080d1e 100%)',
      svg: (function () {
        var bar = '#5b82f5', trk = 'rgba(146,168,236,.14)', dia = '#9db4ff', s = '';
        function gantt(ox, oy, rows, guide) {
          rows.forEach(function (b, i) {
            var y = oy + i * 34;
            s += '<rect x="' + (ox + b[0]) + '" y="' + y + '" width="' + b[2] + '" height="16" rx="8" fill="' + trk + '"/>';
            s += '<rect x="' + (ox + b[0]) + '" y="' + y + '" width="' + b[1] + '" height="16" rx="8" fill="' + bar + '" fill-opacity=".5"/>';
          });
          s += '<path d="M' + guide + ' ' + (oy - 14) + ' L' + guide + ' ' + (oy + rows.length * 34 + 4) + '" stroke="rgba(157,180,255,.4)" stroke-width="2" stroke-dasharray="5 5"/>';
          s += '<path d="M' + (guide - 8) + ' ' + (oy - 20) + ' L' + (guide + 8) + ' ' + (oy - 20) + ' L' + guide + ' ' + (oy - 8) + ' Z" fill="' + dia + '" fill-opacity=".55"/>';
        }
        gantt(120, 70, [[0, 300, 460], [80, 300, 470], [40, 240, 400]], 500);
        gantt(880, 300, [[0, 300, 470], [90, 260, 440]], 1220);
        return '<svg ' + VB + '>' + s + '</svg>';
      })()
    },
    ops: {
      bg: 'radial-gradient(125% 130% at 50% 8%, #0e2a19 0%, #081c11 54%, #04120a 100%)',
      svg: (function () {
        var c = '#57e08a', s = '';
        function radar(cx, cy) {
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="200" stroke="' + c + '" stroke-opacity=".14" stroke-width="2"/>';
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="130" stroke="' + c + '" stroke-opacity=".2" stroke-width="2"/>';
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="62" stroke="' + c + '" stroke-opacity=".28" stroke-width="2"/>';
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + c + '" fill-opacity=".4"/>';
        }
        radar(300, 235);
        radar(1230, 205);
        s += '<polyline points="0,340 440,340 500,340 540,250 590,440 640,214 690,360 740,340 940,340 1050,340 1110,262 1160,410 1210,340 1440,340" stroke="' + c + '" stroke-opacity=".34" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
        return '<svg ' + VB + '>' + s + '</svg>';
      })()
    },
    dig: {
      bg: 'radial-gradient(125% 130% at 50% 8%, #2c1024 0%, #1a0a17 54%, #10060d 100%)',
      svg: (function () {
        var c = '#f078a4', s = '';
        function cluster(pts, lines, sq) {
          lines.forEach(function (l) { s += '<path d="M' + pts[l[0]][0] + ' ' + pts[l[0]][1] + ' L' + pts[l[1]][0] + ' ' + pts[l[1]][1] + '" stroke="' + c + '" stroke-opacity=".4" stroke-width="1.6"/>'; });
          pts.forEach(function (p, i) { if (i === sq) return; s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] || 7) + '" fill="' + c + '" fill-opacity=".62"/>'; });
          if (sq != null) s += '<rect x="' + (pts[sq][0] - 8) + '" y="' + (pts[sq][1] - 8) + '" width="16" height="16" rx="3" fill="' + c + '" fill-opacity=".62"/>';
        }
        var left = [[150, 150, 11], [360, 190, 5], [250, 300, 8], [330, 420, 7], [200, 400, 6], [420, 330, 5]];
        cluster(left, [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4], [1, 5], [2, 5], [3, 5]], 1);
        var right = [[1020, 170, 11], [1250, 210, 5], [1130, 300, 8], [1330, 360, 7], [1200, 440, 6], [1060, 380, 6]];
        cluster(right, [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [2, 5], [0, 5]], 3);
        return '<svg ' + VB + '>' + s + '</svg>';
      })()
    }
  };
  var sol = S.byId(window.STEELTRACE_SEG || param("seg")) || S.all[0];
  if (!sol) { el.innerHTML = '<div style="padding:80px 0;text-align:center"><h1 class="h1">Solution not found</h1><p style="margin-top:20px"><a class="btn btn-primary" href="/">← Home</a></p></div>'; return; }

  document.title = sol.name + ": SteelTrace Solutions";
  var groupLabel = sol.group === "supply" ? "Supply chain" : "By role";
  if (sol.strategy) el.classList.add("exec-page");

  var check = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var cross = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>';
  var star = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z"/></svg>';

  function liList(items, svg) {
    return '<div class="cn-list">' + items.map(function (t) {
      return '<div class="li">' + svg + '<span>' + e(t) + '</span></div>';
    }).join("") + '</div>';
  }
  var benIcons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.3-7 8.5C7.9 19.3 5 16.2 5 12V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>'
  ];
  function benefits(items) {
    return '<div class="ben-grid">' + items.map(function (b, i) {
      return '<div class="ben" style="animation-delay:' + (i * 0.07) + 's"><span class="ben-ic">' + benIcons[i % benIcons.length] + '</span><h3>' + e(b.t) + '</h3><p>' + e(b.d) + '</p></div>';
    }).join("") + '</div>';
  }

  var ckMini = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M20 6L9 17l-5-5"/></svg>';
  var xMini  = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M6 6l12 12M18 6L6 18"/></svg>';
  var ckBig = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var lockIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function win(variant) {
    var titles = { feed: "Live supplier data", verify: "Compliance to specification", chart: "Performance", doc: "Manufacturing record", trace: "Material traceability", sign: "Digital signature", connect: "Integrations" };
    var body = "", cls = "";
    if (variant === "chart") {
      cls = "sk-chart";
      var hs = [24, 40, 58, 80, 100, 90, 62, 38, 22];
      body = hs.map(function (h, i) { return '<i style="height:' + h + '%;--i:' + i + '"></i>'; }).join("");
    } else if (variant === "verify") {
      var rows = [{ w: 62, s: "ok" }, { w: 54, s: "ok" }, { w: 48, s: "err" }, { w: 58, s: "ok" }, { w: 52, s: "ok" }];
      body = rows.map(function (r, i) {
        return '<div class="sk-row" style="--r:' + i + '"><span class="sk-ck ' + r.s + '">' + (r.s === "err" ? xMini : ckMini) + '</span><span class="sk-bar" style="width:' + r.w + '%"></span></div>';
      }).join("");
    } else if (variant === "doc") {
      body = '<div class="mk-doc"><div class="mk-paper"><div class="mk-ph"></div><span class="ln" style="width:88%"></span><span class="ln" style="width:70%"></span><span class="ln" style="width:80%"></span><span class="ln" style="width:58%"></span><div class="mk-seal">' + ckBig + '</div></div></div>';
    } else if (variant === "trace") {
      body = '<div class="mk-trace"><div class="mk-rail"><i class="mk-prog"></i><div class="mk-nodes">' + [0,1,2,3,4].map(function(i){return '<span class="nd" style="--i:'+i+'"></span>';}).join("") + '</div></div><div class="mk-labels"><span>Melt</span><span>Pipe</span><span>Weld</span><span>NDT</span><span>Asset</span></div></div>';
    } else if (variant === "sign") {
      body = '<div class="mk-sign"><div class="mk-key">' + lockIcon + '<span class="mk-ring"></span></div><span class="mk-flow"></span><div class="mk-cert"><span class="cl" style="width:78%"></span><span class="cl" style="width:58%"></span><span class="cl" style="width:68%"></span><div class="mk-seal2">' + ckBig + '</div></div></div>';
    } else if (variant === "connect") {
      body = '<div class="mk-conn"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><line class="ln2" x1="50" y1="30" x2="16" y2="12"/><line class="ln2" x1="50" y1="30" x2="84" y2="12"/><line class="ln2" x1="50" y1="30" x2="16" y2="48"/><line class="ln2" x1="50" y1="30" x2="84" y2="48"/></svg><span class="mk-sat s1">MES</span><span class="mk-sat s2">ERP</span><span class="mk-sat s3">NDT</span><span class="mk-sat s4">LAB</span><span class="mk-core">STX</span><span class="mk-bit b1"></span><span class="mk-bit b2"></span><span class="mk-bit b3"></span><span class="mk-bit b4"></span></div>';
    } else {
      variant = "feed";
      var rs = [{ w: 58, s: "ok" }, { w: 50, s: "info" }, { w: 64, s: "ok" }, { w: 46, s: "warn" }, { w: 60, s: "ok" }, { w: 52, s: "info" }];
      body = '<span class="sk-scan"></span><div class="sk-row sk-head"><span class="sk-bar g" style="width:40%"></span></div>' + rs.map(function (r, i) {
        return '<div class="sk-row" style="--r:' + i + '"><span class="sk-bar" style="width:' + r.w + '%"></span><span class="sk-bar" style="width:20%"></span><span class="sk-dot ' + r.s + '"></span></div>';
      }).join("");
    }
    return '<div class="win"><div class="win-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="ttl">' + titles[variant] + '</span></div><div class="win-body' + (cls ? " " + cls : "") + '">' + body + '</div></div>';
  }
  function rankVariants(txt) {
    var s = (txt || "").toLowerCase().replace(/steeltrace/g, " ");
    var order = [];
    function add(v) { if (order.indexOf(v) < 0) order.push(v); }
    if (/\btrace|traceab|melt|lifecycle|provenance|custody|recovery|decommission|end product|chain of/.test(s)) add("trace");
    if (/sign|blockchain|cryptograph|immutable|approval|seal|endorse|witness|on-chain|ethereum|\beas\b/.test(s)) add("sign");
    if (/integrat|\bapi\b|connector|plugin|\bmes\b|\berp\b|architecture|interoper|cmms|edms|digital twin|enterprise/.test(s)) add("connect");
    if (/mrb|record book|\bsmr\b|manufacturing record|document|certificate|\bcert\b|report|overview|deliverable/.test(s)) add("doc");
    if (/verif|complian|valid|qcp|itp|\brule|audit|spec|conformance|automation/.test(s)) add("verify");
    if (/roi|value|efficien|result|yield|metric|outcome|cost|saving|priorit|case study|business case|pilot|\bmodel\b|use case/.test(s)) add("chart");
    if (/real.?time|live|visibility|stream|monitor|status|progress|inbox|collect/.test(s)) add("feed");
    // fill remaining variants as fallbacks so each solution shows distinct mockups
    ["doc", "verify", "feed", "chart", "connect", "trace", "sign"].forEach(add);
    return order;
  }
  function keyFeatures(items) {
    var used = {};
    var pickedVars = items.map(function (f) {
      var ranked = rankVariants(f.t + " " + (f.d || ""));
      var v = ranked[0];
      for (var k = 0; k < ranked.length; k++) { if (!used[ranked[k]]) { v = ranked[k]; break; } }
      used[v] = true;
      return v;
    });
    var list = items.map(function (f, i) {
      var n = (i + 1 < 10 ? "0" : "") + (i + 1);
      return '<button class="kfx-item' + (i === 0 ? ' active' : '') + '" type="button" role="tab" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
        '<span class="kfx-n">' + n + '</span>' +
        '<span class="kfx-tx"><b>' + e(f.t) + '</b></span>' +
        '<span class="kfx-ar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></span>' +
      '</button>';
    }).join("");
    var panels = items.map(function (f, i) {
      var n = (i + 1 < 10 ? "0" : "") + (i + 1);
      return '<div class="kfx-panel' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
        '<div class="kfx-viz">' + win(pickedVars[i]) + '</div>' +
        '<div class="kfx-meta"><span class="kfx-cap">Feature ' + n + '</span><h3>' + e(f.t) + '</h3><p>' + e(f.d) + '</p></div>' +
      '</div>';
    }).join("");
    return '<div class="kfx">' +
      '<div class="kfx-list" role="tablist">' + list + '</div>' +
      '<div class="kfx-stage"><div class="kfx-panels">' + panels + '</div></div>' +
    '</div>';
  }
  function strategy(st) {
    var icons = {
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.3-7 8.5C7.9 19.3 5 16.2 5 12V6z"/><path d="M9 12l2 2 4-4"/></svg>',
      scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-2.5 6h5z"/><path d="M19 7l-2.5 6h5z"/><path d="M8 21h8"/></svg>',
      bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V10M9.5 21V10M14.5 21V10M19 21V10"/><path d="M12 3l9 5H3z"/></svg>',
      cycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
      chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1.5v3M15 1.5v3M9 19.5v3M15 19.5v3M1.5 9h3M1.5 15h3M19.5 9h3M19.5 15h3"/></svg>',
      rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M12 15l-3-3c1-4 3.5-7.5 8-8 .5 4.5-3 7-8 8z"/><circle cx="14.5" cy="9.5" r="1.2"/><path d="M8 18c.5 1 1.5 1.5 1.5 1.5"/></svg>',
      gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19a9 9 0 1 1 16 0"/><path d="M12 14l4-4"/><circle cx="12" cy="14" r="1.2"/></svg>',
      alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/></svg>',
      eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
      hub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.6"/><circle cx="12" cy="4" r="1.8"/><circle cx="12" cy="20" r="1.8"/><circle cx="4" cy="12" r="1.8"/><circle cx="20" cy="12" r="1.8"/><path d="M12 9.4V5.8M12 18.2v-3.6M9.4 12H5.8M18.2 12h-3.6"/></svg>'
    };
    var tn = 0;
    function viz(k) {
      var V = {
        schedule:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Revenue pulled forward">' +
          '<text class="lbl" x="0" y="33">Paper</text>' +
          '<rect class="bar mut" x="120" y="22" width="456" height="14" rx="4"/><circle class="dot mut" cx="576" cy="29" r="6"/>' +
          '<text class="cap" x="120" y="54">handover takes months</text>' +
          '<text class="lbl" x="0" y="99">SteelTrace</text>' +
          '<rect class="bar acc" x="120" y="88" width="276" height="14" rx="4"/><circle class="dot acc" cx="396" cy="95" r="6"/>' +
          '<line class="ln acc" x1="576" y1="35" x2="576" y2="64" stroke-dasharray="3 3"/>' +
          '<line class="ln acc" x1="396" y1="64" x2="396" y2="88" stroke-dasharray="3 3"/>' +
          '<line class="ln acc" x1="576" y1="64" x2="404" y2="64"/><path class="fill-acc" d="M404 64l9-4v8z"/>' +
          '<text class="note acc-tx" x="486" y="59" text-anchor="middle">~6 weeks earlier</text>' +
          '<text class="cap acc-tx" x="120" y="119">first oil · revenue pulled forward</text>' +
          '</svg>',
        review:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Record review removed">' +
          '<text class="lbl" x="0" y="33">Today</text>' +
          '<rect class="bar mut" x="120" y="22" width="320" height="14" rx="4"/>' +
          '<rect class="soft" x="444" y="21" width="132" height="16" rx="4"/>' +
          '<text class="cap" x="510" y="54" text-anchor="middle">record review ≈4 mo</text>' +
          '<text class="lbl" x="0" y="99">SteelTrace</text>' +
          '<rect class="bar acc" x="120" y="88" width="320" height="14" rx="4"/>' +
          '<line class="ln acc" x1="510" y1="60" x2="510" y2="86" stroke-dasharray="3 3"/>' +
          '<path class="fill-acc" d="M510 86l-4-9h8z"/>' +
          '<text class="note acc-tx" x="448" y="105">review removed at handover</text>' +
          '</svg>',
        defect:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Defects caught early">' +
          '<line class="ln mut" x1="40" y1="64" x2="576" y2="64"/>' +
          '<rect class="soft" x="430" y="50" width="146" height="28" rx="4"/>' +
          '<text class="cap" x="503" y="96" text-anchor="middle">critical path</text>' +
          '<circle class="fill-acc" cx="150" cy="64" r="9"/><path class="strk-acc" style="stroke:#fff;stroke-width:2.4" d="M146 64l3 3 5-6"/>' +
          '<text class="note acc-tx" x="150" y="40" text-anchor="middle">caught early</text>' +
          '<g class="bad-s" transform="translate(498,64)"><path d="M-5 -5l10 10M5 -5l-10 10"/></g>' +
          '<text class="cap mut-tx" x="503" y="40" text-anchor="middle">not on the path</text>' +
          '<circle class="dot mut" cx="40" cy="64" r="4"/><circle class="dot mut" cx="280" cy="64" r="4"/><circle class="dot mut" cx="410" cy="64" r="4"/>' +
          '</svg>',
        contingency:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Contingency freed">' +
          '<text class="lbl" x="0" y="33">Today</text>' +
          '<rect class="bar mut" x="120" y="22" width="330" height="14" rx="4"/>' +
          '<rect class="soft" x="452" y="21" width="124" height="16" rx="4"/>' +
          '<text class="cap" x="514" y="54" text-anchor="middle">contingency ~20%</text>' +
          '<text class="lbl" x="0" y="99">SteelTrace</text>' +
          '<rect class="bar acc" x="120" y="88" width="330" height="14" rx="4"/>' +
          '<rect class="soft" x="452" y="87" width="46" height="16" rx="4" style="stroke:var(--accent);fill:color-mix(in srgb,var(--accent) 14%,transparent)"/>' +
          '<line class="ln acc" x1="500" y1="95" x2="572" y2="95" stroke-dasharray="4 3"/><path class="fill-acc" d="M572 95l-9-4v8z"/>' +
          '<text class="note acc-tx" x="506" y="118">freed</text>' +
          '</svg>',
        records:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Immutable audit-ready records">' +
          '<g transform="translate(120,26)"><rect class="soft" x="0" y="14" width="150" height="62" rx="6"/><rect class="soft" x="10" y="7" width="150" height="62" rx="6"/><rect class="bar acc" x="20" y="0" width="150" height="62" rx="6" style="fill:color-mix(in srgb,var(--accent) 14%,transparent);stroke:var(--accent);stroke-width:1.5"/>' +
          '<line class="ln acc" x1="36" y1="18" x2="120" y2="18"/><line class="ln acc" x1="36" y1="31" x2="120" y2="31"/><line class="ln acc" x1="36" y1="44" x2="92" y2="44"/></g>' +
          '<g transform="translate(360,30)"><path class="strk-acc" d="M40 4l34 12v22c0 21-14 32-34 40C20 70 6 59 6 38V16z"/><path class="strk-acc" d="M28 38l9 9 18-20"/></g>' +
          '<g transform="translate(470,44)"><rect class="strk-acc" x="0" y="14" width="34" height="26" rx="4"/><path class="strk-acc" d="M6 14v-6a11 11 0 0 1 22 0v6"/></g>' +
          '<text class="cap acc-tx" x="120" y="112">immutable · traceable · audit-ready</text>' +
          '</svg>',
        reserves:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Reserves right-sized">' +
          '<text class="lbl" x="0" y="33">Held today</text>' +
          '<rect class="bar mut" x="170" y="22" width="406" height="14" rx="4"/>' +
          '<text class="lbl" x="0" y="99">Modelled</text>' +
          '<rect class="bar acc" x="170" y="88" width="250" height="14" rx="4"/>' +
          '<line class="ln acc" x1="576" y1="60" x2="426" y2="60"/><path class="fill-acc" d="M426 60l9-4v8z"/>' +
          '<text class="note acc-tx" x="500" y="55" text-anchor="middle">accurate cost modelling</text>' +
          '<text class="cap acc-tx" x="170" y="118">earlier risk detection · less tied-up capital</text>' +
          '</svg>',
        lifecycle:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Asset value across the lifecycle">' +
          '<path class="strk-mut" style="stroke-dasharray:5 4" d="M60 34C200 36 320 60 560 96"/>' +
          '<path class="strk-acc" d="M60 34C220 30 380 34 560 40"/>' +
          '<circle class="dot mut" cx="560" cy="96" r="5"/><circle class="dot acc" cx="560" cy="40" r="6"/>' +
          '<text class="cap mut-tx" x="556" y="114" text-anchor="end">sold as scrap</text>' +
          '<text class="note acc-tx" x="556" y="30" text-anchor="end">certified history → resale value</text>' +
          '<g class="cap" text-anchor="middle"><text x="80" y="112">Build</text><text x="250" y="112">Operate</text><text x="400" y="112">Divest</text></g>' +
          '</svg>',
        network:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Supplier-independent data pillar">' +
          '<g class="ln mut">' +
          '<line x1="300" y1="60" x2="120" y2="26"/><line x1="300" y1="60" x2="90" y2="76"/><line x1="300" y1="60" x2="160" y2="104"/>' +
          '<line x1="300" y1="60" x2="480" y2="26"/><line x1="300" y1="60" x2="510" y2="76"/><line x1="300" y1="60" x2="440" y2="104"/></g>' +
          '<g class="fill-mut">' +
          '<circle cx="120" cy="26" r="9"/><circle cx="90" cy="76" r="9"/><circle cx="160" cy="104" r="9"/>' +
          '<circle cx="480" cy="26" r="9"/><circle cx="510" cy="76" r="9"/><circle cx="440" cy="104" r="9"/></g>' +
          '<circle class="fill-acc" cx="300" cy="60" r="20"/>' +
          '<text x="300" y="64" text-anchor="middle" style="fill:#fff;font:700 11px var(--font-mono)">ST</text>' +
          '<text class="cap acc-tx" x="300" y="20" text-anchor="middle">supplier-independent data pillar</text>' +
          '</svg>',
        automation:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Automated verification cuts manual workload">' +
          '<text class="lbl" x="0" y="33">Manual</text>' +
          '<rect class="bar mut" x="140" y="22" width="436" height="14" rx="4"/>' +
          '<text class="cap" x="140" y="54">QA/QC review &amp; document chasing</text>' +
          '<text class="lbl" x="0" y="99">Automated</text>' +
          '<rect class="bar acc" x="140" y="88" width="150" height="14" rx="4"/>' +
          '<circle class="fill-acc" cx="306" cy="95" r="9"/><path style="stroke:#fff;stroke-width:2.4;fill:none;stroke-linecap:round;stroke-linejoin:round" d="M302 95l3 3 5-6"/>' +
          '<line class="ln acc" x1="576" y1="60" x2="296" y2="60"/><path class="fill-acc" d="M296 60l9-4v8z"/>' +
          '<text class="note acc-tx" x="440" y="55" text-anchor="middle">workload removed</text>' +
          '<text class="cap acc-tx" x="140" y="118">rules run automatically</text>' +
          '</svg>',
        twin:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Trusted data feeds twins and AI">' +
          '<g class="fill-acc"><circle cx="56" cy="34" r="5"/><circle cx="56" cy="60" r="5"/><circle cx="56" cy="86" r="5"/></g>' +
          '<g class="ln acc"><line x1="64" y1="34" x2="250" y2="60"/><line x1="64" y1="60" x2="250" y2="60"/><line x1="64" y1="86" x2="250" y2="60"/></g>' +
          '<text class="cap acc-tx" x="56" y="108">verified data</text>' +
          '<g transform="translate(280,28)"><path class="strk-acc" d="M32 0l32 17v30L32 64 0 47V17z"/><path class="strk-acc" d="M0 17l32 17 32-17M32 34v30"/></g>' +
          '<g class="strk-acc" transform="translate(420,30)"><path d="M18 0l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"/></g>' +
          '<text class="cap acc-tx" x="372" y="112" text-anchor="middle">digital twin · analytics · AI</text>' +
          '</svg>',
        foundation:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Persistent lifecycle data foundation">' +
          '<g class="cap mut-tx" text-anchor="middle"><text x="100" y="24">Project</text><text x="300" y="24">Operations</text><text x="500" y="24">Decommission</text></g>' +
          '<line class="ln mut" x1="100" y1="44" x2="500" y2="44"/>' +
          '<g class="fill-mut"><circle cx="100" cy="44" r="5"/><circle cx="300" cy="44" r="5"/><circle cx="500" cy="44" r="5"/></g>' +
          '<g class="ln acc"><line x1="100" y1="49" x2="100" y2="78"/><line x1="300" y1="49" x2="300" y2="78"/><line x1="500" y1="49" x2="500" y2="78"/></g>' +
          '<rect x="40" y="80" width="536" height="20" rx="6" style="fill:color-mix(in srgb,var(--accent) 16%,transparent);stroke:var(--accent);stroke-width:1.5"/>' +
          '<text class="cap acc-tx" x="308" y="94" text-anchor="middle">one persistent manufacturing-data foundation</text>' +
          '</svg>',
        truth:
          '<svg viewBox="0 0 600 120" role="img" aria-label="Single source of truth in your environment">' +
          '<g class="fill-mut"><rect x="24" y="20" width="42" height="22" rx="4"/><rect x="24" y="49" width="42" height="22" rx="4"/><rect x="24" y="78" width="42" height="22" rx="4"/></g>' +
          '<g class="ln mut"><line x1="66" y1="31" x2="236" y2="60"/><line x1="66" y1="60" x2="236" y2="60"/><line x1="66" y1="89" x2="236" y2="60"/></g>' +
          '<text class="cap mut-tx" x="24" y="114">siloed data</text>' +
          '<rect class="strk-acc" x="250" y="20" width="326" height="80" rx="10" style="fill:color-mix(in srgb,var(--accent) 7%,transparent)"/>' +
          '<text class="cap acc-tx" x="268" y="40">YOUR ENVIRONMENT</text>' +
          '<circle class="fill-acc" cx="320" cy="70" r="16"/><text x="320" y="74" text-anchor="middle" style="fill:#fff;font:700 10px var(--font-mono)">ST</text>' +
          '<g class="fill-acc"><circle cx="430" cy="62" r="5"/><circle cx="482" cy="62" r="5"/><circle cx="534" cy="62" r="5"/></g>' +
          '<g class="ln acc"><line x1="336" y1="70" x2="430" y2="62"/><line x1="336" y1="70" x2="482" y2="62"/><line x1="336" y1="70" x2="534" y2="62"/></g>' +
          '<text class="cap acc-tx" x="482" y="92" text-anchor="middle">projects · supply chain · ops</text>' +
          '</svg>'
      };
      return V[k] ? '<div class="xs-viz">' + V[k] + '</div>' : '';
    }
    function row(tp, i) {
      tn++;
      var n = (tn < 10 ? "0" : "") + tn;
      var panel = '<div class="xs-panel">' +
        '<div class="xs-panel-top"><span class="xs-pdot"></span><span class="xs-plbl">' + e(tp.t) + '</span></div>' +
        '<div class="xs-panel-body">' + viz(tp.viz) + '</div>' +
      '</div>';
      var text = '<div class="xs-text">' +
        '<div class="xs-rhead"><span class="xs-ic">' + (icons[tp.ic] || icons.shield) + '</span><span class="xs-rn">' + n + '</span></div>' +
        '<h4 class="xs-rtitle">' + e(tp.t) + '</h4>' +
        '<div class="xs-pair">' +
          '<div class="xs-rec"><span class="xs-tag">They recognise</span><p>' + e(tp.r) + '</p></div>' +
          '<div class="xs-st"><span class="xs-tag">With SteelTrace</span><p>' + e(tp.s) + '</p></div>' +
        '</div>' +
      '</div>';
      return '<div class="xs-row">' + panel + text + '</div>';
    }
    function statRow(stats) {
      if (!stats || !stats.length) return '';
      return '<div class="xs-stats">' + stats.map(function (s) {
        return '<div class="xs-stat"><span class="xs-snum">' + e(s.n) + (s.u ? '<small>' + e(s.u) + '</small>' : '') + '</span><span class="xs-slbl">' + e(s.l) + '</span></div>';
      }).join("") + '</div>';
    }
    var groups = st.groups || [{ topics: st.topics }];
    if (st.lens) {
      var lead = st.lead || {};
      var leadLine = (lead.line || []).map(function (w) {
        if (w.charAt(0) === "^") return '<span class="exl-plain">' + e(w.slice(1)) + '</span>';
        return '<span class="exl-w">' + e(w) + '</span>';
      }).join(" ");
      var blocks = groups.map(function (g, i) {
        var n = g.label || ((i < 9 ? "0" : "") + (i + 1));
        var stats = (g.stats && g.stats.length) ?
          '<div class="exl-stats">' + g.stats.map(function (s) {
            return '<div class="exl-stat"><span class="exl-snum">' + e(s.n) + (s.u ? '<small>' + e(s.u) + '</small>' : '') + '</span><span class="exl-slbl">' + e(s.l) + '</span></div>';
          }).join("") + '</div>' : '';
        var points = (g.topics || []).map(function (tp, j) {
          var pn = (j + 1 < 10 ? "0" : "") + (j + 1);
          return '<li class="exl-point rv">' +
              '<span class="exl-pn">' + pn + '</span>' +
              '<div class="exl-ptx"><h3 class="exl-phead">' + e(tp.t) + '</h3><p class="exl-pbody">' + e(tp.s) + '</p></div>' +
            '</li>';
        }).join("");
        return '<section class="exl-theme" id="exl-' + n + '">' +
            '<div class="exl-head rv">' +
              '<span class="exl-eyebrow"><i>' + e(n) + '</i>' + e(g.title) + '</span>' +
              '<h2 class="exl-word">' + e(g.word || g.title) + '</h2>' +
              (g.lede ? '<p class="exl-intro">' + e(g.lede) + '</p>' : '') +
              stats +
            '</div>' +
            '<ol class="exl-points">' + points + '</ol>' +
          '</section>';
      }).join("");
      var pathways = (st.pathways && st.pathways.length) ?
        '<div class="exl-paths rv">' +
          '<span class="exl-paths-lbl">Go deeper by role</span>' +
          '<div class="exl-paths-row">' + st.pathways.map(function (p) {
            return '<a class="exl-path" href="' + p.href + '"><b>' + e(p.t) + '</b><span>' + e(p.d) + '</span></a>';
          }).join("") + '</div>' +
        '</div>' : '';
      return '<section class="sec exl-sec">' +
          '<div class="exl-lead rv">' +
            '<h2 class="exl-lead-line">' + leadLine + '</h2>' +
            (lead.body ? '<p class="exl-lead-body">' + e(lead.body) + '</p>' : '') +
          '</div>' +
          blocks +
          pathways +
        '</section>';
    }
    if (st.headOnly) {
      var g0 = groups[0] || {};
      var head0 = '<div class="xs-mvhead">' +
        '<div class="xs-mvtop">' +
          (g0.label ? '<span class="xs-mvnum">' + e(g0.label) + '</span>' : '') +
          '<div class="xs-mvtx">' +
            (g0.title ? '<h3 class="xs-mvtitle">' + e(g0.title) + '</h3>' : '') +
            (g0.lede ? '<p class="xs-mvlede">' + e(g0.lede) + '</p>' : '') +
          '</div>' +
        '</div>' +
        statRow(g0.stats) +
      '</div>';
      return '<section class="sec xs-sec">' +
        '<div class="sec-head-c">' +
          '<span class="kicker">The executive lens</span>' +
          '<h2>Faster, cheaper, and one source of truth</h2>' +
          '<p class="xs-angle">' + e(st.angle) + '</p>' +
        '</div>' +
        '<div class="xs-mv">' + head0 + '</div>' +
      '</section>';
    }
    var body = groups.map(function (g) {
      tn = 0;
      var head = '<div class="xs-mvhead">' +
        '<div class="xs-mvtop">' +
          (g.label ? '<span class="xs-mvnum">' + e(g.label) + '</span>' : '') +
          '<div class="xs-mvtx">' +
            (g.title ? '<h3 class="xs-mvtitle">' + e(g.title) + '</h3>' : '') +
            (g.lede ? '<p class="xs-mvlede">' + e(g.lede) + '</p>' : '') +
          '</div>' +
        '</div>' +
        statRow(g.stats) +
      '</div>';
      return '<div class="xs-mv">' + head + '<div class="xs-rows">' + g.topics.map(row).join("") + '</div></div>';
    }).join("");
    return '<section class="sec xs-sec">' +
      '<div class="sec-head-c">' +
        '<span class="kicker">The executive lens</span>' +
        '<h2>Faster, cheaper, and one source of truth</h2>' +
        '<p class="xs-angle">' + e(st.angle) + '</p>' +
      '</div>' +
      body +
    '</section>';
  }
  function siblings() {
    var sibs = S.all.filter(function (x) { return x.group === sol.group && x.id !== sol.id; });
    return '<div class="sib-grid">' + sibs.map(function (x) {
      return '<button class="sib" type="button" onclick="location.href=\'/solution-' + x.id + '\'"><span class="c">' + e(x.code) + '</span><b>' + e(x.name) + '</b></button>';
    }).join("") + '</div>';
  }

  var teasers =
    '<div class="sol-teasers">' +
      '<div class="tz">' +
        '<div class="tz-head">' +
          '<span class="kicker">Trust &amp; Integrity</span>' +
          '<h2 class="h2">When AI can forge anything, can we really afford to keep manufacturing records <em>off chain?</em></h2>' +
        '</div>' +
        '<div class="tz-body">' +
          '<div class="tz-copy">' +
            '<p class="lead">A convincing fake certificate now takes minutes. SteelTrace makes each record verifiable at its source and tamper-proof ever after, so you are trusting proof, not paper.</p>' +
            '<div class="row"><a class="btn btn-ghost" href="/trust">How SteelTrace proves a record <span class="ar">→</span></a></div>' +
          '</div>' +
          '<div class="tz-viz" aria-hidden="true">' +
            '<svg class="tz-seal" viewBox="0 0 150 150">' +
              '<g class="rot"><circle class="ticks" cx="75" cy="75" r="70" stroke-dasharray="1 7"></circle></g>' +
              '<circle class="ring" cx="75" cy="75" r="63" stroke-width="1"></circle>' +
              '<circle class="ring2" cx="75" cy="75" r="48" stroke-width="1"></circle>' +
              '<defs><path id="tzSealTopS" d="M75,75 m-53,0 a53,53 0 1,1 106,0"></path><path id="tzSealBotS" d="M75,75 m-47,0 a47,47 0 1,0 94,0"></path></defs>' +
              '<text class="txt"><textPath href="#tzSealTopS" startOffset="50%" text-anchor="middle">VERIFIED AT SOURCE</textPath></text>' +
              '<text class="txt"><textPath href="#tzSealBotS" startOffset="50%" text-anchor="middle">TAMPER · PROOF</textPath></text>' +
              '<circle class="core" cx="75" cy="75" r="27" stroke-width="1"></circle>' +
              '<path class="check" d="M63 76 l8 8 16-19"></path>' +
            '</svg>' +
            '<div class="tz-chips">' +
              '<div class="tz-chip pdf"><span class="lab">A PDF</span><span class="txt">Yield <s>485</s> 520 MPa</span><span class="xm">✕</span></div>' +
              '<div class="tz-chip rec"><span class="lab">Record</span><span class="txt">Yield 485 MPa, at source</span><span class="chk"></span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="tz">' +
        '<div class="tz-head">' +
          '<span class="kicker">The Product</span>' +
          '<h2 class="h2">See how SteelTrace turns manufacturing data into a <em>record you can prove.</em></h2>' +
        '</div>' +
        '<div class="tz-body">' +
          '<div class="tz-copy">' +
            '<p class="lead">From capture at the point of work to verified handover, explore the platform behind Smart Manufacturing Records.</p>' +
            '<div class="row"><a class="btn btn-ghost" href="/product">Explore the product <span class="ar">→</span></a></div>' +
          '</div>' +
          '<div class="tz-viz" aria-hidden="true">' +
            '<div class="tz-prodart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/></svg></div>' +
            '<div class="tz-chips">' +
              '<div class="tz-chip rec"><span class="lab">Capture</span><span class="txt">At the point of work</span><span class="chk"></span></div>' +
              '<div class="tz-chip rec"><span class="lab">Verify</span><span class="txt">Against your specs</span><span class="chk"></span></div>' +
              '<div class="tz-chip rec"><span class="lab">Handover</span><span class="txt">Verified, days not months</span><span class="chk"></span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  el.innerHTML =
    '<div class="d-hero">' +
      '' +
      '<div class="hbody">' +
        (sol.noCode ? '' : '<div class="hmeta"><span class="hcode" style="background-image:' + sol.gradient + '">' + e(sol.code) + '</span><span class="glabel">' + e(groupLabel) + '</span></div>') +
        '<h1>' + e(sol.name) + '</h1>' +
        (sol.sub ? '<div class="sub">' + e(sol.sub) + '</div>' : '') +
        '<p class="who">' + e(sol.who).replace(/\n\n+/g, '</p><p class="who who-2">') + '</p>' +
      '</div>' +
    '</div>' +

    (sol.noBenefits ? '' :
    '<section class="sec ben-sec">' +
      '<div class="sec-head-c">' +
        '<span class="kicker">Benefits</span>' +
        '<h2>Your benefits</h2>' +
        '<p class="sub2">What changes for ' + e(sol.name) + ' when manufacturing and quality data flows on one verified thread.</p>' +
      '</div>' +
      benefits(sol.value) +
    '</section>') +

    (sol.strategy ? strategy(sol.strategy) : '') +

    (sol.noFeatures ? '' :
    '<section class="sec kf-sec">' +
      '<div class="kf-slab">' +
        '<div class="sec-head-c">' +
          '<span class="kicker">Key features</span>' +
          '<h2>Built for ' + e(sol.name) + '</h2>' +
          '<p class="sub2">The capabilities and resources most relevant to your team.</p>' +
        '</div>' +
        keyFeatures(sol.content) +
      '</div>' +
    '</section>') +

    (sol.noCta ? '' :
    '<div class="d-cta">' +
      '<span class="t">See SteelTrace for ' + e(sol.name) + '.</span>' +
      '<div class="row"><a class="btn btn-primary" href="/demo">Book a demo <span class="ar">→</span></a><a class="btn btn-ghost" href="/how-it-works">How it works</a></div>' +
    '</div>') +

    teasers;

  (function(){ var pg = el.closest ? el.closest('.page') : el.parentNode; if(pg && !pg.querySelector('.crumbs')){ var n=document.createElement('nav'); n.className='crumbs'; n.setAttribute('aria-label','Breadcrumb'); n.innerHTML='<a href="/">Home</a><span class="sep">/</span><span class="cur">Solutions</span><span class="sep">/</span><span class="cur">'+e(sol.name)+'</span>'; pg.insertBefore(n, pg.firstChild); } })();
  window.scrollTo(0, 0);

  var heroEl = el.querySelector(".d-hero");
  if (heroEl) {
    var rh = ROLE_HERO[sol.id];
    if (rh) {
      heroEl.classList.add("role-hero");
      heroEl.style.setProperty("--role-bg", rh.bg);
      var art = document.createElement("div");
      art.className = "d-hero-art";
      art.setAttribute("aria-hidden", "true");
      art.innerHTML = rh.svg;
      heroEl.insertBefore(art, heroEl.firstChild);
    } else if (sol.img) {
      heroEl.style.setProperty("--hero-img", "url('img/" + sol.img + "')");
      heroEl.style.setProperty("--hero-tint", "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0))");
      heroEl.style.backgroundBlendMode = "normal";
    } else {
      heroEl.style.setProperty("--hero-tint", sol.gradient);
    }
  }

  // key-features explorer interactions
  var kfItems = [].slice.call(el.querySelectorAll('.kfx-item'));
  var kfPanels = [].slice.call(el.querySelectorAll('.kfx-panel'));
  function setKf(i) {
    kfItems.forEach(function (b) { var on = +b.dataset.i === i; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); });
    kfPanels.forEach(function (p) { p.classList.toggle('active', +p.dataset.i === i); });
  }
  kfItems.forEach(function (b) {
    var i = +b.dataset.i;
    b.addEventListener('click', function () { setKf(i); });
    b.addEventListener('mouseenter', function () { setKf(i); });
    b.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') { ev.preventDefault(); var n = kfItems[(i + 1) % kfItems.length]; setKf(+n.dataset.i); n.focus(); }
      else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') { ev.preventDefault(); var p = kfItems[(i - 1 + kfItems.length) % kfItems.length]; setKf(+p.dataset.i); p.focus(); }
    });
  });

  // light scroll reveal (exec page only)
  if (el.classList.contains('exec-page') && 'IntersectionObserver' in window &&
      !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var rv = [].slice.call(el.querySelectorAll('.sec-head-c, .ben, .xs-mvhead, .xs-stat, .xs-row, .kf-slab, .d-cta, .exl-lead, .exl-head, .exl-point, .exl-paths'));
    rv.forEach(function (n, i) { n.classList.add('rv'); });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io2.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    rv.forEach(function (n) { io2.observe(n); });
  }
})();
