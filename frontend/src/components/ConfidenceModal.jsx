import { ConfidenceScore } from "./ConfidenceScore";

// simple modal wrapper around ConfidenceScore
export function ConfidenceModal({ scheme, formData, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>⭐ AI Confidence Score</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.content}>
          {scheme ? (
            <ConfidenceScore schemeName={scheme.schemeName} scheme={scheme} formData={formData} />
          ) : (
            <p style={styles.noData}>Please select a scheme to view its confidence score.</p>
          )}
        </div>
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
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  header: {
    padding: "18px",
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
  noData: {
    fontSize: "14px",
    color: "#6c757d",
    textAlign: "center",
    padding: "40px 20px",
  },
};
