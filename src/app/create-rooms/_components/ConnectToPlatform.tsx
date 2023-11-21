'use client';
import { useGlobalContext } from '@/app/_context/store';
import { connectToBackend } from '@/utils/2_Authentication';
import { CSSProperties } from 'react';

function ConnectToPlatform() {
  const {
    public_key,
    wallet_address,
    jwt_auth_token,
    setJwtAuthToken,
    is_connected,
  } = useGlobalContext();
  const componentStyle: CSSProperties = {
    borderRadius: '100px',
    padding: '5px 20px',
    userSelect: 'none',
    fontSize: '20px',
  };
  return (
    <span>
      {jwt_auth_token && wallet_address ? (
        <span style={{ backgroundColor: 'green', ...componentStyle }}>
          Connected Successfully
        </span>
      ) : (
        <button
          style={{ backgroundColor: 'orange', ...componentStyle }}
          onClick={(e) =>
            connectToBackend(wallet_address, public_key).then(
              (jwt_auth_token) => setJwtAuthToken(jwt_auth_token)
            )
          }
        >
          Connect To Platform
        </button>
      )}
    </span>
  );
}

export default ConnectToPlatform;
