'use client';
import { fetchAllStreamedData } from '@/utils/4_DatabaseActions';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import { support, purchase } from '../../utils/1_AptosBlockchain';
import { useGlobalContext } from '../_context/store';
import { getDayDiff } from '@/utils/6_ClientUtils';
import { IAudio } from '@/mongodb_models/2_Audio';
import { FaRegPlayCircle } from 'react-icons/fa';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect, useState } from 'react';
import PurchaseDialog from '../_components/PurchaseDialog';
import BuyerPDFDocument from '../upload/_components/BuyerPdfDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

function StreamedAudiosSection() {
  // COMPONENT STATE VARIABLES
  const [audioList, setAudioList] = useState<Array<any>>([]);
  const { wallet_address, wallet_object, public_key } = useGlobalContext();
  const [currentSongUrl, setCurrentSongUrl] = useState<null | string>(null);
  const [currentSongObject, setCurrentSongObject] = useState<null | IAudio>(
    null
  );
  const [buyerDetails, setBuyerDetails] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

  const handlePurchase = async ({ songDbObj }: any) => {
    // const details = await getPurchaseDetails(author_wallet_address);
    /*
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipfs_hash: { type: String, unique: true, index: true },
    author_wallet_address: { type: String, required: true },
    end_streaming_time: { type: Date },
    collection_type: { type: String },
    streaming_time: { type: Date },
    description: { type: String },
    artist_name: { type: String },
    monitized: { type: Boolean },
    title: { type: String },
    */
    const purchase_tx = await purchase({
      aptos_wallet: wallet_object,
      song_ipfs: songDbObj?.ipfs_hash,
      owner_artist_address: songDbObj?.author_wallet_address,
    });
    if (purchase_tx?.hash) {
      const b = {
        artist_name: songDbObj?.artist_name,
        title: songDbObj?.title,
        collection_type: songDbObj?.collection_type,
        collection_name: 'My Song Collection',
        streaming_time: songDbObj?.streaming_time,
        song_hash: songDbObj?.ipfs_hash,
        artist_public_address: songDbObj?.author_wallet_address,
        buyer_public_address: wallet_address,
        buyer_public_key: public_key,
        transaction_hash: purchase_tx?.hash,
      };

      setBuyerDetails(b);
      sleep(2);
      handleOpenDialog();
      return;
    }
    // purchase_tx.hash
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
          {audioList.map(
            (val, idx) =>
              val.ipfs_hash && (
                <li
                  className="flex-col bg-[#fff1]| lg:flex-row | md:flex-row"
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
                  <div>
                    <span style={{ fontSize: '22px' }}>{val?.title}</span>
                    <br />
                    <span style={{ color: '#fff6' }}>{val?.description}</span>
                  </div>
                  <div
                    className="gap-[20px] | lg:gap-[100px] | md:gap-[30px] "
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <div style={{ color: '#fff6', width: '40%' }}>
                      {getDayDiff(val?.streaming_time)}
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
                        userSelect: 'none',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                      }}
                      onClick={() => {
                        support({
                          artist_address: val?.author_wallet_address,
                          aptos_wallet: wallet_object,
                          amount: 0.5e8,
                        });
                      }}
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
                        handlePurchase({ songDbObj: val });
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
                key={0}
                style={{
                  width: 'calc(50% - 20px)',
                  fontSize: '20px',
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
      <PurchaseDialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
        <PDFDownloadLink
          document={
            <BuyerPDFDocument
              artist_name={buyerDetails?.artist_name}
              title={buyerDetails?.title}
              collection_type={buyerDetails?.collection_type}
              collection_name={buyerDetails?.collection_name}
              stream_time={buyerDetails?.streaming_time}
              song_hash={buyerDetails?.song_hash}
              max_copies={1000}
              copies_released={1}
              price={1}
              ipfs_address={buyerDetails?.song_hash}
              end_date={''}
              artist_public_address={buyerDetails?.artist_public_address}
              hash={''}
              copy_number={1}
              artist_signature={''}
              // HARD CODED VALUES
              kyc="true"
              certificates_activated="true"
              specify_dispute_resolution_mechanism="Dispute Resolution Mechanism"
              specify_royalty_terms="Royality Terms"
              your_jurisdiction="Your Jurisdiction"
              specify_credit_terms="Credit Terms"
              exclusive_rights="Rights"
              // ----------------- BUYER DETAILS --------------------
              buyer_public_address={buyerDetails?.buyer_public_address}
              buyer_public_key={buyerDetails?.buyer_public_key}
              buyer_document_ipfs={''}
              buyer_transaction_hash={buyerDetails?.transaction_hash}
            />
          }
          fileName="final_document.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              'Loading document...'
            ) : (
              <p
                style={{
                  backgroundColor: '#fff5',
                  whiteSpace: 'nowrap',
                  borderRadius: '7px',
                  alignSelf: 'center',
                  padding: '7px 30px',
                  fontSize: '20px',
                  color: 'black',
                }}
              >
                Download Final PDF
              </p>
            )
          }
        </PDFDownloadLink>
      </PurchaseDialog>
    </div>
  );
}

export default StreamedAudiosSection;
