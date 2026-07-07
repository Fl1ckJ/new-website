/* SteelTrace — Blog index. Reads parsed posts from posts-data.js (window.STEELTRACE_BLOG).
   Featured = most recent post. Category chips + pager filter the grid. Clicking a
   post navigates to post.html?slug=… (a full markdown-rendered article page). */
(function () {
  "use strict";
  var B = window.STEELTRACE_BLOG;
  var featuredEl = document.getElementById("featured");
  var grid = document.getElementById("postGrid");
  var catsEl = document.getElementById("cats");
  var countEl = document.getElementById("count");
  var pagerEl = document.getElementById("pager");
  if (!B || !grid) return;

  var PAGE_SIZE = 6;
  var posts = B.byDate;                 // newest first
  var featuredPost = posts[0] || null;
  var state = { cat: "All", page: 1 };

  function go(p) { location.href = "post.html?slug=" + encodeURIComponent(p.slug); }
  function byline(p) {
    var sub = [p.role, B.formatDate(p.date)].filter(Boolean).join(" · ");
    return '<div class="byline"><span class="av">' + B.esc(B.initials(p.author || "ST")) + '</span>' +
      '<span class="who"><b>' + B.esc(p.author || "SteelTrace Team") + '</b><span>' + B.esc(sub) + '</span></span></div>';
  }

  function buildCats() {
    var seen = {}, cats = ["All"];
    // keep chip order stable by markdown order
    B.posts.forEach(function (p) { if (p.cat && !seen[p.cat]) { seen[p.cat] = 1; cats.push(p.cat); } });
    catsEl.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cat" + (c === state.cat ? " on" : "");
      b.textContent = c;
      b.addEventListener("click", function () { state.cat = c; state.page = 1; render(); });
      catsEl.appendChild(b);
    });
  }

  function render() {
    [].forEach.call(catsEl.children, function (b) { b.classList.toggle("on", b.textContent === state.cat); });

    var showFeatured = state.cat === "All" && featuredPost;
    var pool = posts.filter(function (p) {
      if (showFeatured && p === featuredPost) return false;
      return state.cat === "All" || p.cat === state.cat;
    });

    if (showFeatured) {
      featuredEl.style.display = "";
      featuredEl.innerHTML =
        '<div class="cover" style="' + B.coverStyle(featuredPost) + '">' +
          (featuredPost.cat ? '<span class="ct">' + B.esc(featuredPost.cat) + '</span>' : '') +
          (!featuredPost.image && featuredPost.glyph ? '<span class="glyph">' + B.esc(featuredPost.glyph) + '</span>' : '') +
        '</div>' +
        '<div class="fbody">' +
          '<span class="tagline">Most recent' + (featuredPost.cat ? ' · ' + B.esc(featuredPost.cat) : '') + '</span>' +
          '<h2>' + B.esc(featuredPost.title) + '</h2>' +
          '<p>' + B.esc(featuredPost.summary) + '</p>' +
          byline(featuredPost) +
        '</div>';
      featuredEl.onclick = function () { go(featuredPost); };
    } else {
      featuredEl.style.display = "none";
    }

    var pages = Math.max(1, Math.ceil(pool.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = pool.slice(start, start + PAGE_SIZE);

    if (countEl) countEl.textContent = pool.length + (pool.length === 1 ? " article" : " articles");

    grid.innerHTML = "";
    pageItems.forEach(function (p) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "post";
      card.innerHTML =
        '<div class="cover" style="' + B.coverStyle(p) + '">' +
          (p.cat ? '<span class="ct">' + B.esc(p.cat) + '</span>' : '') +
          (!p.image && p.glyph ? '<span class="glyph">' + B.esc(p.glyph) + '</span>' : '') +
        '</div>' +
        '<div class="pbody">' +
          '<span class="tag">' + B.esc(p.cat || "Article") + '</span>' +
          '<h3>' + B.esc(p.title) + '</h3>' +
          '<p>' + B.esc(p.summary) + '</p>' +
          '<div class="pmeta"><span>' + B.esc(p.author || "SteelTrace Team") + '</span><span class="d"></span><span>' + B.esc(B.formatDate(p.date)) + '</span></div>' +
        '</div>';
      card.addEventListener("click", function () { go(p); });
      grid.appendChild(card);
    });

    if (pagerEl) {
      pagerEl.innerHTML = "";
      if (pages > 1) {
        for (var i = 1; i <= pages; i++) {
          (function (n) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "pg" + (n === state.page ? " on" : "");
            b.textContent = n;
            b.addEventListener("click", function () { state.page = n; render(); scrollToGrid(); });
            pagerEl.appendChild(b);
          })(i);
        }
        var nx = document.createElement("button");
        nx.type = "button"; nx.className = "pg"; nx.textContent = "→";
        nx.addEventListener("click", function () { if (state.page < pages) { state.page++; render(); scrollToGrid(); } });
        pagerEl.appendChild(nx);
        pagerEl.style.display = "flex";
      } else {
        pagerEl.style.display = "none";
      }
    }
  }

  function scrollToGrid() {
    var y = grid.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  buildCats();
  render();
})();
