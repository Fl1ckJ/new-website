/* SteelTrace — Careers open-roles board.
   Roles are authored in MARKDOWN, in the <script type="text/markdown" id="rolesMd">
   block inside careers.html. No admin UI — to change roles, edit that markdown.
   Renders a blog-style grid + a detail modal (with rendered markdown body). */
(function () {
  "use strict";
  var grid = document.getElementById("rolesGrid");
  var empty = document.getElementById("rolesEmpty");
  var modalBack = document.getElementById("modalBack");
  var modal = document.getElementById("modal");
  var src = document.getElementById("rolesMd");
  if (!grid) return;

  var COVERS = [
    "linear-gradient(135deg,#1f5969,#2b8fb0)",
    "linear-gradient(135deg,#1f6b4b,#2fae6e)",
    "linear-gradient(135deg,#2a3f6b,#3f6fd0)",
    "linear-gradient(135deg,#5a3550,#9c4f7e)",
    "linear-gradient(135deg,#3a4550,#5d7184)",
    "linear-gradient(135deg,#7a4a1f,#d08a3a)"
  ];

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function initials(t) { return (t || "").split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ""; }).join("").toUpperCase(); }
  function coverStyle(rl) {
    if (rl.img) return 'background-image:url(' + esc(rl.img) + ')';
    return 'background-image:' + COVERS[(rl.cover || 0) % COVERS.length];
  }

  /* ---------- markdown ---------- */
  function mdInline(s) {
    s = esc(s);
    s = s.replace(/\[([^\]]+?)\]\(([^)\s]+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
    s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
    return s;
  }
  function mdToHtml(md) {
    var lines = String(md || "").split("\n"), html = "", list = null, para = [];
    function flushPara() { if (para.length) { html += "<p>" + mdInline(para.join(" ")) + "</p>"; para = []; } }
    function flushList() { if (list != null) { html += "<ul>" + list + "</ul>"; list = null; } }
    lines.forEach(function (ln) {
      var t = ln.trim();
      if (!t) { flushPara(); flushList(); return; }
      var h = t.match(/^(#{3,4})\s+(.*)/);
      if (h) { flushPara(); flushList(); var lvl = h[1].length; html += "<h" + lvl + ">" + mdInline(h[2]) + "</h" + lvl + ">"; return; }
      var li = t.match(/^[-*]\s+(.*)/);
      if (li) { flushPara(); list = (list || "") + "<li>" + mdInline(li[1]) + "</li>"; return; }
      flushList(); para.push(t);
    });
    flushPara(); flushList();
    return html;
  }

  /* ---------- parse role blocks ---------- */
  function parseRoles(text) {
    var out = [];
    var blocks = String(text || "").replace(/\r/g, "").trim().split(/\n-{3,}\n/);
    blocks.forEach(function (block, idx) {
      var lines = block.trim().split("\n");
      var rl = { id: "r" + idx, title: "", team: "", loc: "", type: "Full-time", summary: "", body: "", cover: idx, img: "", link: "" };
      var bodyLines = [], sumLines = [];
      lines.forEach(function (ln) {
        var t = ln.trim();
        var mt = t.match(/^##\s+(.*)/);
        if (mt) { rl.title = mt[1].trim(); return; }
        var meta = t.match(/^(team|location|type|cover|image|preview|apply|link|url)\s*:\s*(.*)$/i);
        if (meta) {
          var k = meta[1].toLowerCase(), v = meta[2].trim();
          if (k === "team") rl.team = v;
          else if (k === "location") rl.loc = v;
          else if (k === "type") rl.type = v;
          else if (k === "cover") rl.cover = parseInt(v, 10) || 0;
          else if (k === "image" || k === "preview") rl.img = v;
          else if (k === "apply" || k === "link" || k === "url") rl.link = v;
          return;
        }
        var bq = ln.match(/^\s*>\s?(.*)$/);
        if (bq) { sumLines.push(bq[1]); return; }
        bodyLines.push(ln);
      });
      rl.summary = sumLines.join(" ").trim();
      rl.body = bodyLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      if (!rl.summary) {
        var firstPara = rl.body.split(/\n\s*\n/)[0] || "";
        rl.summary = firstPara.replace(/\n/g, " ").trim();
      }
      if (rl.title) out.push(rl);
    });
    return out;
  }

  // Source of truth: window.STEELTRACE_JOBS (generated from /jobs by build-jobs.mjs
  // or synced from Notion by sync-notion-jobs.mjs). Falls back to the inline
  // #rolesMd markdown block if the generated file is missing/empty.
  var roles = Array.isArray(window.STEELTRACE_JOBS)
    ? window.STEELTRACE_JOBS
    : (src ? parseRoles(src.textContent) : []);

  /* ---------- render grid ---------- */
  function render() {
    grid.innerHTML = "";
    roles.forEach(function (rl) {
      var card = document.createElement("button");
      card.className = "role-card";
      card.type = "button";
      card.setAttribute("data-id", rl.id);
      card.innerHTML =
        '<div class="role-cover" style="' + coverStyle(rl) + '">' +
          (rl.img ? '' : '<span class="mono">' + esc(initials(rl.title)) + '</span>') +
          '<span class="badge">' + esc(rl.type || "Full-time") + '</span>' +
        '</div>' +
        '<div class="role-body">' +
          '<h3>' + esc(rl.title) + '</h3>' +
          '<div class="role-meta"><span>' + esc(rl.team || "Team") + '</span><span>' + esc(rl.loc || "Remote") + '</span></div>' +
          '<p>' + esc(rl.summary || "") + '</p>' +
          '<span class="role-go">View role <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></span>' +
        '</div>';
      card.addEventListener("click", function () { openView(rl); });
      grid.appendChild(card);
    });
    empty.classList.toggle("show", roles.length === 0);
    grid.style.display = roles.length === 0 ? "none" : "grid";
  }

  /* ---------- detail modal ---------- */
  function openView(rl) {
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal-cover" style="' + coverStyle(rl) + '">' +
        (rl.img ? '' : '<span class="mono">' + esc(initials(rl.title)) + '</span>') +
        '<button class="modal-x" data-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<h2>' + esc(rl.title) + '</h2>' +
        '<div class="m-meta"><span>' + esc(rl.type || "Full-time") + '</span><span>' + esc(rl.team || "Team") + '</span><span>' + esc(rl.loc || "Remote") + '</span></div>' +
        '<div class="m-desc">' + (mdToHtml(rl.body) || '<p>' + esc(rl.summary || "") + '</p>') + '</div>' +
        '<div class="m-cta">' +
          (rl.link
            ? '<a class="btn btn-primary" href="' + esc(rl.link) + '" target="_blank" rel="noopener">Apply for this role <span class="ar">→</span></a>'
            : '<a class="btn btn-primary" href="#apply" data-apply-role="' + esc(rl.title) + '">Apply for this role <span class="ar">→</span></a>') +
          '<button class="btn btn-ghost" data-close type="button">Close</button>' +
        '</div>' +
      '</div>';
    openModal();
  }

  /* ---------- modal plumbing ---------- */
  function openModal() { modalBack.classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeModal() { modalBack.classList.remove("show"); document.body.style.overflow = ""; }
  modalBack.addEventListener("click", function (e) {
    if (e.target === modalBack || e.target.closest("[data-close]")) closeModal();
  });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  render();
})();
