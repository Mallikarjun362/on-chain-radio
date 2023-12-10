'use client';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { uploadAudio } from '@/utils/4_DatabaseActions';
import { useGlobalContext } from '../../_context/store';
import { upload_to_ipfs } from '@/utils/5_IPFSActions';
import { FormEvent, useEffect, useState } from 'react';
import ArtistPdfDocument from './ArtistPdfDocument';
import {
  signPdfDocument,
  broadcastBlockchain,
  registerAudio,
} from '@/utils/1_AptosBlockchain';
import { IAudio } from '@/mongodb_models/2_Audio';

function UploadAudioForm() {
  // COMPONENT STATE VARIABLES
  const { wallet_address, wallet_object, public_key } = useGlobalContext();
  const [audioDbObj, setAudioDbObj] = useState<null | IAudio>(null);
  const [formData1, setFormData1] = useState<null | FormData>(null);
  const [formData2, setFormData2] = useState<null | FormData>(null);
  const [signatureResult, setSignatureResult] = useState<any>(null);
  const [broadcastTsx, setBroadcastTsx] = useState<any>(null);
  const [formState, setFormState] = useState<number>(0);
  const [isPageLoaded, setPageLoaded] = useState(false);
  const [audioObj, setAudioObj] = useState<any>(null);
  const [pdfIpfsHash, setPdfIpfsHash] = useState<any>('');
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
  // SUBMISSION HANDLERS
  const handleFormSubmit1 = async (formdata: FormData) => {
    let duration_in_seconds: number = 3 * 60;
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      duration_in_seconds = audio.duration;
    });
    audio.src = URL.createObjectURL(formdata.get('audio_file') as Blob);
    sleep(3);
    // 1 . UPLOAD AUDIO FILE S AND GET THE HASH
    const ipfs_formdata = new FormData();
    ipfs_formdata.append('audio_file', formdata.get('audio_file') as Blob);
    ipfs_formdata.append('file_name', formdata.get('title') as string);
    const ipfs_hash = await upload_to_ipfs(ipfs_formdata);

    console.log('Audio Duration', duration_in_seconds);
    // 2. AUDIO DATABASE OBJECT
    const audio_obj = {
      description: formdata.get('description') as string,
      collection_type: formdata.get('collection_type'),
      artist_name: formdata.get('artist-name'),
      title: formdata.get('title') as string,
      author_wallet_address: wallet_address,
      collection_name: 'My Collection Name',
      ipfs_hash: ipfs_hash,
      monitized: false,
      end_streaming_time: new Date(
        new Date(formdata.get('streaming_time') as string).getTime() +
          duration_in_seconds * 1000
      ).toISOString(),
      streaming_time: new Date(
        formdata.get('streaming_time') as string
      ).toISOString(),
    };

    // 3. REGISTER AUDIO
    // NO NEED TO STORE THE RETURN VALUE
    await registerAudio({
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      collectionType: audio_obj.collection_type,
      artistName: audio_obj.artist_name,
      wallet_address: wallet_address,
      ipfsHash: audio_obj.ipfs_hash,
      aptos_wallet: wallet_object,
      songName: audio_obj.title,
    });

    // 4. UPLOAD AUDIO DOCUMENT TO DATABASE
    const new_audio = await uploadAudio(audio_obj);

    // ALL THE DATA COLLECTED FROM THIS FUNCTION
    setAudioDbObj(new_audio as any);
    setFormData1(formdata);
    setAudioObj(audio_obj);
    setFormState(1);
    return true;
  };

  const handleFormSubmit2 = async (formdata: FormData) => {
    // JUST SAVE THE RECEIVED DATA
    setFormData2(formdata);
    setFormState(2);
    return true;
  };

  const signDocumentAndBroadcast = async () => {
    const audio_obj: any = audioObj;
    const result = await signPdfDocument({
      // DYNAMIC FIELDS
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      noOfCopyReleased: formData2?.get('num_of_copy_released'),
      noOfMaxCopies: formData2?.get('num_of_max_copies'),
      priceOfCopy: formData2?.get('price_of_copy'),
      copyExpiryTimestamp: new Date().getTime(),
      collectionType: audio_obj.collection_type,
      royality: formData2?.get('royality'),
      artistName: audio_obj.artist_name,
      aptos_wallet: wallet_object,
      songName: audio_obj.title,
      cid: audio_obj.ipfs_hash,
    });
    console.log('Pdf Signature', result?.signature);

    // SAVE DOCUMENT ON IPFS AND GET THE HASH
    const the_pdf_file: any = null;
    const ipfs_formdata = new FormData();
    ipfs_formdata.append('audio_file', the_pdf_file as Blob);
    ipfs_formdata.append('file_name', formData1?.get('title') as string);
    const pdf_ipfs_hash = await upload_to_ipfs(ipfs_formdata);
    setPdfIpfsHash(pdf_ipfs_hash);
    // BROAD-CAST ON BLOCKCHAIN
    const broadcastTx = await broadcastBlockchain({
      // DYNAMIC VALUES
      currentCopies: formData2?.get('num_of_copy_released'),
      maxcopies: formData2?.get('num_of_max_copies'),
      price: formData2?.get('price_of_copy'),
      royalities: formData2?.get('royality'),
      certificateAddr: pdf_ipfs_hash,
      ceritifiateHash: result?.hash,
      song_ipfs: audio_obj.ipfs_hash,
      signature: result?.signature,
      aptos_wallet: wallet_object,
      doc_ipfs: pdf_ipfs_hash,
    });
    setSignatureResult(result);
    setBroadcastTsx(broadcastTx);
    setFormState(3);
    return true;
  };

  return (
    <div
      style={{
        flexDirection: 'column',
        paddingBottom: '300px',
        display: 'flex',
        gap: '30px',
      }}
    >
      {/* == FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 ==== FORM 1 == */}
      <form
        className="myUploadAudioForm"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault(); // PREVENT DEFAULT BEHAVIOUR OF PAGE RELODE
          await handleFormSubmit1(new FormData(event.currentTarget)); // SUBMIT TO FORM HANDLER
        }}
      >
        <h1>Basic information</h1>
        {/* TEXT FIELDS */}
        <input
          disabled={formState !== 0}
          placeholder="Title"
          name="title"
          type="text"
          required
        />
        <input
          disabled={formState !== 0}
          placeholder="Artist name"
          name="artist-name"
          type="text"
          required
        />
        <input
          disabled={formState !== 0}
          placeholder="Description"
          name="description"
          type="text"
        />
        {/* DATE TIME */}
        <div className="inputDiv">
          <label htmlFor="streaming_time">Streaming Time</label>
          <input
            min={new Date().toISOString().slice(0, 16)}
            disabled={formState !== 0}
            style={{ width: '120%' }}
            type="datetime-local"
            name="streaming_time"
            id="streaming_time"
            required
          />
        </div>
        {/* CHOISE */}
        <div className="inputDiv">
          <label htmlFor="collection_type">Collection Type</label>
          <select
            disabled={formState !== 0}
            name="collection_type"
            id="collection_type"
            required
          >
            <option value="">Select Collection Type</option>
            <option value="song">Song</option>
            <option value="podcast">Podcast</option>
            <option value="debate">Debate</option>
          </select>
        </div>
        {/* FILE */}
        <input
          disabled={formState !== 0}
          name="audio_file"
          id="audio_file"
          type="file"
          required
        />
        {formState === 0 ? <button type="submit">Next</button> : null}
      </form>

      {/* == FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 ==== FORM 2 == */}
      {formState >= 1 ? (
        <form
          className="myUploadAudioForm"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault(); // PREVENT DEFAULT BEHAVIOUR OF PAGE RELODE
            await handleFormSubmit2(new FormData(event.currentTarget)); // SUBMIT TO FORM HANDLER
          }}
        >
          <h1>Monetization information</h1>
          <div
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              display: 'flex',
              gap: '20px',
            }}
          >
            {[
              ['num_of_max_copies', 'Number of max copies'],
              ['num_of_copy_released', 'Number of copies'],
              ['price_of_copy', 'Price of a Copy (in Aptos)'],
              ['royality', 'Royality'],
            ].map((val, idx) => (
              <input
                disabled={formState !== 1}
                placeholder={val[1]}
                name={val[0]}
                type="number"
                id={val[0]}
                key={idx}
                required
              />
            ))}
          </div>
          {formState === 1 ? <button type="submit">Next</button> : null}
        </form>
      ) : null}
      {/* == PDF PREVIEW ==== PDF PREVIEW ==== PDF PREVIEW ==== PDF PREVIEW ==== PDF PREVIEW ==== PDF PREVIEW == */}
      {isPageLoaded && formState === 2 ? (
        <div
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            display: 'flex',
            gap: '20px',
          }}
        >
          <h1 style={{ fontSize: '30px' }}>PDF Preview</h1>
          <PDFViewer
            className="focus:shadow-slate-50"
            style={{ borderRadius: '20px' }}
            height="1000px"
            width="100%"
          >
            <ArtistPdfDocument
              // DYNAMIC FIELDS
              copies_released={formData2?.get('num_of_copy_released')}
              artist_public_key={broadcastTsx?.signature?.public_key}
              max_copies={formData2?.get('num_of_max_copies')}
              signature_timestamp={new Date().toISOString()}
              artist_signature={signatureResult?.signature}
              collection_type={audioObj?.collection_type}
              collection_name={audioObj?.collection_name}
              price={formData2?.get('price_of_copy')}
              end_date={audioObj?.end_streaming_time}
              stream_time={audioObj?.streaming_time}
              transaction_hash={broadcastTsx?.hash}
              artist_name={audioObj?.artist_name}
              artist_public_address={public_key}
              hash={signatureResult?.hash || ''}
              song_hash={audioObj?.ipfs_hash}
              ipfs_address={pdfIpfsHash} //CERTIFICATE IPFS ADDRESS
              title={audioObj?.title}
              // HARD CODED VALUES
              kyc="true"
              exclusive_rights="Rights"
              certificates_activated="true"
              specify_credit_terms="Credit Terms"
              your_jurisdiction="Your Jurisdiction"
              specify_royalty_terms="Royality Terms"
              specify_dispute_resolution_mechanism="Dispute Resolution Mechanism"
            />
          </PDFViewer>
          <button
            style={{
              backgroundColor: '#fff5',
              whiteSpace: 'nowrap',
              borderRadius: '7px',
              alignSelf: 'center',
              padding: '7px 30px',
              fontSize: '20px',
            }}
            onClick={signDocumentAndBroadcast}
          >
            Sign Document and Broadcast
          </button>
        </div>
      ) : null}
      {isPageLoaded && formState === 3 ? (
        <div
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            display: 'flex',
            gap: '20px',
          }}
        >
          <h1 style={{ fontSize: '30px' }}>Final PDF</h1>
          <PDFViewer
            className="focus:shadow-slate-50"
            style={{ borderRadius: '20px' }}
            height="1000px"
            width="100%"
          >
            <ArtistPdfDocument
              // DYNAMIC FIELDS
              copies_released={formData2?.get('num_of_copy_released')}
              artist_public_key={broadcastTsx?.signature?.public_key}
              max_copies={formData2?.get('num_of_max_copies')}
              signature_timestamp={new Date().toISOString()}
              artist_signature={signatureResult?.signature}
              collection_type={audioObj?.collection_type}
              collection_name={audioObj?.collection_name}
              price={formData2?.get('price_of_copy')}
              end_date={audioObj?.end_streaming_time}
              stream_time={audioObj?.streaming_time}
              transaction_hash={broadcastTsx?.hash}
              artist_name={audioObj?.artist_name}
              artist_public_address={public_key}
              hash={signatureResult?.hash || ''}
              song_hash={audioObj?.ipfs_hash}
              ipfs_address={pdfIpfsHash} //CERTIFICATE IPFS ADDRESS
              title={audioObj?.title}
              // HARD CODED VALUES
              kyc="true"
              exclusive_rights="Rights"
              certificates_activated="true"
              specify_credit_terms="Credit Terms"
              your_jurisdiction="Your Jurisdiction"
              specify_royalty_terms="Royality Terms"
              specify_dispute_resolution_mechanism="Dispute Resolution Mechanism"
            />
          </PDFViewer>
          <PDFDownloadLink
            document={
              <ArtistPdfDocument
                // DYNAMIC FIELDS
                copies_released={formData2?.get('num_of_copy_released')}
                artist_public_key={broadcastTsx?.signature?.public_key}
                max_copies={formData2?.get('num_of_max_copies')}
                signature_timestamp={new Date().toISOString()}
                artist_signature={signatureResult?.signature}
                collection_type={audioObj?.collection_type}
                collection_name={audioObj?.collection_name}
                price={formData2?.get('price_of_copy')}
                end_date={audioObj?.end_streaming_time}
                artist_public_address={wallet_address}
                stream_time={audioObj?.streaming_time}
                transaction_hash={broadcastTsx?.hash}
                artist_name={audioObj?.artist_name}
                hash={signatureResult?.hash || ''}
                song_hash={audioObj?.ipfs_hash}
                title={audioObj?.title}
                // HARD CODED VALUES
                kyc="true"
                exclusive_rights="Rights"
                ipfs_address="0x123456789"
                certificates_activated="true"
                specify_credit_terms="Credit Terms"
                your_jurisdiction="Your Jurisdiction"
                specify_royalty_terms="Royality Terms"
                specify_dispute_resolution_mechanism="Dispute Resolution Mechanism"
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
                  }}
                >
                  Download Final PDF
                </p>
              )
            }
          </PDFDownloadLink>
        </div>
      ) : null}
    </div>
  );
}

export default UploadAudioForm;
