"use client";
import { useEffect, useState } from "react";
import ConnectToPlatform from "../_components/ConnectToPlatform";
import { useGlobalContext } from "@/app/_context/store";
import { IoLink } from "react-icons/io5";
// UTILITY FUNCTIONS
const getRandomEmoji = (): string => {
  const emojies: string[] = ["👻", "😺", "👦", "🌻", "🧑‍💻", "👩‍🚀", "👩‍🔬"];
  const idx = Math.floor(Math.random() * emojies.length);
  return emojies[idx];
};

function Section_UserProfile() {
  const { is_connected, wallet_address } = useGlobalContext();
  const [profileEmoji, setProfileEmoji] = useState<string | null>(null);
  useEffect(() => {
    setProfileEmoji(getRandomEmoji());
  });
  return (
    <div
      className="lg:flex-row flex-col"
      style={{
        justifyContent: "flex-start",
        backdropFilter: "blur(20px)",
        backgroundColor: "#0006",
        alignItems: "center",
        borderRadius: "20px",
        userSelect: "none",
        display: "flex",
        width: "100%",
        gap: "10px",
      }}
    >
      {/* DIV LEFT */}
      <div
        style={{
          flexGrow: 0,
          flexShrink: 0,
          width: "200px",
          height: "200px",
          display: "flex",
          fontSize: "130px",
          flexBasis: "auto",
          alignItems: "center",
          borderRadius: "100%",
          justifyContent: "center",
          backgroundColor: "#FFF5",
          border: "2px solid white",
          backdropFilter: "blur(15px)",
          overflow: "hidden",
        }}
      >
        {profileEmoji}
      </div>
      {/* DIV RIGHT */}
      <div
        style={{
          alignSelf: "stretch",
          fontWeight: "500",
          flexBasis: "auto",
          fontSize: "30px",
          width: "inherit",
          overflow: "clip",
          padding: "20px",
          color: "white",
          flexShrink: 1,
          flexGrow: 0,
        }}
      >
        {wallet_address ? (
          <div>
            <div
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                display: "flex",
                gap: "0px",
              }}
            >
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "clip",
                }}
              >
                <span style={{ color: "#FFF4" }}>{"0x"}</span>
                {wallet_address.slice(2, wallet_address.length)}
              </div>
              <button
                className="shadow-lg transform active:scale-75 transition-transform rounded-full"
                style={{
                  backgroundColor: "#fff3",
                  padding: "10px",
                }}
                onClick={() => navigator?.clipboard?.writeText(wallet_address)}
              >
                <IoLink />
              </button>
            </div>
            <ConnectToPlatform />
            <br />
            <br />
            <hr style={{ backgroundColor: "white" }} />
          </div>
        ) : (
          "Wallet Not Connected !!"
        )}
        {is_connected ? (
          <button
            style={{
              backgroundColor: "#A00",
              borderRadius: "100px",
              padding: "5px 20px",
              fontSize: "16px",
            }}
            onClick={() => {
              (window as any).aptos.disconnect();
            }}
          >
            Disconnect Wallet and Log out
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Section_UserProfile;
