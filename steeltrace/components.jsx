/* SteelTrace Explorer — presentational components (exported to window) */
const { useState, useEffect, useRef } = React;

/* ---------- tiny icon set (simple geometry only) ---------- */
function Ico({ d, size = 16, sw = 1.7, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"}
         stroke={fill ? "none" : "currentColor"} strokeWidth={sw}
         strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
}
const Icons = {
  arrow: <Ico size={14} d={<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>} />,
  needs: <Ico d={<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>} />,
  challenge: <Ico d={<><path d="M12 3l9 16H3z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" /></>} />,
  value: <Ico d={<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>} />,
  content: <Ico d={<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>} />,
  ext: <Ico size={13} d={<><path d="M7 17L17 7" /><path d="M9 7h8v8" /></>} />,
  node: <Ico size={13} d={<><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>} />,
};

/* ---------- brand mark (hex node + spark) ---------- */
function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 3l14.7 8.5v17L20 37 5.3 28.5v-17z" stroke="var(--accent)" strokeWidth="1.6" />
      <path d="M20 11l7.8 4.5v9L20 29l-7.8-4.5v-9z" fill="var(--accent-soft)" stroke="var(--accent-line)" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="3.1" fill="var(--accent)" />
    </svg>
  );
}

/* ---------- count-up number ---------- */
function CountUp({ end, suffix = "", dur = 1100, motion }) {
  const [n, setN] = useState(motion === "off" ? end : 0);
  const ref = useRef(null);
  useEffect(() => {
    if (motion === "off") { setN(end); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(e * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const failsafe = setTimeout(() => setN(end), 1700);
    return () => { cancelAnimationFrame(raf); clearTimeout(failsafe); };
  }, [end, motion]);
  return <span>{n}{suffix}</span>;
}

/* ---------- ROI chips ---------- */
function RoiChips({ motion }) {
  return (
    <div className="roi">
      <div className="roi-chip">
        <div className="roi-num"><CountUp end={74} suffix="%" motion={motion} /></div>
        <div className="roi-label">Fewer NCRs</div>
      </div>
      <div className="roi-chip">
        <div className="roi-num"><CountUp end={60} suffix="%" motion={motion} /></div>
        <div className="roi-label">Less QA/QC effort</div>
      </div>
    </div>
  );
}

/* ---------- supply-chain node ---------- */
function ChainNode({ seg, i, total, onOpen }) {
  return (
    <button className="node" style={{ "--rin": `${0.06 + i * 0.08}s` }}
            onClick={() => onOpen(seg.code)}>
      {seg.flag && <span className="node-flag">{seg.flag}</span>}
      <div className="node-top">
        <span className="node-idx">{String(i + 1).padStart(2, "0")}</span>
        <span className="node-stage">{seg.stage}</span>
      </div>
      <span className="node-code">{seg.code}</span>
      <div className="node-name">{seg.short}</div>
      <div className="node-bars">
        {Array.from({ length: total }).map((_, k) => (
          <i key={k} className={k <= i ? "on" : ""} />
        ))}
      </div>
      <div className="node-cap">{i + 1} / {total} stages on the record</div>
      <div className="node-foot">
        {Icons.node}<span>Explore</span><span className="arrow">{Icons.arrow}</span>
      </div>
    </button>
  );
}

/* reveal a container's children once mounted (robust: end-state always visible) */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("ready")));
    const safety = setTimeout(() => el && el.classList.add("ready"), 350);
    const failsafe = setTimeout(() => el && el.classList.add("reveal-failsafe"), 1500);
    return () => { cancelAnimationFrame(id); clearTimeout(safety); clearTimeout(failsafe); };
  }, []);
  return ref;
}

