import { useState, useEffect } from "react";
import { aiService } from "../utils/aiService";

export function RoadmapModal({ schemeName, formData, isOpen, onClose }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState(0);

  const loadRoadmap = async () => {
    setLoading(true);
    const data = await aiService.getRoadmap(schemeName, formData);
    // If API returned empty, provide a quick client-side fallback roadmap
    if (!data || (!data.steps || data.steps.length === 0)) {
      setRoadmap(buildLocalRoadmap(schemeName, formData));
    } else {
      setRoadmap(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // reload when schemeName changes while open
    if (isOpen) {
      setRoadmap(null);
    }
  }, [schemeName, isOpen]);

  function buildLocalRoadmap(schemeName, formData) {
    const base = [
      {
        step: 1,
        title: "Check Basic Eligibility",
        description: `Confirm age, income and occupation for ${schemeName}. Use your Aadhar and income documents to verify.`,
        duration: "5-15 minutes",
        documents: ["Aadhar Card", "Income proof"],
        tips: ["Ensure names match exactly on documents"]
      },
      {
        step: 2,
        title: "Gather Documents",
        description: "Collect scanned copies or originals for verification at the CSC or online portal.",
        duration: "15-45 minutes",
        documents: ["Aadhar", "Address proof", "Income proof"],
        tips: ["Keep photocopies ready to speed up the process"]
      },
      {
        step: 3,
        title: "Apply Online or At CSC",
        description: "Fill the application form on the scheme portal or ask for assistance at the Common Service Centre.",
        duration: "10-30 minutes",
        documents: ["Filled form"],
        tips: ["Double-check form fields before submission"]
      },
      {
        step: 4,
        title: "Verification & Follow-up",
        description: "Verification may take a few days; follow up with the local office if needed.",
        duration: "1-7 days",
        documents: [],
        tips: ["Note down reference numbers and helpline details"]
      }
    ];

    return {
      schemeName: schemeName || "Selected Scheme",
      steps: base,
      totalTime: "1-7 days",
      contactInfo: "Contact local CSC or scheme helpline"
    };
  }

  if (!isOpen) return null;

  if (!roadmap && !loading) {
    loadRoadmap();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>🗺️ Application Roadmap</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Creating your personalized roadmap...</p>
          </div>
        )}

        {!loading && roadmap && (
          <div style={styles.content}>
            {roadmap.schemeName && (
              <div style={styles.schemeInfo}>
                <h3 style={styles.infoTitle}>{roadmap.schemeName}</h3>
                {roadmap.totalTime && (
                  <p style={styles.infoSubtext}>⏱️ Total Time: <strong>{roadmap.totalTime}</strong></p>
                )}
              </div>
            )}

            {roadmap.steps && roadmap.steps.length > 0 && (
              <div style={styles.stepsContainer}>
                {roadmap.steps.map((step, idx) => (
                  <div key={idx} style={styles.stepWrapper}>
                    <div
                      style={{...styles.stepHeader, background: expandedStep === idx ? "#f0f7ff" : "transparent"}}
                      onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
                    >
                      <div style={styles.stepNumber}>{step.step}</div>
                      <div style={styles.stepTitleContainer}>
                        <h4 style={styles.stepTitle}>{step.title}</h4>
                        <p style={styles.stepDuration}>⏱️ {step.duration}</p>
                      </div>
                      <div style={styles.expandIcon}>{expandedStep === idx ? "▼" : "▶"}</div>
                    </div>

                    {expandedStep === idx && (
                      <div style={styles.stepBody}>
                        {step.description && (
                          <div style={styles.section}>
                            <p style={styles.sectionTitle}>📝 Description:</p>
                            <p style={styles.descriptionText}>{step.description}</p>
                          </div>
                        )}

                        {step.documents && step.documents.length > 0 && (
                          <div style={styles.section}>
                            <p style={styles.sectionTitle}>📄 Required Documents:</p>
                            <div style={styles.docsList}>
                              {step.documents.map((doc, i) => (
                                <div key={i} style={styles.docItem}>
                                  ✓ {doc}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.tips && step.tips.length > 0 && (
                          <div style={styles.section}>
                            <p style={styles.sectionTitle}>💡 Tips:</p>
                            <div style={styles.tipsList}>
                              {step.tips.map((tip, i) => (
                                <div key={i} style={styles.tipItem}>
                                  • {tip}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {idx < roadmap.steps.length - 1 && <div style={styles.connector}></div>}
                  </div>
                ))}
              </div>
            )}

            {roadmap.contactInfo && (
              <div style={styles.contactBox}>
                <p style={styles.contactTitle}>📞 Need Help?</p>
                <p style={styles.contactInfo}>{roadmap.contactInfo}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
    maxWidth: "750px",
    width: "95%",
    maxHeight: "85vh",
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
  schemeInfo: {
    background: "linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)",
    border: "2px solid #d4e3ff",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "24px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0066cc",
    margin: 0,
  },
  infoSubtext: {
    fontSize: "13px",
    color: "#0a1428",
    margin: "8px 0 0 0",
  },
  stepsContainer: {
    marginBottom: "24px",
  },
  stepWrapper: {
    marginBottom: "12px",
    position: "relative",
  },
  stepHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    border: "1.5px solid #dde0e8",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0a1428",
    margin: "0 0 2px 0",
  },
  stepDuration: {
    fontSize: "12px",
    color: "#6c757d",
    margin: 0,
  },
  expandIcon: {
    fontSize: "12px",
    color: "#6c757d",
    transition: "all 0.2s ease",
  },
  stepBody: {
    padding: "16px",
    background: "#f8f9fd",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    borderTop: "none",
    marginTop: "-2px",
  },
  connector: {
    width: "2px",
    height: "12px",
    background: "#d4e3ff",
    marginLeft: "19px",
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
  descriptionText: {
    fontSize: "13px",
    color: "#4a5568",
    margin: 0,
    lineHeight: "1.6",
  },
  docsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  docItem: {
    fontSize: "13px",
    color: "#0066cc",
    background: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #d4e3ff",
  },
  tipsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  tipItem: {
    fontSize: "13px",
    color: "#059669",
    background: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #d1fae5",
  },
  contactBox: {
    background: "#fef3c7",
    border: "1.5px solid #fcd34d",
    borderRadius: "10px",
    padding: "14px",
  },
  contactTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#92400e",
    margin: "0 0 6px 0",
  },
  contactInfo: {
    fontSize: "13px",
    color: "#78350f",
    margin: 0,
    lineHeight: "1.5",
  },
};
