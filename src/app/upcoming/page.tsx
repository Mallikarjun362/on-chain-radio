'use client';
import {
  fetchAllPostStreamingData,
  fetchAllStreamedData,
} from '@/utils/4_DatabaseActions';
import { support } from '../../utils/1_AptosBlockchain';
import { useGlobalContext } from '../_context/store';
import { getDayDiff } from '@/utils/6_ClientUtils';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect, useState } from 'react';

function UpcomingAudiosPage() {
  // COMPONENT STATE VARIABLES
  const [audioList, setAudioList] = useState<Array<any>>([]);
  const { wallet_address, wallet_object } = useGlobalContext();

  useEffect(() => {
    const run = async () => {
      const results = await fetchAllPostStreamingData(); // FETCH AUDIOS FROM BACKEND THAT WILL STREAM IN FUTURE
      setAudioList(results); // SET THE AUDIOS RECEIVED FROM BACKEND
      console.log(results);
    };
    if (audioList.length == 0) {
      run();
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {/* == DISPLAY OF UPCOMING SONGS ==== DISPLAY OF UPCOMING SONGS ==== DISPLAY OF UPCOMING SONGS ==== DISPLAY OF UPCOMING SONGS == */}
      <div style={{ width: '60%', padding: '20px', marginBottom: '200px' }}>
        <h1 style={{ fontSize: '2em' }}>Upcoming songs</h1>
        <br />
        {audioList.length == 0 ? (
          <div
            style={{
              textAlign: 'center',
              userSelect: 'none',
              marginTop: '30vh',
              fontSize: '50px',
              color: '#fff6',
            }}
          >
            Empty 😔
          </div>
        ) : null}
        <ul
          style={{
            flexDirection: 'column',
            listStyle: 'none',
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* STREAMED AUDIO LIST ITEM */}
          {audioList.map(
            (val, idx) =>
              val.ipfs_hash && (
                <li
                  key={idx}
                  style={{
                    background: '#fff1',
                    color: '#fff',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '5px',
                    padding: '10px 30px',
                    display: 'flex',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '22px' }}>{val.title}</span>
                    <br />
                    <span style={{ color: '#fff6' }}>{val.description}</span>
                  </div>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      gap: '100px',
                    }}
                  >
                    <div
                      style={{ color: '#fff6', fontSize: '20px', width: '40%' }}
                    >
                      {getDayDiff(val.streaming_time)}
                    </div>
                    <button
                      style={{
                        background: '#1db954',
                        padding: '8px 12px',
                        borderRadius: '10%',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        userSelect: 'none',
                      }}
                      onClick={() =>
                        support({
                          artist_address: wallet_address,
                          aptos_wallet: wallet_object,
                          song_ipfs: val.ipfs_hash,
                          amount: 0.5e8,
                        })
                      }
                    >
                      Support
                    </button>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}

export default UpcomingAudiosPage;
