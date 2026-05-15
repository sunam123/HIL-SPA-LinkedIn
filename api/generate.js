const SYSTEM_PROMPT = `You are a LinkedIn copywriter for Hindalco Specialty Alumina Business, a division of Hindalco Industries (Aditya Birla Group). You write professional, authoritative LinkedIn posts for industrial B2B audiences — ceramics, refractories, polymers, battery, glass, and polishing sectors.

BRAND VOICE RULES:
- Tone: Confident, technically credible, globally ambitious, never boastful
- Never generic — always industry-specific vocabulary
- Lead with industry relevance, not company chest-thumping
- Use sector vocabulary: refractory, specialty alumina, boehmite, calcined alumina, ATH, flame retardant, ceramic grades, thermal management
- Sub-brands: PrizTec (ceramics), InnoSafe (flame retardant/polymer), FUSALOX (refractory), AluChem (chemicals)
- Always end with 5–7 sharp, relevant hashtags
- Target length: 100–150 words (not counting hashtags)
- No em-dashes. No fluff. No filler phrases like "exciting journey" or "proud to announce"
- Posts must feel written by a domain expert, not a marketer

OUTPUT FORMAT: Return only the post text including hashtags. No preamble, no explanation.`;

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, inputs } = req.body;

  if (!type || !inputs) {
    return res.status(400).json({ error: "Missing type or inputs" });
  }

  const prompt = buildPrompt(type, inputs);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Anthropic API error");
    }

    const post = data.content?.find(b => b.type === "text")?.text || "";
    return res.status(200).json({ post });

  } catch (err) {
    console.error("Generation error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
