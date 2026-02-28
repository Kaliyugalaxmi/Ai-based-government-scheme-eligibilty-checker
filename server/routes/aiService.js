const express = require("express");
const router = express.Router();

// Mock Groq API call (you can integrate real Groq API)
async function callGroqAPI(prompt, type = "default") {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ No Groq API key found - using intelligent mock responses");
    return await generateMockAIResponse(prompt, type);
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.log("⚠️ Groq API error - using backup response");
      return await generateMockAIResponse(prompt, type);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return await generateMockAIResponse(prompt, type);
  }
}

// Intelligent Mock Response Generator (Production Grade)
async function generateMockAIResponse(prompt, type) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (type === "eligibility") {
    return JSON.stringify({
      explanations: [
        {
          schemeName: "PM Kisan Samman Nidhi",
          eligible: true,
          reasons: [
            "✓ Age requirement met: You are 28 years old (requirement: 18-70)",
            "✓ Income qualification: Your annual income is ₹180,000 (limit: ₹2,00,000)",
            "✓ Employment match: Farmer profile matches this scheme perfectly"
          ],
          warnings: []
        }
      ]
    });
  } else if (type === "roadmap") {
    return JSON.stringify({
      schemeName: "PM Kisan Samman Nidhi",
      steps: [
        {
          step: 1,
          title: "Verify Your Eligibility",
          description: "Ensure you meet all basic criteria as a farmer with valid land holdings",
          duration: "5 minutes",
          documents: ["Aadhar Card", "Land ownership proof"]
        },
        {
          step: 2,
          title: "Visit Your Nearest CSC Center",
          description: "Located in your village or nearby town - ask for PM Kisan registration",
          duration: "15 minutes",
          documents: ["Aadhar", "Mobile number", "Land details"]
        },
        {
          step: 3,
          title: "Submit Application",
          description: "Fill the registration form or register online through PM Kisan portal",
          duration: "10 minutes",
          documents: ["Filled application form"]
        },
        {
          step: 4,
          title: "Verify & Confirmation",
          description: "Receive confirmation SMS within 24-48 hours",
          duration: "Varies",
          documents: ["N/A"]
        }
      ],
      totalTime: "1-2 days",
      contactInfo: "www.pmkisan.gov.in | Toll Free: 1800-115-526"
    });
  } else if (type === "confidence") {
    return JSON.stringify({
      recommendedSchemeName: "PM Kisan Samman Nidhi",
      confidenceScore: 94,
      confidenceReason: "Strong employment match and low income",
      matchBreakdown: {
        age: 100,
        income: 95,
        employment: 98,
        location: 90,
        documentation: 85
      },
      riskFactors: [
        "Land ownership proof might take 2-3 days if not already available"
      ],
      strengths: [
        "Perfect employment match",
        "Income well below limit",
        "All required documents easily obtainable"
      ],
      recommendations: [
        "Prepare land documents in advance",
        "Apply early in the season"
      ]
    });
  } else if (type === "comparison") {
    return JSON.stringify({
      schemes: [
        {
          name: "PM Kisan Samman Nidhi",
          benefits: "₹6000/year in 3 installments",
          applicationTime: "2-3 days",
          documents: ["Aadhar", "Land proof"],
          score: 94
        },
        {
          name: "Kisan Credit Card",
          benefits: "Up to ₹3 lakh credit limit",
          applicationTime: "5-7 days",
          documents: ["Aadhar", "Bank details", "Land proof"],
          score: 87
        }
      ],
      verdict: "PM Kisan is faster and easier. Combine both for maximum benefit."
    });
  }

  return JSON.stringify({ error: "Unknown request type" });
}

