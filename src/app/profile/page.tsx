'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../_context/store';
import { Provider, Network } from 'aptos';
import { MODULE_ADDRESS } from '@/utils/3_Constants';
import Section_UserProfile from '../create-rooms/_sections/Section_UserProfile';

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
      console.error('Error fetching account details:', e);
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  return (
    <main
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
      }}
    >
      <div
        style={{
          flexDirection: 'column',
          marginBottom: '60px',
          padding: '20px',
          maxWidth: '60%',
          display: 'flex',
          gap: '30px',
        }}
      >
        <Section_UserProfile />
        {/* Collections Section */}
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Collections</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {collectionsData.map((collection) => (
            <div
              key={collection.key}
              style={{
                marginBottom: '20px',
                marginRight: '20px',
                width: '300px',
                border: '1px solid #333',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <img
                src={`https://via.placeholder.com/300x150?text=${collection.value.collectionName}`}
                alt={collection.value.collectionName}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  {collection.value.collectionName}
                </p>
                <p>Collection Type: {collection.value.collectionType}</p>
                <p>IPFS Hash: {collection.value.collection_ipfs_hash}</p>
                {/* Add more fields as needed */}
              </div>
            </div>
          ))}
        </div>

        {/* Signature Details Section */}
        <h2
          style={{ fontSize: '1.5em', marginTop: '20px', marginBottom: '10px' }}
        >
          Signature Details
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {signatureData.map((collection) => (
            <div
              key={collection.key}
              style={{
                marginBottom: '20px',
                marginRight: '20px',
                width: '300px',
                border: '1px solid #333',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'green',
                color: '#fff',
              }}
            >
              <div style={{ padding: '15px' }}>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  Signature
                </p>
                <p>{(collection as any).value.Certifiate_Signature}</p>
                <p
                  style={{
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    marginTop: '10px',
                  }}
                >
                  Certificate Address
                </p>
                <p>{(collection as any).value.Ceritificate_IPFS_Address}</p>
                {/* Add more fields as needed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
