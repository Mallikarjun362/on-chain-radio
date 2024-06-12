"use client";
// STANDARD LIBRARY IMPORTS
import React, { useEffect, useState } from "react";
import { Provider, Network } from "aptos";
// APPLICATION IMPORTS
import Section_UserProfile from "../create-rooms/_sections/Section_UserProfile";
import { useGlobalContext } from "../../_context/store";
import { MODULE_ADDRESS } from "@/utils/Constants";

interface Collection {
  key: string;
  value: {
    artist_Authentication_key: string;
    artist_address: string;
    collectionName: string;
    collectionType: string;
    collection_ipfs_hash: string;
    current_timestamp: string;
    streaming_timestamp: string;
  };
}

function ProfilePage() {
  const { wallet_address } = useGlobalContext();
  const [collectionsData, setCollectionsData] = useState<Collection[]>([]);
  const [signatureData, setSignatureData] = useState<Collection[]>([]);

  const getAccountDetails = async () => {
    if (wallet_address === "") {
      return;
    }
    const provider = new Provider(Network.TESTNET);
    try {
      const artistWorkResource = await provider.getAccountResource(
        wallet_address,
        `${MODULE_ADDRESS}::OnChainRadio::Artist_work`
      );

      if ((artistWorkResource as any)?.data?.Collections?.data) {
        setCollectionsData((artistWorkResource as any).data.Collections.data);
        setSignatureData(
          (artistWorkResource as any).data.Signature_Details.data
        );
      }
      console.log(artistWorkResource.data);
    } catch (e) {
      console.log("Error fetching account details:", e);
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  return (
    <main
      className="lg:pl-[20%] lg:pr-[20%] p-[50px]"
      style={{
        flexDirection: "column",
        alignItems: "center",
        display: "flex",
        width: "100%",
      }}
    >
      <Section_UserProfile />
      {/* == COLLECTIONS ==== COLLECTIONS ==== COLLECTIONS ==== COLLECTIONS ==== COLLECTIONS ==== COLLECTIONS ==== COLLECTIONS == */}
      <br />
      <h2
        style={{
          alignSelf: "self-start",
          marginBottom: "20px",
          fontSize: "2em",
        }}
      >
        Collections
      </h2>
      <div className="simpleGridContainer" style={{ width: "100%" }}>
        {collectionsData.map((collection) => (
          <div
            key={collection.key}
            style={{
              border: "1px solid #333",
              borderRadius: "10px",
              marginBottom: "20px",
              marginRight: "20px",
              overflow: "hidden",
              backdropFilter: "blur(20px)",
              backgroundColor: "#0005",
            }}
          >
            <img
              src={`https://placehold.co/600x400/000/AAA?font=playfair-display&text=${collection.value.collectionName}`}
              alt={collection.value.collectionName}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div style={{ padding: "15px" }}>
              <p style={{ fontSize: "1.2em" }}>
                {collection.value.collectionName}
              </p>
              <p>
                <b>Collection Type:</b> {collection.value.collectionType}
              </p>
              <p
                style={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <b>IPFS Hash</b>: {collection.value.collection_ipfs_hash}
              </p>
              {/* Add more fields as needed */}
            </div>
          </div>
        ))}
      </div>
      <br />
      {/* Signature Details Section */}
      <h2
        style={{
          fontSize: "2em",
          marginBottom: "10px",
          alignSelf: "self-start",
        }}
      >
        Signature Details
      </h2>
      <div className="simpleGridContainer" style={{ width: "100%" }}>
        {signatureData.map((collection) => (
          <div
            key={collection.key}
            style={{
              border: "1px solid #333",
              marginBottom: "20px",
              borderRadius: "10px",
              marginRight: "20px",
              background: "green",
              overflow: "hidden",
              color: "#fff",
              padding: "10px",
            }}
          >
            <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>Signature</p>
            <div
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "100%",
              }}
            >
              {(collection as any).value.Certifiate_Signature}
            </div>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.2em",
                marginTop: "10px",
              }}
            >
              Certificate Address
            </p>
            <p>{(collection as any).value.Ceritificate_IPFS_Address}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </main>
  );
}

export default ProfilePage;
