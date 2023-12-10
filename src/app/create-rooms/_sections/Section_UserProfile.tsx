'use client';
import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import ConnectToPlatform from '../_components/ConnectToPlatform';
import { useGlobalContext } from '@/app/_context/store';
import { IoLink } from 'react-icons/io5';
// UTILITY FUNCTIONS
const getRandomEmoji = (): string => {
  const emojies: string[] = ['👻', '😺', '👦', '🌻', '🧑‍💻', '👩‍🚀', '👩‍🔬'];
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
      className={`${styles.pageSection}`}
      style={{
        gap: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        userSelect:"none",
      }}
    >
      {/* DIV LEFT */}
      <div
        style={{
          flexGrow: 0,
          flexShrink: 0,
          width: '200px',
          height: '200px',
          display: 'flex',
          fontSize: '130px',
          flexBasis: 'auto',
          alignItems: 'center',
          borderRadius: '100%',
          justifyContent: 'center',
          backgroundColor: '#FFF5',
          border: '2px solid white',
          overflow: 'hidden',
        }}
      >
        {profileEmoji}
      </div>
      {/* DIV RIGHT */}
      <div
        style={{
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: 'auto',
          color: 'white',
          fontSize: '30px',
          alignSelf: 'stretch',
          width: 'inherit',
          padding: '20px',
          fontWeight: '500',
          overflow: 'clip',
        }}
      >
        {wallet_address ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0px',
              }}
            >
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'clip',
                }}
              >
                <span style={{ color: '#FFF4' }}>{'0x'}</span>
                {wallet_address.slice(2, wallet_address.length)}
              </div>
              <button
                className="shadow-lg transform active:scale-75 transition-transform rounded-full"
                style={{
                  backgroundColor: '#fff3',
                  padding: '10px',
                }}
                onClick={() => navigator?.clipboard?.writeText(wallet_address)}
              >
                <IoLink />
              </button>
            </div>
            <ConnectToPlatform />
            <br />
            <br />
            <hr style={{ backgroundColor: 'white' }} />
          </div>
        ) : (
          'Wallet Not Connected !!'
        )}
        {is_connected ? (
          <button
            style={{
              backgroundColor: '#A00',
              padding: '5px 20px',
              fontSize: '16px',
              borderRadius: '100px',
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
