/* SteelTrace Explorer — root app, state, tweaks */
const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "blueprint",
  "accent": "steel",
  "motion": "on",
  "grid": true,
  "pulseSpeed": 3.2,
  "startMode": "segments"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { SEGMENTS, PERSONAS, COMMITMENTS } = window.ST_DATA;

  const [mode, setMode] = useS(t.startMode || "segments"); // segments | personas
  const [selected, setSelected] = useS(null);  // code or null
  const [intro, setIntro] = useS(true);

  // apply theme/accent/motion/grid to #root
  useE(() => {
    const r = document.getElementById("root");
    r.dataset.theme = t.theme;
    r.dataset.accent = t.accent;
    r.dataset.motion = t.motion;
    r.style.setProperty("--grid-on", t.grid ? 1 : 0);
    r.style.setProperty("--pulse-dur", t.pulseSpeed + "s");
  }, [t.theme, t.accent, t.motion, t.grid, t.pulseSpeed]);

  // intro dismiss
  useE(() => {
    if (t.motion === "off") { setIntro(false); return; }
    const id = setTimeout(() => setIntro(false), 1700);
    return () => clearTimeout(id);
  }, []);

  const list = mode === "segments" ? SEGMENTS : PERSONAS;
  const item = selected ? list.find((x) => x.code === selected) : null;

  const switchMode = (m) => { if (m === mode) return; setSelected(null); setMode(m); };

  return (
    <div className="app">
      {intro && (
        <div className={`intro ${intro ? "" : "gone"}`}>
          <div className="intro-inner">
            <div className="intro-mark"><BrandMark /></div>
            <div className="intro-word">Steel<b>Trace</b></div>
            <div className="intro-sub">Smart Manufacturing Records</div>
          </div>
        </div>
      )}

      {/* top bar */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><BrandMark /></span>
          <span className="brand-text">
            <span className="brand-name">Steel<b>Trace</b></span>
            <span className="brand-tag">Supply Chain Explorer</span>
          </span>
        </div>
        <nav className="modeswitch">
          <button className={mode === "segments" ? "active" : ""} onClick={() => switchMode("segments")}>
            <span className="dot" />Supply Chain
          </button>
          <button className={mode === "personas" ? "active" : ""} onClick={() => switchMode("personas")}>
            <span className="dot" />Inside the Buyer
          </button>
        </nav>
        <RoiChips motion={t.motion} />
      </header>

      {/* stage */}
      <main className="stage" data-screen-label={mode === "segments" ? "Supply Chain" : "Inside the Buyer"}>
        {/* overview */}
        <div className={`view ${item ? "ex-left" : ""}`}>
          <div className="ov">
            <div className="ov-head">
              <div>
                <div className="ov-kicker">{mode === "segments" ? "Client Matrix · 5 segments" : "Stakeholder Matrix · 6 personas"}</div>
                <h1 className="ov-title">
                  {mode === "segments"
                    ? "One data thread across the energy supply chain"
                    : "Six personas inside every operator & EPC"}
                </h1>
              </div>
              <p className="ov-sub">
                {mode === "segments"
                  ? "Follow the Smart Manufacturing Record from steel mill to operating asset. Select any link to see needs, friction, value & content."
                  : "The people who evaluate, buy and live with SteelTrace. Select a persona to see what they need and how we win them."}
              </p>
            </div>
            {mode === "segments"
              ? <SupplyChain segments={SEGMENTS} onOpen={setSelected} />
              : <PersonaCluster personas={PERSONAS} onOpen={setSelected} />}
          </div>
        </div>

        {/* detail */}
        {item && (
          <Detail item={item} kind={mode} list={list}
                  onBack={() => setSelected(null)} onSwitch={setSelected} />
        )}
      </main>

      {/* footer commitment */}
      <footer className="footerbar">
        <div className="commit">
          <span className="tag">Our commitment</span>
          {mode === "segments" ? COMMITMENTS.segments : COMMITMENTS.personas}
        </div>
        <div className="foot-hint">{item ? "Esc · back to overview" : "Select a " + (mode === "segments" ? "segment" : "persona")}</div>
      </footer>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Visual direction" />
        <TweakRadio label="Theme" value={t.theme}
          options={[{ value: "blueprint", label: "Blueprint" }, { value: "control", label: "Control" }, { value: "steel", label: "Light" }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Accent" value={accentHex(t.accent)}
          options={["#57a8dd", "#34cad8", "#e2a23d"]}
          onChange={(hex) => setTweak("accent", hexToAccent(hex))} />
        <TweakSection label="Motion" />
        <TweakRadio label="Animation" value={t.motion}
          options={[{ value: "on", label: "On" }, { value: "off", label: "Reduced" }]}
          onChange={(v) => setTweak("motion", v)} />
        <TweakSlider label="Data-pulse speed" value={t.pulseSpeed} min={1.4} max={6} step={0.2} unit="s"
          onChange={(v) => setTweak("pulseSpeed", v)} />
        <TweakToggle label="Blueprint grid" value={t.grid} onChange={(v) => setTweak("grid", v)} />
        <TweakSection label="Default view" />
        <TweakRadio label="Open on" value={t.startMode}
          options={[{ value: "segments", label: "Supply Chain" }, { value: "personas", label: "Personas" }]}
          onChange={(v) => { setTweak("startMode", v); switchMode(v); }} />
      </TweaksPanel>
    </div>
  );
}

function accentHex(a) { return ({ steel: "#57a8dd", cyan: "#34cad8", amber: "#e2a23d" })[a] || "#57a8dd"; }
function hexToAccent(h) { return ({ "#57a8dd": "steel", "#34cad8": "cyan", "#e2a23d": "amber" })[h] || "steel"; }

// global Esc handler -> back
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const back = document.querySelector(".dt-back");
    if (back) back.click();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
