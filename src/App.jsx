import { useState } from "react";

const BRAND = {
  bg: "#020C14",
  surface: "#041626",
  card: "#061E30",
  border: "#0D3A52",
  borderLight: "#1A5470",
  primary: "#0EA5C9",
  gradEnd: "#0D9488",
  accent: "#22D3EE",
  accentSoft: "#67E8F9",
  text: "#E8F4F8",
  muted: "#7BAFC4",
  subtle: "#2A5870",
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
  { id: "pre", label: "Pre-Event", icon: "◎", desc: "Announce your presence" },
  { id: "during", label: "During Event", icon: "●", desc: "Live from the floor" },
  { id: "post", label: "Post-Event", icon: "◉", desc: "Recap & thank you" },
];

const isFormValid = (type, inputs) => {
  if (type === "pre") return inputs.eventName && inputs.date && inputs.venue && inputs.products;
  if (type === "during") return inputs.eventName && inputs.booth && inputs.products && inputs.highlight;
  if (type === "post") return inputs.eventName && inputs.products && inputs.outcome && inputs.panelists;
  return false;
};

function InputField({ label, value, onChange, placeholder, multiline, optional }) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    width: "100%",
    background: focused ? "#041E2E" : BRAND.surface,
    border: `1px solid ${focused ? BRAND.primary : BRAND.border}`,
    borderRadius: "8px",
    color: BRAND.text,
    padding: "10px 14px",
    fontSize: "13.5px",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
    lineHeight: "1.5",
  };
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{
        display: "block", fontSize: "10.5px", fontWeight: "600",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: focused ? BRAND.accent : BRAND.muted,
        marginBottom: "6px", fontFamily: "'Inter', sans-serif",
        transition: "color 0.2s",
      }}>
        {label}
        {optional && <span style={{ color: BRAND.subtle, marginLeft: "6px", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optional</span>}
      </label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={3}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...baseStyle, resize: "vertical" }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={baseStyle} />
      )}
    </div>
  );
}

function PreEventForm({ inputs, setInputs }) {
  const set = k => v => setInputs(p => ({ ...p, [k]: v }));
  return (<>
    <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. Ceramitec 2026" />
    <InputField label="Date" value={inputs.date || ""} onChange={set("date")} placeholder="e.g. Mar 24–26, 2026" />
    <InputField label="Venue & City" value={inputs.venue || ""} onChange={set("venue")} placeholder="e.g. Messe München, Munich, Germany" />
    <InputField label="Hall / Booth Number" value={inputs.booth || ""} onChange={set("booth")} placeholder="e.g. Hall A5, Stand 105" optional />
    <InputField label="Products / Sub-brands to Feature" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. PrizTec ceramic grades, new boehmite series" multiline />
  </>);
}

function DuringEventForm({ inputs, setInputs }) {
  const set = k => v => setInputs(p => ({ ...p, [k]: v }));
  return (<>
    <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. K Fair 2025" />
    <InputField label="Hall / Booth Number" value={inputs.booth || ""} onChange={set("booth")} placeholder="e.g. Hall 6, Booth C42" />
    <InputField label="Products / Sub-brands to Feature" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. InnoSafe ATH grades for polymer compounding" multiline />
    <InputField label="What's Happening at the Booth" value={inputs.highlight || ""} onChange={set("highlight")} placeholder="e.g. Strong interest from European compounders, live demo running" multiline />
  </>);
}