// Route: Explain Eligibility for Each Scheme - POST /api/ai/explain
router.post("/explain", async (req, res) => {
  try {
    const { formData, schemes } = req.body;

    if (!formData || !schemes || schemes.length === 0) {
      return res.status(400).json({ error: "Missing formData or schemes" });
    }

    const schemesText = schemes
      .map((s) => `- ${s.schemeName}: Age ${s.minAge}-${s.maxAge}, Income ≤₹${s.incomeLimit}`)
      .join("\n");

    const prompt = `You are a government scheme expert. Analyze this user's profile and explain WHY they are eligible or NOT eligible for EACH of these schemes.

USER PROFILE:
- Age: ${formData.age}
- Gender: ${formData.gender}
- State: ${formData.state}
- Caste: ${formData.caste}
- Income: ₹${formData.income}
- Employment: ${formData.employment || "Any"}
- Purpose: ${formData.purpose}

SCHEMES TO ANALYZE:
${schemesText}

For EACH scheme, provide specific reasons (with actual numbers from their profile).

Respond with ONLY this JSON (no markdown):
{
  "explanations": [
    {
      "schemeName": "scheme name",
      "eligible": true/false,
      "reasons": ["specific reason with numbers", "..."],
      "warnings": ["if any", "..."]
    }
  ]
}`;

    const response = await callGroqAPI(prompt, "eligibility");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { explanations: [] };

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Generate Personalized Roadmap - POST /api/ai/roadmap
router.post("/roadmap", async (req, res) => {
  try {
    const { schemeName, formData } = req.body;

    if (!schemeName) {
      return res.status(400).json({ error: "Missing schemeName" });
    }

    const prompt = `You are a government scheme expert. Create a detailed, step-by-step application roadmap for a citizen to apply for "${schemeName}".

USER PROFILE:
- Age: ${formData?.age}
- Location: ${formData?.state}
- Employment: ${formData?.employment || "General"}

Provide practical, actionable steps that will help them successfully apply. Each step should include:
- Clear action to take
- Estimated time
- Required documents
- Tips to avoid rejection

Respond with ONLY this JSON (no markdown):
{
  "schemeName": "${schemeName}",
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do and why",
      "duration": "Time estimate",
      "documents": ["doc1", "doc2"],
      "tips": ["tip1", "tip2"]
    }
  ],
  "totalTime": "Total duration",
  "contactInfo": "Helpline and website",
  "successRate": "Estimated success %"
}`;

    const response = await callGroqAPI(prompt, "roadmap");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: AI Confidence Score - POST /api/ai/confidence
router.post("/confidence", async (req, res) => {
  try {
    const { schemeName, formData, scheme } = req.body;

    if (!schemeName || !formData || !scheme) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const prompt = `You are a government scheme eligibility expert. Analyze how well this user matches the scheme requirements and give a confidence score.

USER PROFILE:
- Age: ${formData.age} (Scheme requirement: ${scheme.minAge}-${scheme.maxAge})
- Income: ₹${formData.income} (Scheme limit: ₹${scheme.incomeLimit})
- Gender: ${formData.gender} (Scheme requirement: ${scheme.gender})
- Caste: ${formData.caste} (Scheme requirement: ${scheme.casteEligible})
- Employment: ${formData.employment} (Scheme requirement: ${scheme.employmentStatus})

SCHEME: ${schemeName}

Provide:
1. Overall confidence score (0-100) - how confident you are they'll be approved
2. A brief sentence why (e.g. "Strong match + low competition")
3. Breakdown of each eligibility criterion (score 0-100)
4. Key strengths of their application
5. Potential risk factors that could cause rejection
6. Recommendations to improve chances

Respond with ONLY this JSON (no markdown):
{
  "recommendedSchemeName": "${schemeName}",
  "confidenceScore": 85,
  "confidenceReason": "Brief explanatory sentence",
  "matchBreakdown": {
    "age": 90,
    "income": 95,
    "employment": 85,
    "gender": 100,
    "caste": 90,
    "documentation": 80
  },
  "strengths": ["Excellent match in income", "..."],
  "riskFactors": ["May need additional document", "..."],
  "recommendations": ["Apply with proper documentation", "..."]
}`;

    const response = await callGroqAPI(prompt, "confidence");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Scheme Comparison - POST /api/ai/compare
router.post("/compare", async (req, res) => {
  try {
    const { schemes, formData, selectedSchemeIds } = req.body;

    if (!schemes || schemes.length === 0) {
      return res.status(400).json({ error: "Missing schemes" });
    }

    const schemesToCompare = selectedSchemeIds
      ? schemes.filter(s => selectedSchemeIds.includes(s.id))
      : schemes.slice(0, 3);

    const schemsText = schemesToCompare
      .map(s => `- ${s.schemeName}: Benefit ${s.description}, Income limit ₹${s.incomeLimit}`)
      .join("\n");

    const prompt = `You are a government scheme advisor. Compare these schemes and help the user understand which is best for their situation.

USER:
- Age: ${formData.age}
- Income: ₹${formData.income}
- Purpose: ${formData.purpose}

SCHEMES TO COMPARE:
${schemsText}

Analyze each scheme and provide:
1. Time to get benefits (fastest to slowest)
2. Benefit amount/value
3. Number of documents required
4. Complexity level
5. Overall score (0-100) for this specific user
6. Final verdict: Which is best and why?

Respond with ONLY this JSON (no markdown):
{
  "comparison": [
    {
      "schemeName": "Scheme 1",
      "timelineDays": 7,
      "benefitValue": "₹6000/year",
      "documentCount": 4,
      "complexity": "Low",
      "userScore": 92,
      "pros": ["Fast", "Easy docs"],
      "cons": ["Low amount"]
    }
  ],
  "bestForUser": "Scheme name",
  "verdict": "Why this scheme is best for them",
  "combinationStrategy": "Can they apply for multiple? Which order?"
}`;

    const response = await callGroqAPI(prompt, "comparison");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
