'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../_context/store';
import { Provider, Network } from 'aptos';
import { MODULE_ADDRESS } from '@/utils/3_Constants';

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
    <div>
      <div style={{ padding: '20px', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Profile Audio</h1>

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
    </div>
  );
}

export default ProfilePage;
