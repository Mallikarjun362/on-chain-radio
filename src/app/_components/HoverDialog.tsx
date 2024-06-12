import { CSSProperties } from "react";

function HoverDialog({ isOpen, onClose, children }: any) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "#0005",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        display: "flex",
        height: "100vh",
        width: "100vw",
        cursor: "auto",
        padding: "50px",
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          position: "relative", // for the close button positioning
          borderRadius: "8px",
          flexWrap: "wrap",
          display: "flex",
          padding: "40px",
          minHeight: "40%",
          minWidth: "40%",
          zIndex: 100,
          gap: "15px",
          paddingTop: "100px",
        }}
      >
        <button
          style={{
            position: "absolute",
            cursor: "pointer",
            fontSize: "22px",
            color: "white",
            right: "20px",
            top: "20px",
          }}
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default HoverDialog;
