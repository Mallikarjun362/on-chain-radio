'use client';
import { Provider, Network } from 'aptos';
import { MODULE_ADDRESS } from './3_Constants';
import { createHash } from 'crypto';

function calculateSHA256Hash(jsonObject: any): string {
  const jsonString = JSON.stringify(jsonObject);
  const hash = createHash('sha256');
  hash.update(jsonString);
  return hash.digest('hex');
}

const provider = new Provider(Network.TESTNET);

export async function registerAudio({
  collectionType,
  songName,
  streamingTime,
  ipfsHash,
  aptos_wallet,
  wallet_address,
  artistName,
}: any) {
  /*
  Purpose: 
    Takes the arguments and registers the audio. (First blockchain function)
  // artist_name, collection_type, collection_name, streaming_timestamp, ipfs_hash
  */
  const transaction_1 = {
    arguments: [artistName, collectionType, songName, streamingTime, ipfsHash],
    function: `${MODULE_ADDRESS}::OnChainRadio::create_collection`,
    type: 'entry_function_payload',
    type_arguments: [],
  };
  try {
    const createCollectionTransaction =
      await aptos_wallet.signAndSubmitTransaction(transaction_1);
    console.log("Register audio success", createCollectionTransaction);
  } catch (error) {
    console.error('Error Registering Song', error);
  }
}

export const signPdfDocument = async ({
  cid,
  noOfMaxCopies,
  noOfCopyReleased,
  priceOfCopy,
  royality,
  copyExpiryTimestamp,
  collectionType,
  songName,
  artistName,
  streamingTime,
  aptos_wallet,
}: any) => {
  /*
  Purpose: 
    Takes the Arguments and signs the transaction with aptos wallet and returns the signature of the pdf document.
  */
  try {
    const collectionDetails = {
      collectionType: collectionType,
      songName: songName,
      artistName: artistName,
      streamingTime: streamingTime,
      ipfsHash: cid,
      currentTime: new Date(),
    };
    const monitization = {
      isKycVerified: true,
      NoOfMaxCopies: noOfMaxCopies,
      NoOfCopyReleased: noOfCopyReleased,
      PriceOfCopy: priceOfCopy,
      CertificateActivated: true,
      Royality: royality,
      CopyExpiryTimestamp: copyExpiryTimestamp,
    };

    let messagePayload = {
      collectionDetail: collectionDetails,
      monitizationDetail: monitization,
    };

    let signedMessage = await aptos_wallet.signMessage({
      payload: messagePayload,
    });
    console.log("Sign document successful", signedMessage);
    return { signature: signedMessage.signature, hash: calculateSHA256Hash(signedMessage) };
  } catch (error) {
    console.log("Error signing the pdf document", error);
  }
};

export async function broadcastBlockchain({
  signature, song_ipfs, aptos_wallet, maxcopies,
  currentCopies, price, royalities, certificateAddr, ceritifiateHash,
}: any) {
  /*
  Purpose:
    Takes the arguments and broadcasts it on blockchain. (Last blockchain function)
  */
  const transaction = {
    arguments: [song_ipfs, maxcopies, currentCopies, price, royalities, certificateAddr, ceritifiateHash, signature],
    function: `${MODULE_ADDRESS}::OnChainRadio::Broadcast`,
    type: 'entry_function_payload',
    type_arguments: [],
  };
  const broadcastTx = await aptos_wallet.signAndSubmitTransaction(transaction);
  console.log('Boardcast Success', broadcastTx);
  return broadcastTx;
}



export async function support({
  aptos_wallet,
  artist_address,
  amount,
}: any) {
  try {
    const transaction = {
      arguments: [artist_address, amount],
      function: `0x01::aptos_account::transfer`,
      type: 'entry_function_payload',
      type_arguments: [],
    };
    const SupportTx = await aptos_wallet.signAndSubmitTransaction(transaction);
    console.log('Support Success', SupportTx);
  } catch (e) {
    console.log("Error Supporting", e)
  }
}


// ---------------------------------------- PURCHASE
export async function getPurchaseDetails({ seller_wallet_address }: any) {
  try {
    const monitize_details = await provider.getAccountResource(
      seller_wallet_address,
      `${MODULE_ADDRESS}::OnChainRadio::Monitize_collection`
    );
    const signature_details = await provider.getAccountResource(
      seller_wallet_address,
      `${MODULE_ADDRESS}::OnChainRadio::SignatureDetails`
    );
    return {
      monitize_details,
      signature_details,
    }
  } catch (e) {
    console.log("Error Getting Purchasing Details", e)
  }
}

export async function purchase({ aptos_wallet, song_ipfs, owner_artist_address, }: any) {
  try {
    const transaction = {
      arguments: ['"0xeafb8d273e5fcc289f803742063dbf1c34df1633aa0429fc2fc04c624a45194b"', "0xeafb8d273e5fcc289f803742063dbf1c34df1633aa0429fc2fc04c624a45194b", owner_artist_address, "0x01"],
      function: `${MODULE_ADDRESS}::OnChainRadio::Purchase`,
      type: 'entry_function_payload',
      type_arguments: [],
    };
    const Tx = await aptos_wallet.signAndSubmitTransaction(transaction);
    console.log('Purchase Success', Tx);
    return Tx
    return true;
  } catch (e) {
    console.log("Error Purchasing", e)
  }

}