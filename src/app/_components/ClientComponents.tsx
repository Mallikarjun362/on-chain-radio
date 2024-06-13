"use client";
import { getCookieValue, delete_cookie } from "@/utils/Authentication";
import { CSSProperties, useEffect } from "react";
import { useGlobalContext } from "../_context/store";
import { NavLink } from "./ServerComponents";
import { CgMenu } from "react-icons/cg";

export function ConnectWalletButton() {
  const {
    wallet_address,
    setWalletAddress,
    setWalletObject,
    setConnectionStatus,
    setPublicKey,
    setJwtAuthToken,
    setUserCreatedRooms,
  } = useGlobalContext();

  // --------- ON COMPONENT LOAD FIRST TIME ---------
  useEffect(() => {
    const onPageLoad = async () => {
      if ("aptos" in window) {
        const response = await (window as any).aptos.account();
        // CONNECT
        setWalletObject((window as any).aptos);
        setWalletAddress(response?.address);
        setPublicKey(response?.publicKey);
        setConnectionStatus(true);
        const temp_jwt_token = getCookieValue("jwt_auth_token");
        if (temp_jwt_token && temp_jwt_token?.length > 0) {
          setJwtAuthToken(temp_jwt_token);
        }
        // DISCONNECT
        (window as any).aptos.onDisconnect(() => {
          delete_cookie("jwt_auth_token");
          setConnectionStatus(false);
          setUserCreatedRooms([]);
          setWalletAddress("");
          setWalletObject({});
          setJwtAuthToken("");
          setPublicKey("");
          location.reload();
        });
      } else {
        return alert("Petra Wallet Not Found");
      }
    };
    onPageLoad().catch((err) => {});
  }, [
    setWalletAddress,
    setWalletObject,
    setConnectionStatus,
    setPublicKey,
    setJwtAuthToken,
    setUserCreatedRooms,
  ]);

  const connectWallet = async () => {
    if ("aptos" in window) {
      const response = await (window as any)?.aptos?.connect();
      setWalletObject((window as any).aptos);
      setWalletAddress(response.address);
      setPublicKey(response.publicKey);
      setConnectionStatus(true);
      const temp_jwt_token = getCookieValue("jwt_auth_token");
      if (temp_jwt_token && temp_jwt_token?.length > 0) {
        setJwtAuthToken(temp_jwt_token);
      }
    } else {
      return alert("Petra Wallet Not Found");
    }
  };
  const commonButtonStyle: CSSProperties = {
    borderRadius: "100px",
    padding: "5px 20px",
    fontSize: "20px",
    color: "#fff",
  };
  // CONDITIONAL RENDERING
  if (wallet_address.length > 0) {
    return (
      <button
        style={{
          backgroundColor: "#54C9E2",
          ...commonButtonStyle,
        }}
      >
        Wallet Connected
      </button>
    );
  } else {
    return (
      <button
        style={{
          backgroundColor: "#CE5108",
          ...commonButtonStyle,
        }}
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
    );
  }
}

export const HoverMenuButtom = ({ children }: any) => {
  const { setHoverContent } = useGlobalContext();
  return (
    <div
      className="lg:hidden block"
      onClick={() =>
        setHoverContent(
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "40px" }}>Menu</h2>
            <br />
            <div
              style={{
                flexWrap: "wrap",
                display: "flex",
                minWidth: "50vw",
                gap: "15px",
              }}
            >
              {children}
            </div>
          </div>
        )
      }
      style={{
        border: "2px solid white",
        height: "fit-content",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      <CgMenu style={{ fontSize: "40px" }} />
    </div>
  );
};
