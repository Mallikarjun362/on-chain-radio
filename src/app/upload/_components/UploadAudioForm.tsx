'use client';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { uploadAudio } from '@/utils/4_DatabaseActions';
import { useGlobalContext } from '../../_context/store';
import { upload_to_ipfs } from '@/utils/5_IPFSActions';
import { FormEvent, useEffect, useState } from 'react';
import ArtistPdfDocument from './ArtistPdfDocument';
import {
  handleMonitizeSongToBlockchain,
  broadcastBlockchain,
  registerAudio,
} from '@/utils/1_AptosBlockchain';

function UploadAudioForm() {
  const { wallet_address, wallet_object } = useGlobalContext();
  const [audioObject, setAudioObject] = useState<null | Object>(null);
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  // SUBMISSION HANDLERS
  const handleFormSubmit1 = async (formdata: FormData) => {
    const pdf_data_fields = {
      music_name: 'Sanctuary',
      created: '2023-11-17',
      artist_name: 'Joji',
      collection_type: 'Song Album',
      collection_name: 'Nectar',
    };
    // generatePDF(pdf_data_fields);
    return true;
    // 1 . UPLOAD PHASE 1
    const ipfs_formdata = new FormData();
    ipfs_formdata.append('audio_file', formdata.get('audio_file') as Blob);
    ipfs_formdata.append('file_name', formdata.get('title') as string);
    const ipfs_hash = await upload_to_ipfs(ipfs_formdata);
    // 2. AUDIO DATABASE OBJECT
    const audio_obj = {
      description: formdata.get('description') as string,
      collection_type: formdata.get('collection_type'),
      title: formdata.get('title') as string,
      author_wallet_address: wallet_address,
      artist_name: formdata.get(''),
      ipfs_hash: ipfs_hash,
      monitized: false,
      end_streaming_time: new Date(
        new Date(formdata.get('streaming_time') as string).getTime() +
          10 * 60 * 1000
      ).toISOString(),
      streaming_time: new Date(
        formdata.get('streaming_time') as string
      ).toISOString(),
    };
    // 3. REGISTER AUDIO
    await registerAudio({
      collectionType: audio_obj.collection_type,
      songName: audio_obj.title,
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      ipfsHash: audio_obj.ipfs_hash,
      aptos_wallet: wallet_object,
      wallet_address: wallet_address,
      artistName: audio_obj.artist_name,
    });
    // 4. UPLOAD AUDIO DOCUMENT TO DATABASE
    const new_audio = await uploadAudio(audio_obj);
    setAudioObject(new_audio);
    return true;
    // PHASE 1 END

    // 5. MONETIZE AUDIO
    const audio_file_signature = await handleMonitizeSongToBlockchain({
      cid: audio_obj.ipfs_hash,
      noOfMaxCopies: 1,
      noOfCopyReleased: 1,
      priceOfCopy: 1,
      royality: 1,
      copyExpiryTimestamp: new Date().getTime(),
      collectionType: audio_obj.collection_type,
      songName: audio_obj.title,
      artistName: audio_obj.artist_name,
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      aptos_wallet: wallet_object,
    });
    console.log('Signature', audio_file_signature);
    // 6. PDF DOCUMENT GENERATION
    // const pdf_data_fields = {
    //   music_name: 'Sanctuary',
    //   created: '2023-11-17',
    //   artist_name: 'Joji',
    //   collection_type: 'Song Album',
    //   collection_name: 'Nectar',
    // };
    // 7. BROAD-CAST ON BLOCKCHAIN
    broadcastBlockchain({
      signature: audio_file_signature,
      doc_ipfs: 'DOC',
      song_ipfs: audio_obj.ipfs_hash,
      aptos_wallet: wallet_object,
    });
  };

  return (
    <>
      <form
        className="myUploadAudioForm"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          await handleFormSubmit1(new FormData(event.currentTarget));
          alert('Audio Upload Success');
        }}
      >
        {/* TEXT FIELDS */}
        <input type="text" name="title" placeholder="Title" />
        <input
          type="text"
          name="artist-name"
          placeholder="Artist name"
          // required
        />
        <input type="text" name="description" placeholder="Description" />
        {/* DATE TIME */}
        <div className="inputDiv">
          <label htmlFor="streaming_time">Streaming Time</label>
          <input
            type="datetime-local"
            name="streaming_time"
            id="streaming_time"
            style={{ width: '120%' }}
            min={new Date().toISOString().slice(0, 16)}
            // required
          />
        </div>
        {/* CHOISE */}
        <div className="inputDiv">
          <label htmlFor="collection_type">Collection Type</label>
          <select name="collection_type">
            <option value="">Select Collection Type</option>
            <option value="song">Song</option>
            <option value="podcast">Podcast</option>
            <option value="debate">Debate</option>
          </select>
        </div>
        <div className="inputDiv">
          <label htmlFor="streaming_type">Streaming Type</label>
          <select name="streaming_type">
            <option value="">Select Streaming Type</option>
            <option value="upload">Upload</option>
            <option value="live">Live Now</option>
          </select>
        </div>
        {/* FILE */}
        <input type="file" name="audio_file" id="audio_file" />
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
            ['price_of_copy', 'Price of a Copy'],
            ['royality', 'Royality'],
          ].map((val, idx) => (
            <input
              type="number"
              key={idx}
              name={val[0]}
              id={val[0]}
              placeholder={val[1]}
              // required
            />
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
      <br />
      <br />
      <br />
      {isLoaded ? (
        // <PDFDownloadLink document={<ArtistPdfDocument artist_name={"Tom"} />} fileName="somename.pdf">
        //   {({ blob, url, loading, error }) =>
        //     loading ? 'Loading document...' : 'Download now!'
        //   }
        // </PDFDownloadLink>
        <PDFViewer
          height="1000px"
          width="100%"
          className='focus:shadow-slate-50'
          style={{ borderRadius: '20px' }}
        >
          <ArtistPdfDocument />
        </PDFViewer>
      ) : null}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default UploadAudioForm;
