'use client';
import { fetchAllCurrentStreamingData } from '@/utils/4_DatabaseActions';
import { useEffect, useState } from 'react';
import StreamedAudioChip from '../_components/AudioChipStreamed';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useGlobalContext } from '../_context/store';
import {support} from '../../utils/1_AptosBlockchain'

function CurrentStreamingAudioPage() {

  const { wallet_address, wallet_object } = useGlobalContext();

  const [audio_list, setAudioList] = useState<Array<any>>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [currentSongName, setCurrentSongName] = useState<string | null>(null);

   console.log(audio_list)
  useEffect(() => {
    const run = async () => {
      setAudioList(await fetchAllCurrentStreamingData());
    };
    run();
  }, []);

  const playAudio = (ipfsHash: string, title: string) => {
    setCurrentSong(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    setCurrentSongName(title);
};

  return (
    // <main
    //   style={{
    //     padding: '20px 20%',
    //     display: 'flex',
    //     gap: '20px',
    //     flexDirection: 'column',
    //   }}
    // >
    //   {audio_list.map((val, idx) => (
    //     <StreamedAudioChip key={idx} audio_obj={val} />
    //   ))}
    // </main>
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#fff', background: '#121212', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ padding: '20px', marginBottom:60 }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Live Streaming Audio</h1>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {audio_list.map((val, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: '10px',
                  border: '1px solid #333',
                  padding: '10px',
                  borderRadius: '5px',
                  background: currentSongName === val.title ? '#1db954' : '#222',
                  color: currentSongName === val.title ? '#fff' : '#fff',
                }}
              >
                {val.ipfs_hash && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ marginRight: '10px' }}>{val.title}</span>
                    <span style={{ marginRight: '10px' }}>{val.description}</span>
                    <button
                      onClick={() => playAudio(val.ipfs_hash, val.title)}
                      style={{
                        background: '#1db954',
                        color: '#fff',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '10%',
                        cursor: 'pointer',
                      }}
                    >
                      Play
                    </button>
                    <button
                      onClick={() => support({
                        aptos_wallet: wallet_object,
                        artist_address: wallet_address,
                        song_ipfs: val.ipfs_hash,
                        amount:0.5e8
                      })}
                      style={{
                        background: '#1db954',
                        color: '#fff',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '10%',
                        cursor: 'pointer',
                      }}
                    >
                      Support
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
      </div>

      {/* Audio Player */}
      {currentSong && (
        <div style={{ position: 'fixed', bottom: 0, left: 20, right: 20, background: 'orange', textAlign: 'center' }}>
          <p style={{ margin: '0', color: '#fff', fontSize: '1.2em' }}>Now Playing:</p>
          {/* <audio controls src={currentSong} style={{ width: '100%' }} /> */}
          <AudioPlayer
          style={{backgroundColor:'black'}}
                        src={currentSong}
                        autoPlay
                        showSkipControls={false}
                        showJumpControls={false}
                        // showFilledProgress={false}
                        autoPlayAfterSrcChange={false}
                        onSeeking={() => console.log('seekong')}

                        customControlsSection={
                            [
                                // RHAP_UI.MAIN_CONTROLS,
                                RHAP_UI.VOLUME_CONTROLS,
                            ]
                        }
                        customProgressBarSection={
                            [
                                // RHAP_UI.PROGRESS_BAR,
                                RHAP_UI.CURRENT_TIME,
                                // <div>/</div>,
                                // RHAP_UI.DURATION
                                // RHAP_UI.CURRENT_LEFT_TIME,
                            ]
                        }
                        progressJumpSteps={{
                            backward: 0,
                            forward: 0
                        }}
                    // onListen={(e) => e.preventDefault}
                    // onPlaying={(e) => e.stopPropagation}
                    />
        </div>
      )}
    </div>
  );
}

export default CurrentStreamingAudioPage;
