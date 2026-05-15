import { useState } from "react";

const BRAND_COLORS = {
  primary: "#C8102E",
  dark: "#0A0A0A",
  surface: "#111111",
  card: "#1A1A1A",
  border: "#2A2A2A",
  muted: "#888888",
  text: "#F0F0F0",
  accent: "#E8E0D0",
};

const buildPrompt = (type, inputs) => {
  if (type === "pre") {
    return `Write a PRE-EVENT LinkedIn post for Hindalco Specialty Alumina Business.

Event: ${inputs.eventName}
Date: ${inputs.date}
Venue: ${inputs.venue}
${inputs.booth ? `Hall/Booth: ${inputs.booth}` : ""}
Products/Sub-brands to feature: ${inputs.products}

The post should build anticipation, highlight what Hindalco is bringing to the event, and invite visitors. ${inputs.booth ? "Include the booth number as a CTA." : "End with a CTA to connect or reach out."}`;
  }

  if (type === "during") {
    return `Write a DURING-EVENT LinkedIn post for Hindalco Specialty Alumina Business.

Event: ${inputs.eventName}
Hall/Booth: ${inputs.booth}
Products/Sub-brands featured: ${inputs.products}
What's happening at the booth: ${inputs.highlight}

The post should feel live and energetic. Reflect real engagement happening on the floor. Include the booth number so visitors know where to find us.`;
  }

  if (type === "post") {
    return `Write a POST-EVENT LinkedIn post for Hindalco Specialty Alumina Business.

Event: ${inputs.eventName}
Products/Sub-brands featured: ${inputs.products}
Key outcome: ${inputs.outcome}
Panelists and what they spoke about: ${inputs.panelists}

The post should thank visitors, highlight the conversations and insights shared by the panelists, and close with a forward-looking statement about collaboration or next steps.`;
  }
};

const POST_TYPES = [
  { id: "pre", label: "Pre-Event", icon: "◎" },
  { id: "during", label: "During Event", icon: "●" },
  { id: "post", label: "Post-Event", icon: "◉" },
];

