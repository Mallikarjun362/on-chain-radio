'use client';
import { fetchAllStreamedData } from '@/utils/4_DatabaseActions';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import {
  getPurchaseDetails,
  support,
  purchase,
} from '../../utils/1_AptosBlockchain';
import { useGlobalContext } from '../_context/store';
import { getDayDiff } from '@/utils/6_ClientUtils';
import { IAudio } from '@/mongodb_models/2_Audio';
import { FaRegPlayCircle } from 'react-icons/fa';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect, useState } from 'react';
import PurchaseDialog from '../_components/PurchaseDialog';

function StreamedAudiosSection() {
  // COMPONENT STATE VARIABLES
  const [audioList, setAudioList] = useState<Array<any>>([]);
  const { wallet_address, wallet_object } = useGlobalContext();
  const [currentSongUrl, setCurrentSongUrl] = useState<null | string>(null);
  const [currentSongObject, setCurrentSongObject] = useState<null | IAudio>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handlePurchase = async ({ author_wallet_address, song_ipfs }: any) => {
    // const details = await getPurchaseDetails(author_wallet_address);
    purchase({
      aptos_wallet: wallet_object,
      song_ipfs: song_ipfs,
      owner_artist_address: author_wallet_address,
    });
  };

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
      <div
        className="w-[80%] | lg:w-[60%] | md:w-[60%]"
        style={{ marginBottom: '200px' }}
      >
        <h1 style={{ fontSize: '2em' }}>Recently streamed</h1>
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
                  className={`flex-col | lg:flex-row | md:flex-row`}
                  key={idx}
                  style={{
                    background:
                      currentSongObject?.ipfs_hash === val.ipfs_hash
                        ? '#1db954'
                        : '#fff1',
                    justifyContent: 'space-between',
                    padding: '10px 30px',
                    borderRadius: '5px',
                    display: 'flex',
                    color: 'white',
                  }}
                >
                  {/* DIV 1 */}
                  <div>
                    <span style={{ fontSize: '22px' }}>{val.title}</span>
                    <br />
                    <span style={{ color: '#fff6' }}>{val.description}</span>
                  </div>
                  {/* DIV 2 */}
                  <div
                    className="gap-[20px] | lg:gap-[100px] | md:gap-[30px] "
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <div style={{ color: '#fff6', width: '40%' }}>
                      {getDayDiff(val.streaming_time)}
                    </div>
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
                          artist_address: val.author_wallet_address,
                          aptos_wallet: wallet_object,
                          amount: 0.5e8,
                        })
                      }
                    >
                      Support
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
                      onClick={() => {
                        handlePurchase({
                          author_wallet_address: val.author_wallet_address,
                          song_ipfs: val.ipfs_hash,
                        });
                        openDialog();
                      }}
                    >
                      Purchase
                    </button>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
      <PurchaseDialog isOpen={isDialogOpen} onClose={closeDialog}>
        <p>This is the content of the dialog.</p>
      </PurchaseDialog>

      {/* == AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER ==== AUDIO PLAYER == */}
      {true ? (
        <div
          style={{
            backdropFilter: 'blur(100px)',
            backgroundColor: '#0005',
            paddingBottom: '30px',
            position: 'fixed',
            padding: '10px',
            color: 'white',
            width: '100vw',
            bottom: 0,
          }}
        >
          <AudioPlayer
            style={{
              backgroundColor: '#0000',
              outline: 'none',
              border: 'none',
            }}
            src={currentSongUrl || ''}
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
      ) : null}
    </div>
  );
}

export default StreamedAudiosSection;
