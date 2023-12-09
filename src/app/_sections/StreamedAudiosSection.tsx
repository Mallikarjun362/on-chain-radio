'use client';
import { CSSProperties, useEffect, useState } from 'react';
import { FaRegPlayCircle } from 'react-icons/fa';
import { fetchAllStreamedData } from '@/utils/4_DatabaseActions';
import { useGlobalContext } from '../_context/store';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { support } from '../../utils/1_AptosBlockchain';
import { IAudio } from '@/mongodb_models/2_Audio';

function StreamedAudiosSection() {
  // COMPONENT STATE VARIABLES
  const [audioList, setAudioList] = useState<Array<any>>([]);
  const { wallet_address, wallet_object } = useGlobalContext();
  const [currentSongUrl, setCurrentSongUrl] = useState<null | string>(null);
  const [currentSongObject, setCurrentSongObject] = useState<null | IAudio>(
    null
  );

  useEffect(() => {
    const run = async () => {
      const results = await fetchAllStreamedData(); // FETCH AUDIOS FROM BACKEND THAT ARE ALREADY STREAMED
      setAudioList(results); // SET THE AUDIOS RECEIVED FROM BACKEND
      console.log(results);
    };
    if (audioList.length == 0) {
      run();
    }
  }, []);

  const playAudio = (songObject: any) => {
    setCurrentSongUrl(
      `https://gateway.pinata.cloud/ipfs/${songObject?.ipfs_hash}`
    );
    setCurrentSongObject(songObject);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {/* == DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS == */}
      <div style={{ width: '60%', padding: '20px', marginBottom: '200px' }}>
        <h1 style={{ fontSize: '2em' }}>Your Library</h1>
        <br />
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
                    background:
                      currentSongObject?.ipfs_hash === val.ipfs_hash
                        ? '#1db954'
                        : '#fff1',
                    color:
                      currentSongObject?.ipfs_hash === val.ipfs_hash
                        ? '#fff'
                        : '#fff',
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
                  <div style={{ display: 'flex', gap: '100px' }}>
                    <button
                      onClick={() => playAudio(val)}
                      className="text-[#fff7] hover:text-[#fff]"
                      style={{
                        borderRadius: '100%',
                        fontSize: '35px',
                        padding: '0px',
                      }}
                    >
                      <FaRegPlayCircle />
                    </button>
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

      {/* == AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER == */}
      {currentSongUrl && (
        <div
          style={{
            backdropFilter: 'blur(100px)',
            backgroundColor: '#0005',
            paddingBottom: '30px',
            position: 'fixed',
            padding: '10px',
            color: 'white',
            width: '100%',
            bottom: 0,
          }}
        >
          <AudioPlayer
            style={{
              backgroundColor: '#0000',
              outline: 'none',
              border: 'none',
            }}
            src={currentSongUrl}
            autoPlay
            layout="stacked-reverse"
            showSkipControls={false}
            showJumpControls={false}
            showFilledProgress={false}
            autoPlayAfterSrcChange={false}
            customControlsSection={[
              <div
                style={{
                  fontSize: '20px',
                  width: 'calc(50% - 20px)',
                }}
              >
                {'Now Playing: '}
                {currentSongObject?.title}
              </div>,
              RHAP_UI.MAIN_CONTROLS,
              RHAP_UI.VOLUME_CONTROLS,
            ]}
            customProgressBarSection={[
              RHAP_UI.CURRENT_TIME,
              RHAP_UI.PROGRESS_BAR,
            ]}
            progressJumpSteps={{
              backward: 0,
              forward: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default StreamedAudiosSection;