function PostEventForm({ inputs, setInputs }) {
  const set = k => v => setInputs(p => ({ ...p, [k]: v }));
  return (<>
    <InputField label="Event Name" value={inputs.eventName || ""} onChange={set("eventName")} placeholder="e.g. UNITECR 2025" />
    <InputField label="Products / Sub-brands Featured" value={inputs.products || ""} onChange={set("products")} placeholder="e.g. FUSALOX, high-purity calcined alumina" multiline />
    <InputField label="Key Outcome / Highlight" value={inputs.outcome || ""} onChange={set("outcome")} placeholder="e.g. Connected with 40+ refractory manufacturers across Europe and Southeast Asia" multiline />
    <InputField label="Panelists & What They Spoke About" value={inputs.panelists || ""} onChange={set("panelists")} placeholder="e.g. Dr. Amit Sengupta on low-cement castables; Saurabh Khedekar on sustainability in refractory-grade alumina" multiline />
  </>);
}

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

  const valid = isFormValid(activeType, inputs);

  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, color: BRAND.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder, input::placeholder { color: ${BRAND.subtle}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${BRAND.surface}; }
        ::-webkit-scrollbar-thumb { background: ${BRAND.borderLight}; border-radius: 2px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Nav Bar */}
      <div style={{
        borderBottom: `1px solid ${BRAND.border}`,
        background: `linear-gradient(135deg, #020F1C 0%, #031828 100%)`,
        padding: "0 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "64px",
        boxShadow: `0 1px 24px rgba(14,165,201,0.08)`,
      }}>
        {/* Left — Hindalco wordmark logo + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src="/hindalco_logo.png" alt="Hindalco" style={{ height: "30px", objectFit: "contain" }} />
          <div style={{ width: "1px", height: "28px", background: `linear-gradient(to bottom, transparent, ${BRAND.borderLight}, transparent)` }} />
          <div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: BRAND.text, letterSpacing: "0.04em" }}>Specialty Alumina</div>
            <div style={{ fontSize: "10px", color: BRAND.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Content Studio</div>
          </div>
        </div>

        {/* Right — AI indicator + ABG Hindalco logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: BRAND.muted }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
            AI-Powered
          </div>
          <div style={{ width: "1px", height: "28px", background: `linear-gradient(to bottom, transparent, ${BRAND.borderLight}, transparent)` }} />
          <img src="/abg_hindalco_logo.png" alt="Aditya Birla Group - Hindalco" style={{ height: "36px", objectFit: "contain" }} />
        </div>
      </div>

      {/* Hero */}
      <div style={{
        padding: "48px 40px 36px",
        background: `linear-gradient(180deg, #031828 0%, ${BRAND.bg} 100%)`,
        borderBottom: `1px solid ${BRAND.border}`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-80px", right: "8%",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,201,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(14,165,201,0.08)", border: `1px solid rgba(14,165,201,0.2)`,
            borderRadius: "100px", padding: "4px 14px", marginBottom: "16px",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: BRAND.accent }} />
            <span style={{ fontSize: "11px", color: BRAND.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "500" }}>
              LinkedIn Post Generator
            </span>
          </div>
          <h1 style={{
            fontSize: "32px", fontWeight: "700", fontFamily: "'Playfair Display', serif",
            background: `linear-gradient(135deg, ${BRAND.accentSoft} 0%, ${BRAND.primary} 50%, #0D9488 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", lineHeight: 1.25, marginBottom: "10px",
          }}>
            Craft On-Brand Posts.<br />Instantly.
          </h1>
          <p style={{ fontSize: "14px", color: BRAND.muted, lineHeight: 1.6, maxWidth: "460px" }}>
            Generate professional LinkedIn posts for expos, trade fairs, and industry events — tuned to Hindalco's brand voice.
          </p>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 40px 60px" }}>

        {/* Post Type Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
          {POST_TYPES.map(t => (
            <button key={t.id} onClick={() => handleTypeChange(t.id)} style={{
              padding: "16px 20px", borderRadius: "12px",
              border: `1px solid ${activeType === t.id ? BRAND.primary : BRAND.border}`,
              background: activeType === t.id
                ? `linear-gradient(135deg, rgba(14,165,201,0.12) 0%, rgba(13,148,136,0.08) 100%)`
                : BRAND.card,
              cursor: "pointer", textAlign: "left", transition: "all 0.2s",
              boxShadow: activeType === t.id ? `0 0 20px rgba(14,165,201,0.1)` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "15px", color: activeType === t.id ? BRAND.accent : BRAND.muted }}>{t.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: activeType === t.id ? BRAND.accent : BRAND.text }}>{t.label}</span>
              </div>
              <div style={{ fontSize: "11px", color: BRAND.muted, paddingLeft: "23px" }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Two Column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

          {/* Input */}
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.border}`,
            borderRadius: "14px", padding: "24px",
            boxShadow: `0 4px 24px rgba(0,0,0,0.25)`,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "20px", paddingBottom: "16px",
              borderBottom: `1px solid ${BRAND.border}`,
            }}>
              <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: `linear-gradient(to bottom, ${BRAND.primary}, ${BRAND.gradEnd})` }} />
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.muted }}>Event Details</span>
            </div>
            {activeType === "pre" && <PreEventForm inputs={inputs} setInputs={setInputs} />}
            {activeType === "during" && <DuringEventForm inputs={inputs} setInputs={setInputs} />}
            {activeType === "post" && <PostEventForm inputs={inputs} setInputs={setInputs} />}
            <button onClick={generate} disabled={loading || !valid} style={{
              width: "100%", padding: "13px", borderRadius: "8px", border: "none",
              background: valid ? `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.gradEnd} 100%)` : BRAND.surface,
              color: valid ? "#fff" : BRAND.subtle,
              fontSize: "14px", fontWeight: "600",
              cursor: valid ? "pointer" : "not-allowed",
              fontFamily: "'Inter', sans-serif",
              opacity: loading ? 0.75 : 1, transition: "all 0.2s",
              boxShadow: valid ? `0 4px 16px rgba(14,165,201,0.2)` : "none",
            }}>
              {loading ? "Generating..." : "Generate Post →"}
            </button>
          </div>

          {/* Output */}
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.border}`,
            borderRadius: "14px", padding: "24px", minHeight: "360px",
            display: "flex", flexDirection: "column",
            boxShadow: `0 4px 24px rgba(0,0,0,0.25)`,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "20px", paddingBottom: "16px",
              borderBottom: `1px solid ${BRAND.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: `linear-gradient(to bottom, ${BRAND.accent}, #0D9488)` }} />
                <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.muted }}>Generated Post</span>
              </div>
              {generatedPost && (
                <button onClick={handleCopy} style={{
                  background: copied ? "rgba(34,197,94,0.1)" : "rgba(14,165,201,0.08)",
                  border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : BRAND.borderLight}`,
                  color: copied ? "#22C55E" : BRAND.accent,
                  borderRadius: "6px", padding: "5px 12px", fontSize: "11px",
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  fontWeight: "500", transition: "all 0.2s",
                }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              )}
            </div>

            {error && (
              <div style={{ color: "#F87171", fontSize: "13px", padding: "12px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px" }}>
                {error}
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", margin: "0 auto 14px", border: `2px solid ${BRAND.border}`, borderTop: `2px solid ${BRAND.primary}`, animation: "spin 0.8s linear infinite" }} />
                  <div style={{ fontSize: "13px", color: BRAND.muted }}>Crafting your post...</div>
                </div>
              </div>
            )}

            {!loading && !generatedPost && !error && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", margin: "0 auto 14px", background: "rgba(14,165,201,0.05)", border: `1px solid ${BRAND.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: BRAND.subtle }}>◎</div>
                  <div style={{ fontSize: "13px", color: BRAND.subtle }}>Fill in the details and hit Generate</div>
                </div>
              </div>
            )}

            {generatedPost && (
              <div style={{ fontSize: "14px", lineHeight: "1.75", color: BRAND.text, whiteSpace: "pre-wrap", flex: 1, overflowY: "auto", maxHeight: "480px", animation: "fadeIn 0.3s ease" }}>
                {generatedPost}
              </div>
            )}
          </div>
        </div>

        {generatedPost && (
          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <button onClick={generate} disabled={loading} style={{
              background: "transparent", border: `1px solid ${BRAND.borderLight}`,
              color: BRAND.muted, borderRadius: "8px", padding: "8px 18px",
              fontSize: "13px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
            }}>
              ↺ Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
