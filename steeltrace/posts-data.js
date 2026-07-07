/* SteelTrace — Blog runtime helpers + assembly.
 *
 * Posts are NO LONGER authored here. Each post is its own Markdown file in
 * /posts (see /posts/README.md). Run  `node build-blog.mjs`  to (re)generate
 * steeltrace/posts.generated.js, which this file reads via window.STEELTRACE_POSTS.
 *
 * This file only holds shared helpers (markdown→HTML, cover styles, date
 * formatting) and builds window.STEELTRACE_BLOG, which blog.js and post.html use.
 */
(function () {
  "use strict";
  var COVERS = [
    "linear-gradient(135deg,#1f5969,#2b8fb0)",
    "linear-gradient(135deg,#1f6b4b,#2fae6e)",
    "linear-gradient(135deg,#2a3f6b,#3f6fd0)",
    "linear-gradient(135deg,#5a3550,#9c4f7e)",
    "linear-gradient(135deg,#3a4550,#5d7184)",
    "linear-gradient(135deg,#7a4a1f,#d08a3a)",
    "linear-gradient(135deg,#6b2f2f,#c44b4b)"
  ];
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function initials(t) { return (t || "").split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ""; }).join("").toUpperCase(); }
  function slugify(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function coverStyle(p) { return p.image ? 'background-image:url(' + esc(p.image) + ')' : 'background-image:' + COVERS[(p.cover || 0) % COVERS.length]; }
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function formatDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || ""));
    if (!m) return d || "";
    return MONTHS[parseInt(m[2], 10) - 1] + " " + parseInt(m[3], 10) + ", " + m[1];
  }

  function mdInline(s) {
    s = esc(s);
    // images before links: ![alt](src)
    s = s.replace(/!\[([^\]]*?)\]\(([^)\s]+?)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
    s = s.replace(/\[([^\]]+?)\]\(([^)\s]+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
    return s;
  }
  function mdToHtml(md) {
    var lines = String(md || "").split("\n"), html = "", list = null, listTag = "ul", quote = null, para = [], code = null;
    function fP() { if (para.length) { html += "<p>" + mdInline(para.join(" ")) + "</p>"; para = []; } }
    function fL() { if (list != null) { html += "<" + listTag + ">" + list + "</" + listTag + ">"; list = null; } }
    function fQ() { if (quote != null) { html += "<blockquote>" + mdInline(quote.join(" ")) + "</blockquote>"; quote = null; } }
    function fA() { fP(); fL(); fQ(); }
    lines.forEach(function (ln) {
      // fenced code blocks ``` … ```
      var fence = ln.trim().match(/^```/);
      if (code != null) {
        if (fence) { html += "<pre><code>" + esc(code.join("\n")) + "</code></pre>"; code = null; }
        else code.push(ln);
        return;
      }
      if (fence) { fA(); code = []; return; }

      var t = ln.trim();
      if (!t) { fA(); return; }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { fA(); html += "<hr />"; return; }   // horizontal rule
      var h = t.match(/^(#{1,6})\s+(.*)/);
      if (h) { fA(); var lvl = Math.min(h[1].length, 4); html += "<h" + lvl + ">" + mdInline(h[2]) + "</h" + lvl + ">"; return; }
      var bq = t.match(/^>\s?(.*)/);
      if (bq) { fP(); fL(); quote = (quote || []); quote.push(bq[1]); return; }
      var ol = t.match(/^\d+[.)]\s+(.*)/);
      if (ol) { fP(); fQ(); if (list != null && listTag !== "ol") fL(); listTag = "ol"; list = (list || "") + "<li>" + mdInline(ol[1]) + "</li>"; return; }
      var li = t.match(/^[-*+]\s+(.*)/);
      if (li) { fP(); fQ(); if (list != null && listTag !== "ul") fL(); listTag = "ul"; list = (list || "") + "<li>" + mdInline(li[1]) + "</li>"; return; }
      fL(); fQ(); para.push(t);
    });
    if (code != null) html += "<pre><code>" + esc(code.join("\n")) + "</code></pre>";
    fA();
    return html;
  }

  var posts = (window.STEELTRACE_POSTS || []).map(function (p, idx) {
    return {
      id: p.id || p.slug || ("p" + idx),
      title: p.title || "",
      cat: p.cat || "",
      author: p.author || "",
      role: p.role || "",
      date: p.date || "",
      cover: typeof p.cover === "number" ? p.cover : (parseInt(p.cover, 10) || idx),
      image: p.image || "",
      glyph: p.glyph || "",
      summary: p.summary || "",
      body: p.body || "",
      slug: p.slug || slugify(p.title)
    };
  }).filter(function (p) { return p.title; });

  if (!posts.length && window.console) {
    console.warn("[SteelTrace blog] No posts loaded. Add Markdown files to /posts and run: node build-blog.mjs");
  }

  // newest first
  var byDate = posts.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

  window.STEELTRACE_BLOG = {
    posts: posts,
    byDate: byDate,
    md: mdToHtml,
    coverStyle: coverStyle,
    initials: initials,
    esc: esc,
    slugify: slugify,
    formatDate: formatDate,
    COVERS: COVERS
  };
})();
