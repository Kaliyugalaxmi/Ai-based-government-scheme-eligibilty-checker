// AI Service API Calls
const API_BASE = "http://localhost:5000/api/ai";

export const aiService = {
  // Get eligibility explanations for each scheme
  async explainEligibility(formData, schemes) {
    try {
      const response = await fetch(`${API_BASE}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, schemes })
      });
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.error("❌ Eligibility API Error:", error);
      return { explanations: [] };
    }
  },

  // Get personalized roadmap for applying to a scheme
  async getRoadmap(schemeName, formData) {
    try {
      const response = await fetch(`${API_BASE}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeName, formData })
      });
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.error("❌ Roadmap API Error:", error);
      return { steps: [] };
    }
  },

  // Get confidence score for a specific scheme
  async getConfidenceScore(schemeName, formData, scheme) {
    try {
      const response = await fetch(`${API_BASE}/confidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeName, formData, scheme })
      });
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.error("❌ Confidence API Error:", error);
      return { confidenceScore: 0 };
    }
  },

  // Compare multiple schemes
  async compareSchemes(schemes, formData, selectedSchemeIds = null) {
    try {
      const response = await fetch(`${API_BASE}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemes, formData, selectedSchemeIds })
      });
      if (!response.ok) throw new Error("API Error");
      return await response.json();
    } catch (error) {
      console.error("❌ Comparison API Error:", error);
      return { comparison: [] };
    }
  }
};
