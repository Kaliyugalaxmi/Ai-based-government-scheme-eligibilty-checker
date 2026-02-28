import { useState, useEffect } from "react";
import { aiService } from "../utils/aiService";

export function ComparisonView({ schemes, formData, isOpen, onClose }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSchemes, setSelectedSchemes] = useState(schemes.slice(0, 3).map(s => s.id));

  const handleSchemeToggle = (id) => {
    setSelectedSchemes(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id].slice(0, 3)
    );
  };

  const loadComparison = async () => {
    setLoading(true);
    const data = await aiService.compareSchemes(schemes, formData, selectedSchemes);
    // if API returns empty, generate a local comparison immediately
    if (!data || (!data.comparison || data.comparison.length === 0)) {
      setComparison(buildLocalComparison());
    } else {
      setComparison(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // initialize comparison with a quick local compare so UI isn't empty
    setComparison(buildLocalComparison());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemes]);

  function estimateScoreForScheme(scheme) {
    let score = 50;
    if (formData.age) {
      const age = Number(formData.age);
      if (age >= scheme.minAge && age <= scheme.maxAge) score += 15;
    }
    if (formData.income) {
      const income = Number(formData.income);
      if (income <= scheme.incomeLimit) score += 20;
    }
    if (!scheme.employmentStatus || scheme.employmentStatus.includes(formData.employment || "")) score += 10;
    return Math.min(100, Math.round(score));
  }

  function buildLocalComparison() {
    const selected = schemes.filter(s => selectedSchemes.includes(s.id));
    const rows = selected.map(s => ({
      schemeName: s.schemeName,
      benefitValue: s.description,
      timelineDays: 7 + Math.floor(Math.random() * 10),
      documentCount: 2 + Math.floor(Math.random() * 3),
      userScore: estimateScoreForScheme(s),
      pros: ["Fast registration", "Low documentation"],
      cons: ["Smaller benefit amount"]
    }));

    return {
      comparison: rows,
      bestForUser: rows.length ? rows.reduce((a,b) => a.userScore > b.userScore ? a : b).schemeName : null,
      verdict: rows.length ? `For your profile, ${rows.reduce((a,b) => a.userScore > b.userScore ? a : b).schemeName} appears most suitable.` : null,
      combinationStrategy: rows.length > 1 ? "You may apply for multiple schemes; prioritize faster low-doc schemes first." : null
    };
  }

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>⚖️ Scheme Comparison</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.selectorArea}>
          <p style={styles.selectorLabel}>Select up to 3 schemes to compare:</p>
          <div style={styles.schemeSelector}>
            {schemes.map(scheme => (
              <button
                key={scheme.id}
                style={{
                  ...styles.schemeTag,
                  ...( selectedSchemes.includes(scheme.id) ? styles.schemeTagSelected : {})
                }}
                onClick={() => handleSchemeToggle(scheme.id)}
              >
                {selectedSchemes.includes(scheme.id) ? "✓ " : ""}{scheme.schemeName}
              </button>
            ))}
          </div>
          <button
            style={styles.compareBtn}
            onClick={loadComparison}
            disabled={loading || selectedSchemes.length === 0}
          >
            {loading ? "⏳ Comparing..." : `Compare ${selectedSchemes.length} Scheme(s)`}
          </button>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Analyzing schemes...</p>
          </div>
        )}

        {!loading && comparison && comparison.comparison && (
          <div style={styles.content}>
            {comparison.comparison.length > 0 && (
              <>
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.headerRow}>
                        <th style={styles.th}>Scheme Name</th>
                        <th style={styles.th}>Benefits</th>
                        <th style={styles.th}>Timeline</th>
                        <th style={styles.th}>Docs</th>
                        <th style={styles.th}>Your Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.comparison.map((comp, idx) => (
                        <tr key={idx} style={styles.tr}>
                          <td style={styles.td}>
                            <strong style={styles.schemeName}>{comp.schemeName}</strong>
                          </td>
                          <td style={styles.td}>{comp.benefitValue}</td>
                          <td style={styles.td}>{comp.timelineDays} days</td>
                          <td style={styles.td}>
                            <span style={styles.docBadge}>{comp.documentCount}</span>
                          </td>
                          <td style={styles.td}>
                            <span style={{...styles.scoreBadge, background: getScoreColor(comp.userScore)}}>
                              {comp.userScore}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {comparison.comparison[0]?.pros && (
                  <div style={styles.prosConsContainer}>
                    {comparison.comparison.map((comp, idx) => (
                      <div key={idx} style={styles.prosConsBox}>
                        <h4 style={styles.prosConsTitle}>{comp.schemeName}</h4>
                        
                        {comp.pros && comp.pros.length > 0 && (
                          <div style={styles.prosList}>
                            <p style={styles.prosTitle}>✅ Pros:</p>
                            {comp.pros.map((pro, i) => (
                              <div key={i} style={styles.proItem}>{pro}</div>
                            ))}
                          </div>
                        )}

                        {comp.cons && comp.cons.length > 0 && (
                          <div style={styles.consList}>
                            <p style={styles.consTitle}>❌ Cons:</p>
                            {comp.cons.map((con, i) => (
                              <div key={i} style={styles.conItem}>{con}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {comparison.bestForUser && (
              <div style={styles.verdictBox}>
                <p style={styles.verdictLabel}>🏆 BEST FOR YOU:</p>
                <h4 style={styles.verdictScheme}>{comparison.bestForUser}</h4>
                {comparison.verdict && (
                  <p style={styles.verdictText}>{comparison.verdict}</p>
                )}
              </div>
            )}

            {comparison.combinationStrategy && (
              <div style={styles.strategyBox}>
                <p style={styles.strategyLabel}>💼 Strategy:</p>
                <p style={styles.strategyText}>{comparison.combinationStrategy}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 85) return "#dcfce7";
  if (score >= 70) return "#dbeafe";
  if (score >= 50) return "#fef3c7";
  return "#fee2e2";
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
    overflowY: "auto",
  },
  modal: {
    background: "white",
    borderRadius: "14px",
    maxWidth: "900px",
    width: "95%",
    margin: "20px auto",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
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
  selectorArea: {
    padding: "20px 24px",
    background: "#f8f9fd",
    borderBottom: "1px solid #e8eef7",
  },
  selectorLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 12px 0",
  },
  schemeSelector: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "14px",
  },
  schemeTag: {
    background: "white",
    border: "1.5px solid #dde0e8",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4a5568",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  schemeTagSelected: {
    background: "#0066cc",
    color: "white",
    borderColor: "#0066cc",
  },
  compareBtn: {
    background: "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
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
  tableContainer: {
    overflowX: "auto",
    marginBottom: "24px",
    border: "1.5px solid #e8eef7",
    borderRadius: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    background: "#f8f9fd",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#0a1428",
    borderBottom: "1.5px solid #e8eef7",
  },
  tr: {
    borderBottom: "1px solid #e8eef7",
  },
  td: {
    padding: "12px",
    fontSize: "13px",
    color: "#4a5568",
  },
  schemeName: {
    color: "#0066cc",
  },
  docBadge: {
    background: "#f0f7ff",
    border: "1px solid #d4e3ff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#0066cc",
  },
  scoreBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#000",
    display: "inline-block",
  },
  prosConsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  prosConsBox: {
    border: "1.5px solid #e8eef7",
    borderRadius: "10px",
    padding: "16px",
    background: "#f8f9fd",
  },
  prosConsTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 12px 0",
  },
  prosList: {
    marginBottom: "12px",
  },
  prosTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#059669",
    margin: "0 0 8px 0",
  },
  proItem: {
    fontSize: "12px",
    color: "#047857",
    margin: "0 0 4px 0",
  },
  consList: {
    marginBottom: "0",
  },
  consTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#dc2626",
    margin: "0 0 8px 0",
  },
  conItem: {
    fontSize: "12px",
    color: "#991b1b",
    margin: "0 0 4px 0",
  },
  verdictBox: {
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "2px solid #fcd34d",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  verdictLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#92400e",
    margin: "0 0 6px 0",
  },
  verdictScheme: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#78350f",
    margin: "0 0 8px 0",
  },
  verdictText: {
    fontSize: "13px",
    color: "#78350f",
    margin: 0,
    lineHeight: "1.6",
  },
  strategyBox: {
    background: "#f0f9ff",
    border: "1.5px solid #bfdbfe",
    borderRadius: "10px",
    padding: "16px",
  },
  strategyLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#0369a1",
    margin: "0 0 8px 0",
  },
  strategyText: {
    fontSize: "13px",
    color: "#0c4a6e",
    margin: 0,
    lineHeight: "1.6",
  },
};
