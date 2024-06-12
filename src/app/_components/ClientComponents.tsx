"use client";
import { CSSProperties, useEffect, useState } from "react";
import { useGlobalContext } from "../_context/store";
import { getCookieValue, delete_cookie } from "@/utils/Authentication";
import { CgMenu } from "react-icons/cg";
import ReactDom from "react-dom";
import HoverDialog from "./HoverDialog";
import { NavLink } from "./ServerComponents";

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

export const HoverMenuButtom = ({ primary_links }: any) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div
        className="hover:bg-[#FFF6] lg:hidden"
        onClick={() => setIsDialogOpen(true)}
        style={{
          border: "2px solid white",
          height: "fit-content",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <CgMenu style={{ fontSize: "40px" }} />
      </div>
      <HoverDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
          {...(Object.keys(primary_links).map((val: any, idx) => (
            <NavLink url={primary_links[val]} name={val} key={idx} />
          )))}
      </HoverDialog>
    </>
  );
};