function InputField({ label, value, onChange, placeholder, multiline, optional }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: "600",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: BRAND_COLORS.muted, marginBottom: "6px", fontFamily: "'DM Mono', monospace",
      }}>
        {label}
        {optional && <span style={{ color: "#555", marginLeft: "6px", fontWeight: 400 }}>(optional)</span>}
      </label>
      {multiline ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={3}
          style={{
            width: "100%", background: BRAND_COLORS.surface,
            border: `1px solid ${BRAND_COLORS.border}`, borderRadius: "6px",
            color: BRAND_COLORS.text, padding: "10px 12px", fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif", resize: "vertical",
            outline: "none", boxSizing: "border-box", lineHeight: "1.5",
          }}
        />
      ) : (
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", background: BRAND_COLORS.surface,
            border: `1px solid ${BRAND_COLORS.border}`, borderRadius: "6px",
            color: BRAND_COLORS.text, padding: "10px 12px", fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

function PreEventForm({ inputs, setInputs }) {
  const set = (key) => (val) => setInputs(p => ({ ...p, [key]: val }));
  return (
    <>
      <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. Ceramitec 2026" />
      <InputField label="Date" value={inputs.date || ""} onChange={set("date")} placeholder="e.g. Mar 24–26, 2026" />
      <InputField label="Venue & City" value={inputs.venue || ""} onChange={set("venue")} placeholder="e.g. Messe München, Munich, Germany" />
      <InputField label="Hall / Booth Number" value={inputs.booth || ""} onChange={set("booth")} placeholder="e.g. Hall A5, Stand 105" optional />
      <InputField label="Products / Sub-brands to Feature" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. PrizTec ceramic grades, new boehmite series" multiline />
    </>
  );
}

function DuringEventForm({ inputs, setInputs }) {
  const set = (key) => (val) => setInputs(p => ({ ...p, [key]: val }));
  return (
    <>
      <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. K Fair 2025" />
      <InputField label="Hall / Booth Number" value={inputs.booth || ""} onChange={set("booth")} placeholder="e.g. Hall 6, Booth C42" />
      <InputField label="Products / Sub-brands to Feature" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. InnoSafe ATH grades for polymer compounding" multiline />
      <InputField label="What's Happening at the Booth" value={inputs.highlight || ""} onChange={set("highlight")} placeholder="e.g. Strong interest from European compounders, live demo running" multiline />
    </>
  );
}

function PostEventForm({ inputs, setInputs }) {
  const set = (key) => (val) => setInputs(p => ({ ...p, [key]: val }));
  return (
    <>
      <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. UNITECR 2025" />
      <InputField label="Products / Sub-brands Featured" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. FUSALOX, high-purity calcined alumina" multiline />
      <InputField label="Key Outcome / Highlight" value={inputs.outcome || ""} onChange={set("outcome")} placeholder="e.g. Connected with 40+ refractory manufacturers across Europe and Southeast Asia" multiline />
      <InputField label="Panelists & What They Spoke About" value={inputs.panelists || ""} onChange={set("panelists")} placeholder="e.g. Dr. Amit Sengupta presented on low-cement castables; Saurabh Khedekar spoke on sustainability in refractory-grade alumina" multiline />
    </>
  );
}

const isFormValid = (type, inputs) => {
  if (type === "pre") return inputs.eventName && inputs.date && inputs.venue && inputs.products;
  if (type === "during") return inputs.eventName && inputs.booth && inputs.products && inputs.highlight;
  if (type === "post") return inputs.eventName && inputs.products && inputs.outcome && inputs.panelists;
  return false;
};

export default function App() {
  const [activeType, setActiveType] = useState("pre");
  const [inputs, setInputs] = useState({});
  const [generatedPost, setGeneratedPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTypeChange = (type) => {
    setActiveType(type);
    setInputs({});
    setGeneratedPost("");
    setError("");
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setGeneratedPost("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeType, inputs }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setGeneratedPost(data.post);
    } catch (e) {
      setError(e.message || "Generation failed. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: BRAND_COLORS.dark,
      color: BRAND_COLORS.text, fontFamily: "'DM Sans', sans-serif",
      padding: "32px 24px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;600&family=Fraunces:ital,wght@0,700;1,700&display=swap');
        * { box-sizing: border-box; }
        textarea:focus, input:focus { border-color: ${BRAND_COLORS.primary} !important; }
        textarea::placeholder, input::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "28px", height: "28px", background: BRAND_COLORS.primary,
              borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: "700", color: "#fff", fontFamily: "'DM Mono', monospace"
            }}>H</div>
            <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: BRAND_COLORS.muted, fontFamily: "'DM Mono', monospace" }}>
              Hindalco Specialty Alumina
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", fontFamily: "'Fraunces', serif", color: BRAND_COLORS.accent, lineHeight: 1.2 }}>
            LinkedIn Post Generator
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: BRAND_COLORS.muted, lineHeight: 1.5 }}>
            Generate on-brand LinkedIn posts for expos, trade fairs, and industry events.
          </p>
        </div>

        {/* Type Selector */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "28px",
          background: BRAND_COLORS.surface, padding: "4px",
          borderRadius: "8px", border: `1px solid ${BRAND_COLORS.border}`
        }}>
          {POST_TYPES.map(t => (
            <button key={t.id} onClick={() => handleTypeChange(t.id)} style={{
              flex: 1, padding: "10px 12px", borderRadius: "6px", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: "600",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
              background: activeType === t.id ? BRAND_COLORS.primary : "transparent",
              color: activeType === t.id ? "#fff" : BRAND_COLORS.muted,
            }}>
              <span style={{ marginRight: "6px" }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

          {/* Input Panel */}
          <div style={{ background: BRAND_COLORS.card, border: `1px solid ${BRAND_COLORS.border}`, borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND_COLORS.muted, fontFamily: "'DM Mono', monospace", marginBottom: "18px" }}>
              Input Details
            </div>
            {activeType === "pre" && <PreEventForm inputs={inputs} setInputs={setInputs} />}
            {activeType === "during" && <DuringEventForm inputs={inputs} setInputs={setInputs} />}
            {activeType === "post" && <PostEventForm inputs={inputs} setInputs={setInputs} />}

            <button onClick={generate} disabled={loading || !isFormValid(activeType, inputs)} style={{
              width: "100%", padding: "12px", borderRadius: "6px", border: "none",
              background: isFormValid(activeType, inputs) ? BRAND_COLORS.primary : "#2A2A2A",
              color: isFormValid(activeType, inputs) ? "#fff" : "#555",
              fontSize: "14px", fontWeight: "600",
              cursor: isFormValid(activeType, inputs) ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Generating..." : "Generate Post →"}
            </button>
          </div>

          {/* Output Panel */}
          <div style={{
            background: BRAND_COLORS.card, border: `1px solid ${BRAND_COLORS.border}`,
            borderRadius: "10px", padding: "20px", minHeight: "300px",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND_COLORS.muted, fontFamily: "'DM Mono', monospace" }}>
                Generated Post
              </div>
              {generatedPost && (
                <button onClick={handleCopy} style={{
                  background: "transparent", border: `1px solid ${BRAND_COLORS.border}`,
                  color: copied ? "#4CAF50" : BRAND_COLORS.muted, borderRadius: "4px",
                  padding: "4px 10px", fontSize: "11px", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              )}
            </div>

            {error && (
              <div style={{ color: BRAND_COLORS.primary, fontSize: "13px", padding: "12px", background: "#1A0A0A", borderRadius: "6px" }}>
                {error}
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "12px", animation: "spin 1s linear infinite" }}>◎</div>
                  <div style={{ fontSize: "13px", color: BRAND_COLORS.muted }}>Writing your post...</div>
                </div>
              </div>
            )}

            {!loading && !generatedPost && !error && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px", color: BRAND_COLORS.border }}>◎</div>
                  <div style={{ fontSize: "13px", color: "#333" }}>Fill in the inputs and hit Generate</div>
                </div>
              </div>
            )}

            {generatedPost && (
              <div style={{ fontSize: "14px", lineHeight: "1.7", color: BRAND_COLORS.text, whiteSpace: "pre-wrap", flex: 1, overflowY: "auto", maxHeight: "480px" }}>
                {generatedPost}
              </div>
            )}
          </div>
        </div>

        {/* Regenerate */}
        {generatedPost && (
          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <button onClick={generate} disabled={loading} style={{
              background: "transparent", border: `1px solid ${BRAND_COLORS.border}`,
              color: BRAND_COLORS.muted, borderRadius: "6px", padding: "8px 16px",
              fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>
              ↺ Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
