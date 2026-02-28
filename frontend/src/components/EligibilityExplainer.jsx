import { useState } from "react";
import { aiService } from "../utils/aiService";

export function EligibilityExplainer({ schemes, formData, isOpen, onClose }) {
  const [explanations, setExplanations] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadExplanations = async () => {
    setLoading(true);
    const data = await aiService.explainEligibility(formData, schemes);
    const got = data && data.explanations ? data.explanations : [];
    // if AI returned nothing, build local quick explanations
    if ((!got || got.length === 0) && schemes && schemes.length > 0) {
      setExplanations(schemes.map(s => buildLocalExplanation(s, formData)));
    } else {
      setExplanations(got);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  if (!explanations && !loading) {
    loadExplanations();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>📊 Detailed Eligibility Breakdown</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Analyzing your eligibility for each scheme...</p>
          </div>
        )}

        {!loading && explanations && (
          <div style={styles.content}>
            {explanations.length === 0 ? (
              <p style={styles.noData}>No eligibility information available</p>
            ) : (
              explanations.map((exp, idx) => (
                <div key={idx} style={styles.explanationCard}>
                  <div style={{...styles.cardHeader, borderLeft: exp.eligible ? "4px solid #10b981" : "4px solid #ef4444"}}>
                    <div>
                      <h4 style={styles.schemeName}>{exp.schemeName}</h4>
                      <span style={{...styles.badge, background: exp.eligible ? "#dcfce7" : "#fee2e2", color: exp.eligible ? "#166534" : "#991b1b"}}>
                        {exp.eligible ? "✓ Eligible" : "✗ Not Eligible"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.section}>
                      <p style={styles.sectionTitle}>📋 Reasons:</p>
                      <div style={styles.reasonsList}>
                        {(exp.reasons || []).map((reason, i) => (
                          <div key={i} style={styles.reasonItem}>
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    {exp.warnings && exp.warnings.length > 0 && (
                      <div style={styles.section}>
                        <p style={styles.warningTitle}>⚠️ Warnings:</p>
                        <div style={styles.warningsList}>
                          {exp.warnings.map((warning, i) => (
                            <div key={i} style={styles.warningItem}>
                              {warning}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function buildLocalExplanation(scheme, formData) {
  const reasons = [];
  const warnings = [];
  const age = Number(formData.age || 0);
  if (age >= scheme.minAge && age <= scheme.maxAge) reasons.push(`✅ Age matched (${scheme.minAge}–${scheme.maxAge})`);
  else reasons.push(`❌ Age not matched (you: ${age}, required: ${scheme.minAge}–${scheme.maxAge})`);

  const income = Number(formData.income || 0);
  if (income <= (scheme.incomeLimit || 0)) reasons.push(`✅ Income below ₹${(scheme.incomeLimit || 0).toLocaleString()}`);
  else reasons.push(`❌ Income too high (you: ₹${income.toLocaleString()}, limit: ₹${(scheme.incomeLimit || 0).toLocaleString()})`);

  if (scheme.bplRequired === "Yes" && (formData.bpl || "No") !== "Yes") warnings.push("⚠️ Scheme requires BPL status which you haven't selected.");
  if (scheme.gender && scheme.gender !== "Any" && formData.gender !== scheme.gender) warnings.push(`⚠️ Scheme targets ${scheme.gender} beneficiaries.`);

  return {
    schemeName: scheme.schemeName,
    eligible: warnings.length === 0 && reasons.every(r => r.startsWith("✅")),
    reasons,
    warnings
  };
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "14px",
    maxWidth: "700px",
    width: "95%",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "slideUp 0.3s ease",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #e8eef7",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0a1428",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6c757d",
  },
  content: {
    overflowY: "auto",
    padding: "24px",
    flex: 1,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 24px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e8eef7",
    borderTop: "3px solid #0066cc",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#6c757d",
  },
  noData: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6c757d",
    padding: "40px 20px",
  },
  explanationCard: {
    border: "1.5px solid #e8eef7",
    borderRadius: "10px",
    marginBottom: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  cardHeader: {
    padding: "16px",
    background: "#f8f9fd",
  },
  schemeName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 8px 0",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
  },
  cardBody: {
    padding: "16px",
  },
  section: {
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 8px 0",
  },
  warningTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#dc2626",
    margin: "0 0 8px 0",
  },
  reasonsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  warningsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  reasonItem: {
    fontSize: "13px",
    color: "#4a5568",
    background: "#f0f7ff",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #d4e3ff",
  },
  warningItem: {
    fontSize: "13px",
    color: "#991b1b",
    background: "#fef2f2",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #fecaca",
  },
};
