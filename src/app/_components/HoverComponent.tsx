"use client";
import { useGlobalContext } from "../_context/store";
import { RxCross2 } from "react-icons/rx";

export default function HoverComponent() {
  const { hoverContent, setHoverContent } = useGlobalContext();
  if (!hoverContent) return null;
  return (
    <div
      style={{
        backgroundColor: "#0009",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "fixed",
        display: "flex",
        height: "100vh",
        width: "100vw",
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          boxShadow: "0px 0px 10px 10px #FFF3",
          backgroundColor: "#000",
          width: "min-content",
          borderRadius: "5px",
          overflowX: "hidden",
          minHeight: "400px",
          maxHeight: "80%",
          maxWidth: "90vw",
          padding: "5px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button
            onClick={() => setHoverContent(null)}
            style={{ margin: "20px" }}
          >
            <RxCross2
              className="hover:bg-red-300"
              style={{
                border: "2px solid red",
                borderRadius: "5px",
                fontSize: "40px",
                color: "red",
              }}
            />
          </button>
        </div>
        <div style={{ padding: "10px" }}>{hoverContent}</div>
      </div>
    </div>
  );
}
