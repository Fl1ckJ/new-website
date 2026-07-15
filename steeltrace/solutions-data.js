/* SteelTrace — Solutions content (from the Client & Stakeholder matrices).
   One source of truth for solutions.html (overview) and solution.html (detail).
   Two groups: "supply" = customer segments across the supply chain;
   "role" = buyer personas inside operators & EPCs. Edit entries here to update both pages.

   value  = Benefits        — { t: short heading, d: description } (from "How SteelTrace Creates Value")
   content = Key features    — { t: title, d: description }        (from "Key Content for Website") */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var GRAD = {
    op:   "linear-gradient(135deg,#1f5969,#2b8fb0)",
    epc:  "linear-gradient(135deg,#2a3f6b,#3f6fd0)",
    wld:  "linear-gradient(135deg,#7a4a1f,#d08a3a)",
    mfg:  "linear-gradient(135deg,#5a3550,#9c4f7e)",
    ndt:  "linear-gradient(135deg,#1f6b4b,#2fae6e)",
    exec: "linear-gradient(135deg,#3a4550,#5d7184)",
    qaqc: "linear-gradient(135deg,#1f5969,#2b8fb0)",
    pm:   "linear-gradient(135deg,#2a3f6b,#3f6fd0)",
    ops:  "linear-gradient(135deg,#1f6b4b,#2fae6e)",
    dig:  "linear-gradient(135deg,#5a3550,#9c4f7e)"
  };

  var SOLUTIONS = [
    /* ---------- supply chain ---------- */
    {
      id: "op", code: "OP", group: "supply", name: "Operators", img: "op.png", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Asset owners who build and operate the infrastructure, and define the rules the supply chain adopts.",
      who: "Speed of major capital projects by enabling automated compliance and digital handover. Enable trust with blockchain based traceability.",
      needs: [
        "Confidence in supply-chain manufacturing quality",
        "Real-time visibility during construction, not after",
        "End-to-end traceability for regulators & integrity",
        "A trusted data foundation for Digital Twins & AI"
      ],
      challenges: [
        "Limited visibility into manufacturing quality during execution",
        "Documentation delivered months after completion",
        "Fragmented data across multiple supplier tiers",
        "Aging assets & tightening regulatory pressure (e.g. PHMSA 192/193/195)"
      ],
      value: [
        { t: "Real-time visibility", d: "See manufacturing and quality data across every supplier tier as it is produced, not months after completion." },
        { t: "Smart Manufacturing Records", d: "Structured, queryable digital records replace static PDF Manufacturing Record Books." },
        { t: "Faster handover", d: "Reach operations sooner, with handover documentation already complete and verified at mechanical completion." },
        { t: "A lifecycle data foundation", d: "Trusted, structured data underpinning integrity management, analytics, AI and Digital Twins." }
      ],
      content: [
        { t: "Value for Operators", d: "How SteelTrace protects integrity, compliance and long-term asset value." },
        { t: "Strategic Priorities of Energy Operators", d: "Mapped to safety, capital efficiency and tightening regulation." },
        { t: "Hydrogen, CCS & Energy Transition Use Cases", d: "Traceability for hydrogen, CCS and CO₂ transport infrastructure." },
        { t: "Tier-1 Pilot Case Study", d: "Measured outcomes from a tier-1 operator deployment." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["^Build critical infrastructure with", "confidence."],
          body: "Operators depend on quality work across a supply chain they can barely see, then live with the result for decades. SteelTrace gives you real-time visibility into manufacturing quality across the entire chain, replacing fragmented documents with trusted Smart Manufacturing Records. The result: lower project risk, faster delivery, and a trusted data foundation for compliance, asset integrity, digital twins and AI."
        },
        pathways: [
          { t: "Executive Leadership", d: "The business case", href: "solution-exec.html" },
          { t: "Quality (QA / QC)", d: "Control and defensibility", href: "solution-qaqc.html" },
          { t: "Project Management", d: "Schedule and clean handover", href: "solution-pm.html" },
          { t: "Operations & Integrity", d: "Safe for the life of the asset", href: "solution-ops.html" },
          { t: "Digital Transformation", d: "The data foundation", href: "solution-dig.html" }
        ],
        groups: [
          {
            label: "01",
            title: "Reduce project risk",
            word: "Build with confidence",
            lede: "Lower the risk you carry, by seeing quality as it happens instead of discovering it at handover.",
            topics: [
              { t: "Real visibility across the whole chain.",
                s: "See materials, inspections and approvals across every tier of supplier in one place and one format, not scattered across vendor portals and inboxes." },
              { t: "Problems surface at source.",
                s: "Non-conformities and documentation gaps are caught during manufacture and inspection, while there is still time to act, not after they have reached the critical path." },
              { t: "Records that hold up.",
                s: "Immutable, attributable Smart Manufacturing Records reduce compliance and litigation exposure and stand up to regulator and audit scrutiny on demand." }
            ]
          },
          {
            label: "02",
            title: "Accelerate delivery",
            word: "Deliver sooner",
            lede: "Bring first production forward by building the verified record as the work happens, not after it.",
            stats: [
              { n: "~6", u: "wks", l: "Earlier startup, a major subsea project (est.)" },
              { n: "Days", l: "Handover in days, not months" },
              { n: "~20", u: "%", l: "CAPEX contingency protected" }
            ],
            topics: [
              { t: "Near-instant handover.",
                s: "The record is built and verified during the project campaign, so handover takes days instead of months. On a current major subsea project, roughly six weeks earlier startup was estimated." },
              { t: "Protect your contingency.",
                s: "Catching issues early keeps late rework, the thing that eats the buffer (around 20% of CAPEX), off the schedule." },
              { t: "Earlier project handover, earlier revenue.",
                s: "Every week pulled out of the schedule on a megaproject is a week of production and revenue brought forward." }
            ]
          },
          {
            label: "03",
            title: "A trusted data foundation",
            word: "Built to last",
            lede: "Turn the quality record into an asset that keeps paying back long after startup.",
            topics: [
              { t: "One source of truth, in your environment.",
                s: "Verified manufacturing data lands in the operator's own systems and connects projects, supply chain and operations, not stranded in a vendor silo." },
              { t: "The foundation for compliance, integrity, twins and AI.",
                s: "Structured, trusted data feeds asset integrity decisions, regulatory compliance, digital twins and AI initiatives that all stall without it." },
              { t: "Persists for the life of the asset.",
                s: "The record carries from project into operations and through to decommissioning, underpinning integrity and long-term value." }
            ]
          }
        ]
      }
    },
    {
      id: "epc", code: "EPC", group: "supply", name: "EPC Contractors", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Contractors coordinating construction: from fabrication yards to offshore installation vessels.",
      who: "Engineering, Procurement and Construction contractors coordinating pipeline construction: from spoolbases and fabrication yards to offshore installation vessels and third-party inspectors.",
      needs: [
        "On-time, on-budget project execution",
        "Efficient management of supplier documentation",
        "Continuous insight into supplier production quality",
        "Lower QA/QC workload during project close-out"
      ],
      challenges: [
        "Massive volumes of supplier docs to coordinate",
        "MRBs assembled manually after project completion",
        "Limited interoperability between contractor systems",
        "Operator demands for faster, cleaner handover packages"
      ],
      value: [
        { t: "Automated digital MRBs", d: "Manufacturing Record Books generated during production, not assembled by hand at close-out." },
        { t: "Real-time supplier quality", d: "Continuous visibility into supplier production quality across the whole project." },
        { t: "Works with your tools", d: "Integrates with the welding, inspection and project QA platforms already in use." },
        { t: "Cleaner close-out", d: "Less QA/QC effort and cleaner handover deliverables to the operator." }
      ],
      content: [
        { t: "Value for EPC Contractors", d: "How SteelTrace cuts documentation load and de-risks close-out." },
        { t: "Digital MRB Capabilities", d: "What the automated, production-time Record Book includes." },
        { t: "Project Execution Use Cases", d: "Where SteelTrace fits across the construction timeline." },
        { t: "Spoolbase & Offshore Vessel Integration", d: "Capturing data from fabrication yards to installation vessels." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["^Deliver complex projects with greater", "confidence and control."],
          body: "EPCs carry the delivery risk on projects built by a supply chain they can barely see, under contracts that punish every slip. SteelTrace gives you real-time visibility into supplier quality and production progress, automates your QA/QC workflows and Smart Manufacturing Records, and accelerates delivery by cutting manual effort, rework and approval delays."
        },
        groups: [
          {
            label: "01",
            title: "Supplier and schedule control",
            word: "Stay in control",
            lede: "Get control of the supply chain you are accountable for, before problems reach your schedule.",
            topics: [
              { t: "See supplier quality and progress in real time.",
                s: "Track production status and conformance across every tier of your supply base in one place, instead of chasing updates across vendors and portals." },
              { t: "Catch non-conformities at source.",
                s: "Defects and documentation gaps surface during manufacture and inspection, while there is still float to absorb them, not at FAT or on site when they threaten a milestone." },
              { t: "Spot a slipping vendor early.",
                s: "Conformance and documentation status per supplier make an underperforming vendor visible while you can still act, not at the expediting crunch." }
            ]
          },
          {
            label: "02",
            title: "Efficiency and margin",
            word: "Deliver leaner",
            lede: "Protect the margin by taking manual effort, rework and delay out of delivery.",
            stats: [
              { n: "~60", u: "%", l: "Fewer manual QA/QC hours (est.)" },
              { n: "Fewer", l: "Rework and resubmission cycles" }
            ],
            topics: [
              { t: "Automate QA/QC workflows.",
                s: "Automated verification of manufacturing and inspection data cuts the manual document checking that consumes your quality team." },
              { t: "Cut rework and approval delays.",
                s: "Verified-complete records the first time reduce the back-and-forth and resubmission cycles that stall approvals and burn hours." },
              { t: "Smart Manufacturing Records build themselves.",
                s: "The record assembles and verifies as the work happens, so effort is spread across the campaign instead of piled into a closeout scramble." }
            ]
          },
          {
            label: "03",
            title: "Proof of delivery",
            word: "Prove it",
            lede: "Give the client a handover that holds up, and give yourself the record to defend your position.",
            stats: [
              { n: "Days", l: "Handover in days, not months" },
              { n: "One", l: "Record to defend claims and back-charges" }
            ],
            topics: [
              { t: "A handover-ready data book, as you go.",
                s: "The MRB assembles structured and searchable during the project campaign, so handover takes days instead of months and acceptance does not stall." },
              { t: "Provable, defensible records.",
                s: "Immutable, attributable Smart Manufacturing Records give the client confidence and give you the evidence to defend against disputed claims and back-charges." },
              { t: "Accelerated delivery, protected reputation.",
                s: "Faster, cleaner handover strengthens your delivery record and your standing for the next award." }
            ]
          }
        ]
      }
    },
    {
      id: "wld", code: "WLD", group: "supply", name: "Welding, NDT & Coating Contractors", img: "wld.png", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Welding contractors and fabricators running internal welding-data and qualification workflows.",
      who: "Pipeline welding contractors and fabricators running internal welding data platforms, automated inspection systems and welder qualification workflows.",
      needs: [
        "Standardized data exchange with EPCs & operators",
        "Less manual reporting and documentation effort",
        "Welding records integrated with materials & NDT data",
        "Demonstrable welding quality at project close-out"
      ],
      challenges: [
        "Welding data trapped inside internal systems",
        "Manual reporting to EPCs & operators per project",
        "Limited integration with material & inspection data",
        "Repetitive documentation work at project close-out"
      ],
      value: [
        { t: "Welding data flows in", d: "Welding parameters and inspection results enter the Smart Manufacturing Record automatically." },
        { t: "Build once, reuse everywhere", d: "Standardized exchange with EPCs and operators, no rebuilding per project." },
        { t: "Connected records", d: "Welding records linked to upstream materials and downstream inspections." },
        { t: "Less manual reporting", d: "Documentation workload replaced by structured data exchange." }
      ],
      content: [
        { t: "Value for Welding Contractors", d: "How SteelTrace removes repetitive reporting at close-out." },
        { t: "Welding Data Integration", d: "Connecting internal welding platforms to the SMR." },
        { t: "Welder & WPS Qualification Records", d: "Qualifications captured and carried with the weld data." },
        { t: "Connector / Plugin Documentation", d: "How to link your systems via connectors and plugins." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["^Connect your data to the", "entire supply chain."],
          body: "You generate some of the most critical quality data on the project, then spend hours reformatting it for every client, disconnected from the material records it belongs to. SteelTrace integrates with the software you already use and combines your welding, coating and inspection data with material certificates and manufacturing records from upstream suppliers. The result is one connected Smart Manufacturing Record that cuts your reporting effort, strengthens traceability, and makes your quality visible to the EPCs and operators you work for."
        },
        groups: [
          {
            label: "01",
            title: "Connected data",
            word: "Part of one record",
            lede: "Your data stops living in isolation and becomes part of the connected chain.",
            stats: [
              { n: "One", l: "Connected record, joined to upstream" },
              { n: "Heat", l: "Traceability down to the heat number" }
            ],
            topics: [
              { t: "Works with the software you already use.",
                s: "SteelTrace integrates with your existing systems, so your data flows in without ripping out your tools or learning a new way to work." },
              { t: "Joined to the upstream record.",
                s: "Your welding, NDT and coating data combines with the material certificates and manufacturing records it depends on, into one connected Smart Manufacturing Record." },
              { t: "Traceability all the way down.",
                s: "Weld, test and coating results tie back to heat numbers and material history, so a component's full story is intact and provable." }
            ]
          },
          {
            label: "02",
            title: "Less reporting effort",
            word: "Report once",
            lede: "Do the reporting once, not once per client in once per format.",
            stats: [
              { n: "Once", l: "Reported once, every client served" },
              { n: "Fewer", l: "Manual reporting hours and resubmissions" }
            ],
            topics: [
              { t: "Stop reformatting the same data.",
                s: "Enter and capture results once; the connected record serves every client instead of a fresh report package for each one." },
              { t: "Less manual document work.",
                s: "Automated capture and verification cut the hours your team spends assembling, checking and reissuing reports." },
              { t: "Fewer resubmissions.",
                s: "Verified-complete records the first time reduce the rejection and rework cycles that eat into your margin." }
            ]
          },
          {
            label: "03",
            title: "Greater value to clients",
            word: "Stand out",
            lede: "Turn your quality into a reason clients keep choosing you.",
            topics: [
              { t: "Make your quality visible.",
                s: "Clean, traceable, connected records let your workmanship show, instead of disappearing into a pile of PDFs that make you look like everyone else." },
              { t: "Be the contractor who makes handover easy.",
                s: "Data that lands ready to use makes you the supplier EPCs and operators want back, not the one they chase for paperwork." },
              { t: "Provable work, protected position.",
                s: "Immutable, attributable records demonstrate exactly what you delivered, strengthening your standing and defending your work if it is ever questioned." }
            ]
          }
        ]
      }
    },
    {
      id: "mfg", code: "MFG", group: "supply", name: "Manufacturers & Material Suppliers", img: "mfg.png", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Steel mills, pipe makers, coating and clad layers producing components and critical production data.",
      who: "Steel mills, pipe manufacturers, coating companies, clad layers and other material suppliers that produce pipeline components & generate critical production data.",
      needs: [
        "Standardized digital data exchange with project stakeholders",
        "Less effort compiling MRBs and customer documentation",
        "Integration with existing production / MES systems",
        "Recognition for quality & on-time delivery"
      ],
      challenges: [
        "Manufacturing data stored in internal MES & production systems",
        "Manual certificate & documentation creation per customer",
        "Limited integration with downstream contractors",
        "Significant effort compiling Manufacturing Record Books"
      ],
      value: [
        { t: "A layer above your MES", d: "SteelTrace sits above internal production systems, no rip-and-replace." },
        { t: "Certificates flow automatically", d: "Material certs and manufacturing records flow into the SMR without manual rework." },
        { t: "One channel for every customer", d: "A single standardized exchange across multiple operator customers." },
        { t: "Verified melt-to-product traceability", d: "Traceability from melt to end product, visible to operators." }
      ],
      content: [
        { t: "Value for Manufacturers & Suppliers", d: "How SteelTrace reduces documentation effort per customer." },
        { t: "Mill, Pipe & Coating Data Integration", d: "Capturing data from mills, pipe makers, coating and clad lines." },
        { t: "Materials Traceability: Melt to End Product", d: "A full chain of custody for every component." },
        { t: "MES / ERP Connector Documentation", d: "How to integrate with existing production systems." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["^Unlock the value of your", "manufacturing data."],
          body: "The data your production already generates is locked inside your systems and buried in manual reports that slow down release and payment. SteelTrace integrates with your existing production systems and connects your manufacturing data to the digital supply chain. Automatically generate Smart Manufacturing Records, cut manual reporting, and give EPCs and operators trusted, standardized data in real time."
        },
        groups: [
          {
            label: "01",
            title: "Unlock your data",
            word: "Data that works for you",
            lede: "Turn the data your production already creates into a connected asset instead of a filing task.",
            topics: [
              { t: "Integrates with your production systems.",
                s: "SteelTrace connects to the MES, ERP and quality systems you already run, so data flows from where it lives without new manual entry." },
              { t: "Connected to the digital supply chain.",
                s: "Your material and manufacturing data joins one connected Smart Manufacturing Record instead of sitting isolated in your systems." },
              { t: "You are the origin of traceability.",
                s: "Heat numbers, material certificates and test results anchor the record every tier above you depends on, with your data as the trusted source." }
            ]
          },
          {
            label: "02",
            title: "Automate reporting",
            word: "Report without the grind",
            lede: "Turn documentation from a manual cost into an automatic output of production.",
            stats: [
              { n: "Auto", l: "Records generate themselves from production data" },
              { n: "Fewer", l: "Manual reporting hours and rejections" }
            ],
            topics: [
              { t: "Smart Manufacturing Records generate themselves.",
                s: "The data package assembles from your production data as you make the product, not in a manual push at the end." },
              { t: "Cut manual reporting.",
                s: "Automated capture and verification remove the transcription, checking and compiling hours that tie up your quality team." },
              { t: "Fewer errors and rejections.",
                s: "Standardized, verified-complete records reduce the client rejections and resubmission cycles that delay acceptance." }
            ]
          },
          {
            label: "03",
            title: "Deliver trusted data",
            word: "Become the supplier they choose",
            lede: "Use trusted, standardized data to get paid faster and win the next order.",
            stats: [
              { n: "Ready", l: "Documentation ready at shipment" },
              { n: "Faster", l: "Release and payment" }
            ],
            topics: [
              { t: "Standardized data, in real time.",
                s: "Clients get complete data in a consistent format as it is produced, not weeks later in whatever shape you can assemble." },
              { t: "Faster release and payment.",
                s: "Documentation that is ready at shipment removes the paperwork holds that delay release and slow down invoicing." },
              { t: "Stand out from commodity competition.",
                s: "Trusted, connected quality data makes you easier to qualify and harder to replace, turning your quality into a competitive edge instead of an invisible cost." }
            ]
          }
        ]
      }
    },
    {
      id: "ndt", code: "NDT", group: "supply", name: "Testing & Inspection Companies", img: "ndt.png", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "NDT providers, AUT specialists and labs verifying materials, welds and coatings.",
      who: "NDT service providers, AUT specialists, destructive & non-destructive testing labs and on-site inspection companies verifying materials, welds and coatings.",
      needs: [
        "Inspection results delivered as data, not just reports",
        "Integration with supplier & manufacturing records",
        "Less time spent on documentation & reporting",
        "Strong traceability across project stakeholders"
      ],
      challenges: [
        "Inspection findings still delivered as PDFs & report bundles",
        "Limited integration with supplier & manufacturing data",
        "Time-consuming documentation & report assembly",
        "Difficult traceability across multi-tier projects"
      ],
      value: [
        { t: "Results as data", d: "NDT, AUT and lab results integrated directly into the SMR, not just PDFs." },
        { t: "Live for operators & EPCs", d: "Real-time visibility on inspections for operators and EPCs." },
        { t: "Immutable approvals", d: "Inspection approvals become digitally verified, immutable records." },
        { t: "Audit-ready", d: "Stronger compliance and audit readiness across every project." }
      ],
      content: [
        { t: "Value for Inspection & Testing Companies", d: "How SteelTrace turns reports into connected data." },
        { t: "NDT, AUT & Lab Data Integration", d: "Feeding inspection results into the shared record." },
        { t: "Digital Inspection Approvals", d: "Cryptographically signed, verifiable endorsements." },
        { t: "Third-Party Inspector Workflows", d: "Witness and endorsement flows for independent inspectors." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["^Make your inspection data part of the", "bigger picture."],
          body: "Your customers are moving from documents to data, while inspection results still arrive as paper certificates and PDF reports. SteelTrace lets Testing and Inspection Companies deliver structured digital inspection results instead, automatically integrated with manufacturing, material and welding data into one connected Smart Manufacturing Record. The result is less reporting effort for you and far greater value for the customers you serve."
        },
        groups: [
          {
            label: "01",
            title: "From documents to data",
            word: "Deliver data, not PDFs",
            lede: "Meet customers where they are heading, by delivering results as structured data instead of paper.",
            stats: [
              { n: "Data", l: "Structured results, not PDFs" },
              { n: "Fewer", l: "Manual reporting hours" }
            ],
            topics: [
              { t: "Structured digital results.",
                s: "Deliver inspection outcomes as clean, structured data your customers can use directly, not certificates and PDFs they have to re-key." },
              { t: "Move with the market.",
                s: "As operators and EPCs shift to data-driven workflows, you arrive ready for how they want to work, not a step behind it." },
              { t: "Less reporting effort.",
                s: "Automated capture and verification cut the manual hours your inspectors spend assembling and reissuing report packages." }
            ]
          },
          {
            label: "02",
            title: "Connected, in context",
            word: "Part of the whole record",
            lede: "Your verdict lands where it matters, joined to the data it validates.",
            topics: [
              { t: "Integrated with the full record.",
                s: "Your inspection data connects automatically with manufacturing, material and welding data in one Smart Manufacturing Record, seen in the context it verifies." },
              { t: "Traceable and attributable to you.",
                s: "Every result carries proof of who inspected, when and against what, so your independent verdict stays clearly yours, not blended into the background." },
              { t: "One connected chain.",
                s: "Your findings tie back to heat numbers, welds and material history, closing the loop on traceability rather than sitting in a separate silo." }
            ]
          },
          {
            label: "03",
            title: "Greater value, stay essential",
            word: "Worth more to your customers",
            lede: "Turn a modern, connected service into a reason customers keep choosing you.",
            stats: [
              { n: "Immutable", l: "Attributable and tamper-proof results" }
            ],
            topics: [
              { t: "More valuable to customers.",
                s: "Data that lands ready to use makes your service noticeably more useful than a PDF, and harder to swap for a cheaper alternative." },
              { t: "Independence, made more visible.",
                s: "Structured, attributable records put your impartial verdict front and centre in the data customers rely on, reinforcing the authority you sell." },
              { t: "Provable, immutable results.",
                s: "Tamper-resistant records protect the integrity of your findings and guard against falsification, including AI-generated false results, which is exactly what an independent verifier should stand for." }
            ]
          }
        ]
      }
    },

    /* ---------- by role ---------- */
    {
      id: "exec", code: "EXEC", group: "role", name: "Executive Leadership", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "VP / Director of Quality, Engineering, Operations, Integrity and Supply Chain at IOCs, NOCs and tier-1 EPCs.",
      who: "Do you feel your organisation can be leaner, respond quicker and be more centralised?\n\nSpeed of major capital projects by enabling automated compliance and digital handover. Enable trust with blockchain based traceability.",
      needs: [
        "Protect CAPEX and reduce project execution risk",
        "Operate complex assets with leaner teams",
        "Enable enterprise digital, AI and Digital Twin agendas",
        "Preserve long-term asset value & license to operate"
      ],
      challenges: [
        "Project delays driven by documentation bottlenecks",
        "Aging workforce & knowledge drain",
        "Poor data quality blocking AI / Digital Twin initiatives",
        "Rising regulatory & traceability requirements"
      ],
      value: [
        { t: "Compliance by design", d: "Compliance built into the supply chain, not chased after the fact." },
        { t: "Proven efficiency gains", d: "74% fewer NCRs and up to 60% less QA/QC effort in a tier-1 pilot." },
        { t: "A foundation for AI", d: "Trusted, structured data for AI, analytics and Digital Twins." },
        { t: "Protects asset value", d: "Lifecycle traceability that preserves residual asset value." }
      ],
      content: [
        { t: "Executive Brief / Business Case", d: "The strategic case for SteelTrace at a glance." },
        { t: "Strategic Priorities of Energy Operators", d: "How SteelTrace maps to enterprise priorities." },
        { t: "Tier-1 Operator Pilot Results", d: "Quantified outcomes from a reference deployment." },
        { t: "ROI & Value Model", d: "Cost, risk and payback modelled for your portfolio." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["Leaner.", "Faster.", "One source of truth."],
          body: "Every operator wants to run leaner, respond quicker, and pull a fragmented supply chain into a single source of truth. SteelTrace is how you get there, turning the quality record from a paperwork liability into the trusted, structured data your projects, operations and digital systems run on."
        },
        groups: [
          {
            label: "01",
            title: "Cost Reduction",
            word: "Leaner",
            lede: "Run leaner: strip cost, delay and contingency out of major capital projects.",
            stats: [
              { n: "~6", u: "wks", l: "Earlier first oil" },
              { n: "~$400M-1.2B", l: "Delay avoided, one project" },
              { n: "~20", u: "%", l: "CAPEX held as contingency" },
              { n: "~60", u: "%", l: "Fewer inspection hours" }
            ],
            topics: [
              { t: "Earlier first oil, earlier revenue.",
                s: "The record is built and verified during the campaign, so handover is near-instant instead of months. Subsea 7 estimated ~6 weeks earlier startup on a current Chevron project. Schedule is the single biggest business-case lever on a megaproject." },
              { t: "Keep defects off the critical path.",
                s: "Early non-conformity detection avoids delay, rework and surplus contingency (~20% of CAPEX). Rough delay-avoidance on one major project: ~$400M-$1.2B, plus freed contingency and up to ~60% fewer inspection hours." },
              { t: "Lower compliance and litigation exposure; higher asset value.",
                s: "Pre-audited immutable records cut audit load and regulatory exposure (PHMSA, EPA, OSHA, BSEE); certified material history lifts residual/resale value and speeds divestment due diligence." }
            ]
          },
          {
            label: "02",
            title: "Digitisation",
            word: "Faster",
            lede: "Respond quicker: automate the manual work and build the data foundation your digital ambitions depend on.",
            topics: [
              { t: "Do more with fewer resources.",
                s: "Automated verification of manufacturing and inspection data cuts manual QA/QC and documentation workload across the organisation." },
              { t: "The data foundation for digital twins and AI.",
                s: "Structured manufacturing data becomes a trusted source for twins, analytics and decision support, initiatives that otherwise stall on unreliable data." },
              { t: "Compliance by design, not by audit.",
                s: "Verifiable, traceable records (proof of human, company, integrity) reduce systemic risk, including the rising risk of AI-falsified records." }
            ]
          },
          {
            label: "03",
            title: "Centralisation",
            word: "One source of truth",
            lede: "Pull a fragmented chain into one source of truth, visible, persistent, and in your environment.",
            topics: [
              { t: "Transparency across the global supply chain.",
                s: "One place, one format: real visibility into materials, inspections and approvals across every tier of a complex supplier network." },
              { t: "A lifecycle data foundation.",
                s: "Manufacturing data persists from project into operations and decommissioning, underpinning asset integrity and longevity." },
              { t: "A single source of truth in your environment.",
                s: "Data lands in the operator's own environment and connects projects, supply chain, operations and digital systems, a shared workflow, not vendor lock-in." }
            ]
          }
        ]
      }
    },
    {
      id: "qaqc", code: "QA", group: "role", name: "QA / QC", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "QA/QC managers, project engineers, supplier-quality leads and inspection coordinators.",
      who: "QA/QC managers, project QA/QC engineers, supplier quality leads and inspection coordinators. The primary daily users of SteelTrace.",
      needs: [
        "Verify supplier data against QCP / ITP requirements",
        "Catch NCRs early, before they impact installation",
        "Reduce time spent on document review",
        "Stay audit-ready at any moment"
      ],
      challenges: [
        "Manual review of mill certs, NDT reports, weld & coating records",
        "Late discovery of non-conformances",
        "Documentation arriving long after manufacturing",
        "Time-consuming audit preparation"
      ],
      value: [
        { t: "Automated validation", d: "Rule-based checks against QCP / ITP requirements, run automatically." },
        { t: "Real-time supplier data", d: "Live visibility into supplier quality data as it arrives." },
        { t: "Immutable audit trail", d: "A blockchain-secured, tamper-evident record of every action." },
        { t: "Less document chasing", d: "Time shifts from document review to engineering oversight." }
      ],
      content: [
        { t: "Smart Manufacturing Records Overview", d: "What lives inside an SMR and how it is built." },
        { t: "QCP / ITP Automation", d: "Turning inspection plans into automated rulesets." },
        { t: "Sample Digital MRB", d: "A worked example of a digital Record Book." },
        { t: "Compliance-by-Design", d: "Catching non-conformances before installation." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["See everything.", "Control everything.", "Find anything."],
          body: "Quality lives or dies on the record, and today that record is scattered across inboxes, portals and binders, checked by hand, trusted on faith. SteelTrace verifies every certificate and inspection report against requirements automatically, surfaces non-conformities at source, and lands it all in one structured, searchable place you control."
        },
        groups: [
          {
            label: "01",
            title: "Insight",
            word: "See everything",
            lede: "More insight: know what's actually in your records, not just that a document exists.",
            stats: [
              { n: "Every", l: "Certificate verified for content, not just receipt" },
              { n: "Live", l: "Outstanding & missing docs across every PO and vendor" }
            ],
            topics: [
              { t: "Verify content, not just receipt.",
                s: "Automated checks confirm certificates are complete and internally consistent, heat numbers tie across MTR, weld map and NDT report; certs match the ITP, instead of a manual existence check." },
              { t: "Know your gaps in real time.",
                s: "See outstanding and missing documentation across every PO and vendor as the campaign runs, not at the MRB-compilation scramble when it's too late." },
              { t: "Turn quality data into intelligence.",
                s: "Structured records let you trend recurring non-conformities by supplier, process or material, so quality informs decisions instead of sitting in a binder." }
            ]
          },
          {
            label: "02",
            title: "Control",
            word: "Control everything",
            lede: "Better control: catch issues at source and hold the line on every requirement, every time.",
            stats: [
              { n: "~60", u: "%", l: "Fewer manual inspection hours (est.)" },
              { n: "Early", l: "NCRs caught at source, off the critical path" }
            ],
            topics: [
              { t: "Catch non-conformities early.",
                s: "Detection during manufacture and inspection keeps defects off the critical path, rather than surfacing them at handover when correction is hardest." },
              { t: "Enforce acceptance criteria consistently.",
                s: "Verification against spec and code on every certificate, no manual sampling gaps, no item slipping through, hold and witness points respected." },
              { t: "Defensible, attributable, tamper-proof.",
                s: "Immutable records carrying proof of human, company and integrity stand up to audit and third-party inspection, and resist falsification, including the rising risk of AI-generated false records." }
            ]
          },
          {
            label: "03",
            title: "Centralisation",
            word: "Find anything",
            lede: "Centralised access: one place, one format, across the whole supply chain and the whole lifecycle.",
            stats: [
              { n: "Days", l: "Data book at handover, not months" },
              { n: "One", l: "Place & format for every supplier tier" }
            ],
            topics: [
              { t: "One source for every cert and report.",
                s: "Materials, inspections and approvals across every tier of supplier in a single place and format, no more chasing PDFs across inboxes and portals." },
              { t: "The record book builds itself.",
                s: "The MRB / data book assembles as you go, structured and searchable, near-instant at handover instead of months of manual compilation." },
              { t: "Findable for the life of the asset.",
                s: "Data persists into operations and decommissioning. Pull any heat number, weld or certificate years later for integrity, repair or audit. And it lives in your environment, not a vendor silo." }
            ]
          }
        ]
      }
    },
    {
      id: "pm", code: "PM", group: "role", name: "Project Management", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Project managers, engineering leads and execution directors. SteelTrace sits inside project CAPEX.",
      who: "Project managers, project engineering leads and project execution directors at operators and EPCs. Typically the budget owner. SteelTrace sits inside project CAPEX.",
      needs: [
        "On-time, on-budget delivery",
        "Predictable approval cycles across suppliers",
        "Real-time view of supplier manufacturing progress",
        "A single source of truth across contractors"
      ],
      challenges: [
        "Documentation delays blocking shipment & installation",
        "Coordinating QA/QC across multiple tiers of suppliers",
        "Late compliance issues triggering rework",
        "Information latency between stakeholders"
      ],
      value: [
        { t: "Faster approval cycles", d: "Digital approval workflows compress cycle times across suppliers." },
        { t: "Earlier issue detection", d: "Compliance issues surface during production, not at installation." },
        { t: "One source of truth", d: "All stakeholders work from the same verified data." },
        { t: "Faster handover", d: "Quicker mechanical completion and handover to operations." }
      ],
      content: [
        { t: "Value Across the Pipeline Lifecycle", d: "Where SteelTrace pays back across a project." },
        { t: "Project Execution Use Cases", d: "How it fits day-to-day project delivery." },
        { t: "Operator & EPC Pilot Case Studies", d: "Results from real project deployments." },
        { t: "FEED / FID Adoption Guide", d: "How to bring SteelTrace in at the right project stage." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["See it coming.", "Stay on schedule.", "Fast handover."],
          body: "Every late surprise on a major project started as something nobody could see: a defect, a missing certificate, a vendor quietly slipping. SteelTrace verifies the quality record as the campaign runs, surfaces problems while there's still float to absorb them, and assembles a handover-ready data book as you go. No closeout scramble. No surprises."
        },
        groups: [
          {
            label: "01",
            title: "Visibility",
            word: "See it coming",
            lede: "No surprises: know the real status of your quality record while you can still act on it.",
            stats: [
              { n: "Verified", l: "Percent-complete reflects reality, not optimism" },
              { n: "Early", l: "Defects & gaps surface while there's still float" }
            ],
            topics: [
              { t: "Status you can trust.",
                s: "Not \u201Cdocument received\u201D but verified-complete, so percent-complete reflects reality instead of optimism, and your reporting holds up." },
              { t: "Early warning on defects and gaps.",
                s: "Non-conformities and missing documentation surface during manufacture and inspection, while there's still float, not at FAT or at site when they hit the critical path." },
              { t: "Vendor and interface performance, in view.",
                s: "Track conformance and documentation across every PO and supplier tier, so a slipping vendor shows up early, not at the expediting crunch." }
            ]
          },
          {
            label: "02",
            title: "Schedule",
            word: "Stay on schedule",
            lede: "On time: keep problems off the critical path and protect the buffer you set aside.",
            stats: [
              { n: "~6", u: "wks", l: "Earlier startup, a major subsea project (est.)" },
              { n: "~20", u: "%", l: "CAPEX contingency protected" }
            ],
            topics: [
              { t: "Keep defects off the critical path.",
                s: "Early detection means correction happens with float to spare, not as a milestone-threatening surprise at handover when it's hardest to fix." },
              { t: "Protect your contingency.",
                s: "Late-surfacing rework is what eats the buffer (~20% of CAPEX); catching issues early keeps contingency intact instead of consumed." },
              { t: "Earlier startup, earlier milestone.",
                s: "The record is built and verified during the campaign, so handover is near-instant instead of months, on a current major subsea project, ~6 weeks earlier startup was estimated." }
            ]
          },
          {
            label: "03",
            title: "Handover & closeout",
            word: "Fast hand over",
            lede: "No closeout scramble: the record book is ready when you are.",
            stats: [
              { n: "Days", l: "Handover-ready data book, not months" },
              { n: "One", l: "Place & format across the whole chain" }
            ],
            topics: [
              { t: "The data book builds itself.",
                s: "The MRB / data book assembles as you go, structured and searchable, handover-ready instead of months of manual compilation at the end." },
              { t: "One source across the whole chain.",
                s: "Materials, inspections and approvals in one place and format, no chasing PDFs across vendors, inboxes and portals during the acceptance push." },
              { t: "A handover that holds up.",
                s: "Immutable, attributable records mean acceptance and sign-off don't stall on disputed or missing documentation, and the record persists straight into operations." }
            ]
          }
        ]
      }
    },
    {
      id: "ops", code: "OPS", group: "role", name: "Operations & Asset Integrity", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Integrity, reliability and O&M leaders responsible for assets after handover.",
      who: "Asset integrity engineers, reliability engineers, operations & maintenance leaders responsible for assets after handover. Long-term beneficiaries of SteelTrace data.",
      needs: [
        "Reliable manufacturing history for every component",
        "Faster root-cause analysis on incidents",
        "Higher-quality inputs to predictive maintenance models",
        "Extend asset lifetime & defer CAPEX"
      ],
      challenges: [
        "Manufacturing data trapped in PDFs & scanned MRBs",
        "Slow retrieval of original certs years after handover",
        "Incomplete traceability on critical components",
        "Hard to integrate with asset integrity systems"
      ],
      value: [
        { t: "Instant manufacturing history", d: "Verified manufacturing and inspection history available on demand." },
        { t: "Lifecycle traceability", d: "Materials, welds and coatings traceable for the asset's whole life." },
        { t: "Feeds your integrity systems", d: "Structured data integrates with integrity and CMMS systems." },
        { t: "Value at end-of-life", d: "Verified residual value at decommissioning and material recovery." }
      ],
      content: [
        { t: "Asset Lifecycle Traceability", d: "Following every component from manufacture to retirement." },
        { t: "Operational Value of SMRs", d: "What digital records deliver after handover." },
        { t: "Hidden Financial Value of Traceable Materials", d: "How traceability defers CAPEX and extends life." },
        { t: "Decommissioning & Material Recovery", d: "Verified provenance for reuse and recovery." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["Know what you're running.", "Decide on data, not assumptions.", "For the life of the asset."],
          body: "You inherit an asset you have to keep safe for decades, but the record that says what it's actually made of is too often incomplete, unverified, or already lost. SteelTrace carries the verified as-built record straight from manufacturing into operations, so every integrity, inspection and fitness-for-service decision rests on real material data, years, and decades, after everyone who built it has moved on."
        },
        groups: [
          {
            label: "01",
            title: "Certainty",
            word: "Know what you're running",
            lede: "Know exactly what's installed: the verified as-built truth, not a binder you hope is complete.",
            topics: [
              { t: "As-built reality, verified.",
                s: "The actual material grades, heat numbers, wall thickness, MDMT, weld and NDT history of what was installed, verified against requirements, not assumed from a spec the metal may not match." },
              { t: "No more lost or incomplete records.",
                s: "The record persists into operations complete and searchable, so you're not reconstructing material history from partial binders at the moment you need it most." },
              { t: "Traceable to the heat.",
                s: "Pull any component back to its heat number, certificate and inspection record, the foundation every integrity assessment stands on." }
            ]
          },
          {
            label: "02",
            title: "Confidence",
            word: "Decide on data, not assumptions",
            lede: "Manage integrity with confidence: base RBI, fitness-for-service and remaining-life calls on real data instead of conservative guesswork.",
            topics: [
              { t: "Sharper risk-based inspection.",
                s: "Reliable material data lets you target RBI and corrosion management on evidence, not on worst-case assumptions that waste inspection effort and money." },
              { t: "Faster, defensible fitness-for-service.",
                s: "When an anomaly appears, the original material properties are already there, so FFS and remaining-life assessments move quickly and hold up, instead of stalling on missing data." },
              { t: "Fewer unknowns, less unplanned risk.",
                s: "Complete, traceable records shrink the gap between what you assume about the asset and what's actually true, the gap where loss-of-containment surprises hide." }
            ]
          },
          {
            label: "03",
            title: "Longevity",
            word: "For the life of the asset",
            lede: "A record that lasts: usable from first oil through operations to decommissioning.",
            topics: [
              { t: "One source, in your environment.",
                s: "Material, inspection and approval data in one place and one format, in the operator's own environment, not scattered across systems, not stranded in a vendor silo." },
              { t: "From handover to decommissioning.",
                s: "The record persists across the full lifecycle, underpinning integrity, repairs, modifications, and eventual divestment or decommissioning." },
              { t: "Audit-ready, always.",
                s: "Immutable, attributable records stand up to regulator and inspection-code scrutiny (PHMSA, BSEE; API 510 / 570 / 653), proof of integrity on demand, whenever it's asked for." }
            ]
          }
        ]
      }
    },
    {
      id: "dig", code: "DIG", group: "role", name: "Digital Transformation", noCode: true, noBenefits: true, noFeatures: true, noCta: true,
      sub: "",
      blurb: "Digital transformation leads, enterprise architecture and Digital Twin / data teams.",
      who: "Digital transformation leads, IT / enterprise architecture, Digital Twin & data teams. Strategic sponsors who care about data foundations more than any one workflow.",
      needs: [
        "Structured, AI-ready data from manufacturing & QA/QC",
        "Integration with ERP, CMMS, EDMS & Digital Twin platforms",
        "Open APIs and no new data silos",
        "Enterprise-grade security & data ownership"
      ],
      challenges: [
        "AI & Digital Twin initiatives stalled by poor data quality",
        "Manufacturing data locked in PDFs & supplier portals",
        "Fragmented data across SCADA, SAP, EDMS & spreadsheets",
        "Building & maintaining homegrown solutions"
      ],
      value: [
        { t: "Structured, AI-ready data", d: "Manufacturing and inspection data captured as structured datasets." },
        { t: "Open APIs & plugins", d: "Connects to ERP, asset integrity and Digital Twin platforms." },
        { t: "Blockchain-secured signing", d: "Cryptographic signatures via EAS on an Ethereum L2." },
        { t: "The missing data layer", d: "The supply-chain data layer the industry has lacked." }
      ],
      content: [
        { t: "Platform Architecture & APIs", d: "How the platform is built and integrated." },
        { t: "Integrations & Plugins", d: "Connectors for the enterprise stack." },
        { t: "Security & Blockchain Infrastructure", d: "Data ownership, security and the signature model." },
        { t: "Digital Twin Enablement", d: "Feeding trusted data into Digital Twin programs." }
      ],
      strategy: {
        lens: true,
        lead: {
          line: ["Trusted data.", "In your architecture.", "Powering twins and AI."],
          body: "Digital twins, analytics and AI don't stall on ambition. They stall on data nobody can trust: unstructured certificates, scanned PDFs, unverified records stranded in vendor portals. SteelTrace turns manufacturing and quality data into a verified, structured, machine-readable source layer, in your architecture, so the twins, models and platforms you're building finally have something real to run on."
        },
        groups: [
          {
            label: "01",
            title: "Foundation",
            word: "Trusted, structured data",
            lede: "Solve the input problem first: a source layer your systems can actually consume and rely on.",
            topics: [
              { t: "Machine-readable, not PDF-readable.",
                s: "Manufacturing and inspection data arrives as structured, queryable data, not documents your platforms have to scrape, OCR and guess at." },
              { t: "Verified at the source.",
                s: "The data is checked complete and consistent against requirements before it ever reaches your systems, so you're not building analytics on unvalidated inputs." },
              { t: "Provenance built in.",
                s: "Every record carries proof of human, company and integrity, the data lineage and trust layer governance and audit demand, and the safeguard against AI-falsified records feeding your models." }
            ]
          },
          {
            label: "02",
            title: "Integration",
            word: "In your architecture",
            lede: "Own the data, in your stack, a foundation to build on, not another silo to integrate around.",
            topics: [
              { t: "Lands in your environment.",
                s: "Data sits in the operator's own environment and systems, not locked in a vendor application you have to extract from later." },
              { t: "Built to connect.",
                s: "Structured data and open access let you feed existing platforms, data lakes and applications, a source layer that plugs into the stack you already run." },
              { t: "No new silo.",
                s: "One place, one format across projects, supply chain and operations, consolidating fragmented data instead of adding another disconnected system to the map." }
            ]
          },
          {
            label: "03",
            title: "Activation",
            word: "Powering twins and AI",
            lede: "Turn the foundation into outcomes: the flagship initiatives you're accountable for, running on data that holds.",
            topics: [
              { t: "A digital twin that reflects reality.",
                s: "As-built material and inspection data grounds the twin in what was actually installed, not a design model that drifts from the physical asset." },
              { t: "AI and analytics you can trust.",
                s: "Reliable, structured inputs mean models and decision support produce results you can stand behind, the difference between a pilot and production." },
              { t: "Time-to-value, not time-to-cleanse.",
                s: "Skip the endless data-remediation phase that sinks digital programs; start with data that's already structured and verified." }
            ]
          }
        ]
      }
    }
  ];

  SOLUTIONS.forEach(function (s) { s.gradient = GRAD[s.id] || GRAD.op; });

  window.STEELTRACE_SOLUTIONS = {
    all: SOLUTIONS,
    supply: SOLUTIONS.filter(function (s) { return s.group === "supply"; }),
    role: SOLUTIONS.filter(function (s) { return s.group === "role"; }),
    byId: function (id) { return SOLUTIONS.filter(function (s) { return s.id === id; })[0] || null; },
    esc: esc
  };
})();
