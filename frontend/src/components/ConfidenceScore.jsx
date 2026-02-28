import { useState, useEffect } from "react";
import { aiService } from "../utils/aiService";

export function ConfidenceScore({ schemeName, scheme, formData, isLoading = false }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(isLoading);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!score && !loading && formData && scheme) {
      loadConfidence();
    }
  }, [formData, scheme]);

  const loadConfidence = async () => {
    setLoading(true);
    const data = await aiService.getConfidenceScore(schemeName, formData, scheme);
    setScore(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBar}></div>
      </div>
    );
  }

  if (!score || !score.confidenceScore) return null;

  const confidencePercent = score.confidenceScore;
  const getColor = (percent) => {
    if (percent >= 85) return "#10b981";
    if (percent >= 70) return "#3b82f6";
    if (percent >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getText = (percent) => {
    if (percent >= 85) return "Very High Confidence";
    if (percent >= 70) return "High Confidence";
    if (percent >= 50) return "Moderate Confidence";
    return "Low Confidence";
  };

  const color = getColor(confidencePercent);

  return (
    <div style={styles.container}>
      <div
        style={{...styles.card, borderLeft: `4px solid ${color}`}}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <p style={styles.label}>⭐ AI Confidence Score</p>
            <h4 style={styles.title}>{getText(confidencePercent)}</h4>
            {score.confidenceReason && (
              <p style={styles.reasonText}>{score.confidenceReason}</p>
            )}
          </div>
          <div style={{...styles.scoreDisplay, background: color}}>
            <span style={styles.percentage}>{confidencePercent}%</span>
          </div>
        </div>

        <div style={{...styles.progressBar, background: "#e8eef7"}}>
          <div
            style={{
              ...styles.progressFill,
              width: `${confidencePercent}%`,
              background: color,
              transition: "width 0.6s ease"
            }}
          ></div>
        </div>

        {expanded && (
          <div style={styles.details}>
            {score.matchBreakdown && (
              <div style={styles.detailSection}>
                <p style={styles.detailTitle}>📊 Match Breakdown:</p>
                <div style={styles.breakdownGrid}>
                  {Object.entries(score.matchBreakdown).map(([key, val]) => (
                    <div key={key} style={styles.breakdownItem}>
                      <div style={styles.breakdownLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div style={{...styles.miniBar, marginBottom: "4px"}}>
                        <div
                          style={{
                            ...styles.miniBarFill,
                            width: `${val}%`,
                            background: getColor(val)
                          }}
                        ></div>
                      </div>
                      <div style={styles.breakdownScore}>{val}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {score.strengths && score.strengths.length > 0 && (
              <div style={styles.detailSection}>
                <p style={styles.detailTitle}>✨ Strengths:</p>
                <div style={styles.list}>
                  {score.strengths.map((strength, i) => (
                    <div key={i} style={styles.listItem}>
                      <span style={styles.checkmark}>✓</span>
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {score.riskFactors && score.riskFactors.length > 0 && (
              <div style={styles.detailSection}>
                <p style={styles.riskTitle}>⚠️ Risk Factors:</p>
                <div style={styles.list}>
                  {score.riskFactors.map((risk, i) => (
                    <div key={i} style={styles.riskItem}>
                      <span style={styles.riskmark}>!</span>
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {score.recommendations && score.recommendations.length > 0 && (
              <div style={styles.detailSection}>
                <p style={styles.recommendationTitle}>💡 Recommendations:</p>
                <div style={styles.list}>
                  {score.recommendations.map((rec, i) => (
                    <div key={i} style={styles.recommendationItem}>
                      <span style={styles.bullett}>→</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.footer}>
          {expanded ? "Hide details ▲" : "Show details ▼"}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "20px",
  },
  loadingBar: {
    height: "6px",
    background: "linear-gradient(90deg, #0066cc, #0052a3, #0066cc)",
    borderRadius: "3px",
    animation: "shimmer 2s infinite",
  },
  card: {
    background: "white",
    border: "1.5px solid #e8eef7",
    borderRadius: "10px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "16px",
  },
  titleSection: {
    flex: 1,
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6c757d",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  title: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0a1428",
    margin: 0,
  },
  scoreDisplay: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0, 102, 204, 0.2)",
  },
  percentage: {
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
  },
  progressBar: {
    height: "8px",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
  },
  footer: {
    fontSize: "12px",
    color: "#0066cc",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #e8eef7",
  },
  details: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e8eef7",
  },
  detailSection: {
    marginBottom: "16px",
  },
  detailTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 10px 0",
  },
  riskTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#dc2626",
    margin: "0 0 10px 0",
  },
  reasonText: {
    fontSize: "13px",
    color: "#0a1428",
    margin: "4px 0 0 0",
  },
  recommendationTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#059669",
    margin: "0 0 10px 0",
  },
  breakdownGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
    gap: "12px",
  },
  breakdownItem: {
    background: "#f8f9fd",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e8eef7",
  },
  breakdownLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#0a1428",
    marginBottom: "6px",
  },
  miniBar: {
    height: "4px",
    background: "#e8eef7",
    borderRadius: "2px",
    overflow: "hidden",
  },
  miniBarFill: {
    height: "100%",
  },
  breakdownScore: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0066cc",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  listItem: {
    fontSize: "12px",
    color: "#4a5568",
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    background: "#f0f7ff",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d4e3ff",
  },
  checkmark: {
    color: "#10b981",
    fontWeight: "700",
    minWidth: "20px",
  },
  riskItem: {
    fontSize: "12px",
    color: "#7f1d1d",
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    background: "#fef2f2",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #fecaca",
  },
  riskmark: {
    color: "#dc2626",
    fontWeight: "700",
    minWidth: "20px",
  },
  recommendationItem: {
    fontSize: "12px",
    color: "#047857",
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    background: "#f0fdf4",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #bbf7d0",
  },
  bullett: {
    color: "#059669",
    fontWeight: "700",
    minWidth: "20px",
  },
};
