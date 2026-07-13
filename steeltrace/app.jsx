/* SteelTrace Explorer — root app, global nav, state, tweaks */
const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "blueprint",
  "accent": "steel",
  "motion": "on",
  "grid": true,
  "pulseSpeed": 3.2
}/*EDITMODE-END*/;

// Seed the initial theme from the cross-page choice BEFORE first render, so the
// apply effect's first localStorage write is already correct (no race / clobber).
// 'control' is preserved when the shared key is merely 'dark'.
try {
  const shared = localStorage.getItem("steeltrace-theme");
  if (shared === "light" && TWEAK_DEFAULTS.theme !== "steel") TWEAK_DEFAULTS.theme = "steel";
  else if (shared === "dark" && TWEAK_DEFAULTS.theme === "steel") TWEAK_DEFAULTS.theme = "blueprint";
} catch (e) {}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { SEGMENTS, PERSONAS, COMMITMENTS } = window.ST_DATA;

  const params = new URLSearchParams(location.search);
  const initView = params.get("view");
  const initOpen = params.get("open");
  const [mode, setMode] = useS(initView === "stakeholders" ? "personas" : "segments");
  const [selected, setSelected] = useS(initOpen || null);
  const [intro, setIntro] = useS(true);

  useE(() => {
    const r = document.getElementById("root");
    r.dataset.theme = t.theme; r.dataset.accent = t.accent; r.dataset.motion = t.motion;
    r.style.setProperty("--grid-on", t.grid ? 1 : 0);
    r.style.setProperty("--pulse-dur", t.pulseSpeed + "s");
    try { localStorage.setItem("steeltrace-theme", t.theme === "steel" ? "light" : "dark"); } catch (e) {}
  }, [t.theme, t.accent, t.motion, t.grid, t.pulseSpeed]);

  const toggleTheme = () => setTweak("theme", t.theme === "steel" ? "blueprint" : "steel");

  useE(() => {
    if (t.motion === "off") { setIntro(false); return; }
    const id = setTimeout(() => setIntro(false), 1900);
    return () => clearTimeout(id);
  }, []);

  const list = mode === "segments" ? SEGMENTS : PERSONAS;
  const item = selected ? list.find((x) => x.code === selected) : null;

  const goMode = (m) => {
    if (m !== mode) { setSelected(null); setMode(m); }
    else { setSelected(null); }
    const v = m === "personas" ? "stakeholders" : "clients";
    history.replaceState(null, "", "?view=" + v);
  };

  const goOpen = (m, code) => {
    setMode(m);
    setSelected(code);
    const v = m === "personas" ? "stakeholders" : "clients";
    history.replaceState(null, "", "?view=" + v + "&open=" + encodeURIComponent(code));
  };

  // supply-chain & role menu mappings (label -> explorer code)
  const SOL_SUPPLY = [
    ["Operators", "OP"],
    ["EPC Contractors", "EPC"],
    ["Welding & NDT Contractors", "WLD"],
    ["Manufacturers & Material Suppliers", "MFG"],
    ["Testing & Inspection Companies", "NDT"],
  ];
  const SOL_ROLE = [
    ["QA / QC", "QA/QC"],
    ["Project Management", "PM"],
    ["Operations & Asset Integrity", "OPS"],
    ["Digital Transformation", "DIG"],
    ["Executive Leadership", "EXEC"],
  ];

  return (
    <div className="app">
      <div className="aura a" /><div className="aura b" />

      {intro && (
        <div className="intro">
          <div className="intro-inner">
            <div className="intro-mark"><BrandMark /></div>
            <div className="intro-word">Steel<b>Trace</b></div>
            <div className="intro-sub">Smart Manufacturing Records</div>
            <div className="intro-bar"><span className="intro-fill" /></div>
          </div>
        </div>
      )}

      {/* ===== GLOBAL NAV ===== */}
      <header className="topbar">
        <a className="brand" href="SteelTrace Home.html">
          <span className="brand-mark"><BrandMark /></span>
          <span className="brand-text">
            <span className="brand-name">Steel<b>Trace</b></span>
            <span className="brand-tag">Smart Manufacturing Records</span>
          </span>
        </a>

        <nav className="nav-links">
          <a className="nav-link" href="SteelTrace Home.html">Home</a>

          <div className="nav-dd">
            <button className={`nav-link ${!selected ? "active" : ""}`} type="button" aria-haspopup="true">
              Solutions <span className="caret"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
            </button>
            <div className="nav-dd-menu mega" role="menu">
              <div className="dd-col">
                <div className="dd-col-head">By Supply Chain</div>
                {SOL_SUPPLY.map(([label, code]) => (
                  <button key={code} className="dd-link" role="menuitem" onClick={() => goOpen("segments", code)}>{label}</button>
                ))}
              </div>
              <div className="dd-col">
                <div className="dd-col-head">By Stakeholder Type</div>
                {SOL_ROLE.map(([label, code]) => (
                  <button key={code} className="dd-link" role="menuitem" onClick={() => goOpen("personas", code)}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-dd">
            <button className="nav-link" type="button" aria-haspopup="true">
              Product <span className="caret"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
            </button>
            <div className="nav-dd-menu mega mega-product" role="menu">
              <div className="dd-col">
                <div className="dd-col-head">By Product Type</div>
                {[["Rigid pipelines","rigid"],["Reeled pipelines","reeled"],["Flexible pipelines","flex"],["Bundle pipelines","bundle"],["Fitting & Flanges","fittings"]].map(([label, code]) => (
                  <a key={code} className="dd-link" role="menuitem" href="Product.html">{label}</a>
                ))}
              </div>
            </div>
          </div>

          <a className="nav-link" href="How It Works.html">How It Works</a>

          <div className="nav-dd">
            <button className="nav-link" type="button" aria-haspopup="true">
              About Us <span className="caret"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
            </button>
            <div className="nav-dd-menu" role="menu">
              <a className="dd-item" role="menuitem" href="about.html">
                <span className="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v.5M11 12h1v4h1" /></svg></span>
                <span className="dd-tx"><b>About SteelTrace</b><span>Mission, vision &amp; what we build</span></span>
              </a>
              <div className="dd-sep" />
              <a className="dd-item" role="menuitem" href="careers.html">
                <span className="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></span>
                <span className="dd-tx"><b>Careers</b><span>Join the team</span></span>
              </a>
              <div className="dd-sep" />
              <a className="dd-item" role="menuitem" href="contact.html">
                <span className="dd-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg></span>
                <span className="dd-tx"><b>Contact</b><span>Talk to us</span></span>
              </a>
            </div>
          </div>

          <a className="nav-link" href="blog.html">Blog</a>
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light or dark theme">
            <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          </button>
          <a className="nav-login" href="https://steeltrace.io/login" target="_blank" rel="noopener">Login</a>
          <a className="nav-cta" href="demo.html">Book a demo <span className="cta-arrow">→</span></a>
        </div>
      </header>

      {/* ===== STAGE ===== */}
      <main className="stage" data-screen-label={mode === "segments" ? "Clients" : "Stakeholders"}>
        <div className={`view ${item ? "ex-left" : ""}`}>
          <div className="ov">
            <div className="ov-head">
              <div className="ov-headL">
                <div className="ov-kicker">{mode === "segments" ? "Client Matrix · 5 segments" : "Stakeholder Matrix · 6 personas"}</div>
                <h1 className="ov-title">
                  {mode === "segments" ? "One verified thread across the supply chain" : "Six personas inside every operator & EPC"}
                </h1>
                <div className="ov-tabs modeswitch">
                  <span className="ms-thumb" style={{ left: mode === "segments" ? "3px" : "calc(50% + 0px)", width: "calc(50% - 3px)" }} />
                  <button className={mode === "segments" ? "active" : ""} onClick={() => goMode("segments")}><span className="dot" /><span>Clients</span></button>
                  <button className={mode === "personas" ? "active" : ""} onClick={() => goMode("personas")}><span className="dot" /><span>Stakeholders</span></button>
                </div>
              </div>
              <div className="ov-headR">
                <p className="ov-sub">
                  {mode === "segments"
                    ? "Follow the Smart Manufacturing Record from steel mill to operating asset. Select any link to see needs, friction, value & content."
                    : "The people who evaluate, buy and live with SteelTrace. Select a persona to see what they need and how we win them."}
                </p>
                <RoiChips motion={t.motion} />
              </div>
            </div>
            {mode === "segments"
              ? <SupplyChain segments={SEGMENTS} onOpen={setSelected} />
              : <PersonaCluster personas={PERSONAS} onOpen={setSelected} />}
          </div>
        </div>

        {item && (
          <Detail item={item} kind={mode} list={list} onBack={() => setSelected(null)} onSwitch={setSelected} />
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footerbar">
        <div className="commit">
          <span className="tag">Our commitment</span>
          {mode === "segments" ? COMMITMENTS.segments : COMMITMENTS.personas}
        </div>
        <div className="foot-hint">{item ? "Esc · back to overview" : "Select a " + (mode === "segments" ? "segment" : "persona")}</div>
      </footer>

      {/* ===== TWEAKS ===== */}
      <TweaksPanel>
        <TweakSection label="Visual direction" />
        <TweakRadio label="Theme" value={t.theme}
          options={[{ value: "blueprint", label: "Blueprint" }, { value: "control", label: "Control" }, { value: "steel", label: "Light" }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Accent" value={accentHex(t.accent)}
          options={["#5fb0e6", "#38d2df", "#e6a948"]}
          onChange={(hex) => setTweak("accent", hexToAccent(hex))} />
        <TweakSection label="Motion" />
        <TweakRadio label="Animation" value={t.motion}
          options={[{ value: "on", label: "On" }, { value: "off", label: "Reduced" }]}
          onChange={(v) => setTweak("motion", v)} />
        <TweakSlider label="Data-pulse speed" value={t.pulseSpeed} min={1.4} max={6} step={0.2} unit="s"
          onChange={(v) => setTweak("pulseSpeed", v)} />
        <TweakToggle label="Blueprint grid" value={t.grid} onChange={(v) => setTweak("grid", v)} />
      </TweaksPanel>
    </div>
  );
}

function accentHex(a) { return ({ steel: "#5fb0e6", cyan: "#38d2df", amber: "#e6a948" })[a] || "#5fb0e6"; }
function hexToAccent(h) { return ({ "#5fb0e6": "steel", "#38d2df": "cyan", "#e6a948": "amber" })[h] || "steel"; }

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { const b = document.querySelector(".dt-back"); if (b) b.click(); }
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