/* ---------- supply chain overview ---------- */
function SupplyChain({ segments, onOpen }) {
  const n = segments.length;
  const chainRef = useReveal();
  return (
    <div className="chain-wrap">
      <div className="chain-dir">
        <span className="dir-cap left"><b>Melt · Source</b>Mill, pipe &amp; coating</span>
        <span className="dir-track"><span className="dir-sheen" /></span>
        <span className="dir-cap right"><b>End product · Operate</b>Asset in service</span>
      </div>
      <div className="chain" ref={chainRef}>
        {segments.map((seg, i) => (
          <React.Fragment key={seg.code}>
            <ChainNode seg={seg} i={i} total={n} onOpen={onOpen} />
            {i < n - 1 && (
              <div className="connector" data-seg={i}>
                <span className="track" />
                <span className="pulse" style={{ "--pd": `${i * 0.5}s` }} />
                <span className="pulse" style={{ "--pd": `${i * 0.5 + 1.5}s` }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="smr-rail">
        <span className="rail-line" />
        <span className="rail-label"><span className="blip" />Smart Manufacturing Record · one verified data thread</span>
        <span className="rail-line" />
      </div>
      <div className="flow-legend">
        <span><span className="mk">{Icons.arrow}</span> Data flows downstream</span>
        <span><span className="mk">●</span> Melt → end product traceability</span>
        <span><span className="mk">◆</span> Verified · immutable · auditable</span>
      </div>
    </div>
  );
}

/* ---------- persona card ---------- */
function PersonaCard({ p, i, onOpen }) {
  return (
    <button className="pcard" style={{ "--rin": `${0.05 + i * 0.07}s` }}
            onClick={() => onOpen(p.code)}>
      <div className="pcard-top">
        <span className="pcard-code">{p.code}</span>
        <span className="pcard-role">{p.role}</span>
      </div>
      <div className="pcard-name">{p.short}</div>
      <div className="pcard-who">{p.who}</div>
      <div className="pcard-foot">
        {Icons.node}<span>Open persona</span><span className="arrow">{Icons.arrow}</span>
      </div>
    </button>
  );
}

/* ---------- persona cluster overview ---------- */
function PersonaCluster({ personas, onOpen }) {
  const gridRef = useReveal();
  return (
    <div className="cluster-wrap">
      <div className="cluster-context">
        <span className="pill">Inside IOCs · NOCs · Tier-1 EPCs</span>
        <span>six personas · one buying decision</span>
      </div>
      <div className="persona-grid" ref={gridRef}>
        {personas.map((p, i) => <PersonaCard key={p.code} p={p} i={i} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

/* ---------- highlight ROI numbers inside value rows ---------- */
function withStats(text) {
  const parts = text.split(/(\d+%)/g);
  return parts.map((s, i) => /\d+%/.test(s) ? <b key={i}>{s}</b> : <React.Fragment key={i}>{s}</React.Fragment>);
}

/* ---------- a column of rows ---------- */
function Column({ kind, title, items, icon, baseDelay }) {
  return (
    <div className={`col ${kind}`}>
      <div className="col-head">
        <span className="col-ic">{icon}</span>
        <span className="col-title">{title}</span>
        <span className="col-count">{String(items.length).padStart(2, "0")}</span>
      </div>
      {items.map((it, i) => (
        <div className="row" key={i} style={{ "--d": `${baseDelay + i * 0.06}s` }}>
          <span className="mk">{kind === "challenge" ? "-" : kind === "value" ? "+" : "·"}</span>
          <span>{kind === "value" ? withStats(it) : it}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- detail panel ---------- */
function Detail({ item, kind, list, onBack, onSwitch }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTop = 0;
    el.classList.remove("ready", "reveal-failsafe");
    const id = requestAnimationFrame(() => requestAnimationFrame(() => el && el.classList.add("ready")));
    const safety = setTimeout(() => el && el.classList.add("ready"), 350);
    const failsafe = setTimeout(() => el && el.classList.add("reveal-failsafe"), 1500);
    return () => { cancelAnimationFrame(id); clearTimeout(safety); clearTimeout(failsafe); };
  }, [item && item.code]);
  if (!item) return null;
  const isSeg = kind === "segments";
  return (
    <div className={`detail ${item ? "show" : ""}`} key={item.code}>
      <div className="dt-bar">
        <button className="dt-back" onClick={onBack}>
          <Ico size={13} d={<><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>} />
          {isSeg ? "Supply chain" : "Personas"}
        </button>
        <div className="dt-switcher">
          {list.map((x) => (
            <button key={x.code} className={x.code === item.code ? "active" : ""} onClick={() => onSwitch(x.code)}>{x.code}</button>
          ))}
        </div>
      </div>
      <div className="dt-scroll" ref={scrollRef}>
        <div className="dt-head">
          <div className={`dt-badge ${item.code.length > 3 ? "sm" : ""}`}>{item.code}</div>
          <div className="dt-htext">
            <div className="dt-meta">
              <span className="dt-stage">{isSeg ? item.stage : item.role}</span>
              {item.flag && <span className="dt-stage">{item.flag}</span>}
            </div>
            <h2 className="dt-name">{item.name}</h2>
            <p className="dt-who">{item.who}</p>
          </div>
        </div>
        <div className="dt-grid">
          <Column kind="need" title="What they need" icon={Icons.needs} items={item.needs} baseDelay={0.15} />
          <Column kind="challenge" title="Where it hurts" icon={Icons.challenge} items={item.challenges} baseDelay={0.28} />
          <Column kind="value" title="How SteelTrace delivers" icon={Icons.value} items={item.value} baseDelay={0.42} />
        </div>
        <div className="content-map">
          <div className="cm-head">
            <span className="col-ic" style={{ color: "var(--accent)" }}>{Icons.content}</span>
            <span className="cm-title">Website content map</span>
            <span className="cm-sub">{item.content.length} sections to build</span>
          </div>
          <div className="cm-grid">
            {item.content.map((c, i) => (
              <div className="cm-chip" key={i} style={{ "--d": `${0.55 + i * 0.07}s` }}>
                <span className="cm-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="cm-label">{c}</span>
                <span className="ext">{Icons.ext}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icons, BrandMark, CountUp, RoiChips, SupplyChain, PersonaCluster, Detail });
