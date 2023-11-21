'use client';
import { uploadAudio } from '@/utils/4_DatabaseActions';
import { PINATA_JWT } from '@/utils/3_Constants';
import { useGlobalContext } from '../_context/store';
import { CSSProperties, FormEvent } from 'react';
import axios from 'axios';
import {
  broadcastBlockchain,
  handleMonitizeSongToBlockchain,
  registerAudio,
} from '@/utils/1_AptosBlockchain';

function UploadAudioForm() {
  const { wallet_address, wallet_object } = useGlobalContext();
  // ---------------- UPLOAD TO IPFS ----------------
  const upload_to_ipfs = async (audio_file: any, file_name: string) => {
    const ipfs_formdata = new FormData();
    const pinata_metadata = JSON.stringify({
      name: file_name,
    });
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    ipfs_formdata.append('file', audio_file);
    ipfs_formdata.append('pinataMetadata', pinata_metadata);
    ipfs_formdata.append('pinataOptions', pinataOptions);

    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        ipfs_formdata,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${
              (ipfs_formdata as any)._boundary
            }`,
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );
      return res.data.IpfsHash;
    } catch (err) {
      console.log('Error Uploading to IPFS', err);
      return '';
    }
  };
  // ---------------- HANDLE FORM SUMBIT ----------------
  const handleFormSubmit = async (formdata: FormData) => {
    const ipfs_hash = await upload_to_ipfs(
      formdata.get('audio_file'),
      formdata.get('title') as string
    );
    const audio_obj = {
      author_wallet_address: wallet_address,
      collection_type: formdata.get('collection_type'),
      description: formdata.get('description') as string,
      end_streaming_time: new Date(
        new Date(formdata.get('streaming_time') as string).getTime() +
          10 * 60 * 1000
      ).toISOString(),
      ipfs_hash: ipfs_hash,
      monitized: false,
      streaming_time: new Date(
        formdata.get('streaming_time') as string
      ).toISOString(),
      title: formdata.get('title') as string,
    };
    const new_audio = await uploadAudio(audio_obj);
    console.log(new_audio);
    await registerAudio({
      collectionType: audio_obj.collection_type,
      songName: audio_obj.title,
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      ipfsHash: audio_obj.ipfs_hash,
      aptos_wallet: wallet_object,
      wallet_address: wallet_address,
      artistName: 'Tom',
    });
    const sig = await handleMonitizeSongToBlockchain({
      cid: audio_obj.ipfs_hash,
      noOfMaxCopies: 1,
      noOfCopyReleased: 1,
      priceOfCopy: 1,
      royality: 1,
      copyExpiryTimestamp: new Date().getTime(),
      collectionType: audio_obj.collection_type,
      songName: audio_obj.title,
      artistName: 'Tom',
      streamingTime: new Date(audio_obj.streaming_time).getTime(),
      aptos_wallet: wallet_object,
    });
    console.log('Signature', sig);
    broadcastBlockchain({
      signature: sig,
      doc_ipfs: 'DOC',
      song_ipfs: audio_obj.ipfs_hash,
      aptos_wallet: wallet_object,
    });
  };
  return (
    <form
      className="myUploadAudioForm"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleFormSubmit(new FormData(event.currentTarget));
        alert('Audio Upload Success');
      }}
    >
      {/* TEXT FIELDS */}
      <input type="text" name="title" placeholder="title" />
      <input type="text" name="description" placeholder="description" />
      {/* DATE TIME */}
      <input type="datetime-local" name="streaming_time" id="streaming_time" />
      {/* CHOISE */}
      <div>
        <label htmlFor="collection_type">Collection Type</label>
        <select name="collection_type">
          <option value="">Select Collection Type</option>
          <option value="song">Song</option>
          <option value="podcast">Podcast</option>
          <option value="debate">Debate</option>
        </select>
      </div>
      <div>
        <label htmlFor="streaming_type">Streaming Type</label>
        <select name="streaming_type">
          <option value="">Select Streaming Type</option>
          <option value="upload">Upload</option>
          <option value="live">Live Now</option>
        </select>
      </div>
      {/* FILE */}
      <input type="file" name="audio_file" id="audio_file" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UploadAudioForm;
