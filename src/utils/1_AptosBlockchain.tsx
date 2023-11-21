'use client';
import { Provider, Network } from 'aptos';
import { MODULE_ADDRESS } from './3_Constants';

const provider = new Provider(Network.DEVNET);

export async function registerAudio({
  collectionType,
  songName,
  streamingTime,
  ipfsHash,
  aptos_wallet,
  wallet_address,
  artistName,
}: any) {
  const transaction_1 = {
    arguments: [collectionType, songName, streamingTime, ipfsHash],
    function: `${MODULE_ADDRESS}::OnChainRadio::create_collection`,
    type: 'entry_function_payload',
    type_arguments: [],
  };

  try {
    const ArtistWorkResource = await provider.getAccountResources(
      wallet_address,
      `${MODULE_ADDRESS}::OnChainRadio::Artist_work` as any
    );
    // console.log(ArtistWorkResource);

    if (!ArtistWorkResource) {
      const transaction_2 = {
        arguments: [artistName],
        function: `${MODULE_ADDRESS}::OnChainRadio::create_artist_work`,
        type: 'entry_function_payload',
        type_arguments: [],
      };
      const createResourceTransaction =
        await aptos_wallet.signAndSubmitTransaction(transaction_2);
    }
    const createCollectionTransaction =
      await aptos_wallet.signAndSubmitTransaction(transaction_1);
    console.log(createCollectionTransaction);
  } catch (error) {
    console.error('Error Registering Song', error);
  }
}

export const handleMonitizeSongToBlockchain = async ({
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
  const transaction = {
    arguments: [
      cid,
      true,
      noOfMaxCopies,
      noOfCopyReleased,
      priceOfCopy,
      true,
      royality,
      copyExpiryTimestamp,
    ],
    function: `${MODULE_ADDRESS}::OnChainRadio::Monitize_work`,
    type: 'entry_function_payload',
    type_arguments: [],
  };
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

    //   const pendingTransaction = await aptos_wallet.signAndSubmitTransaction(transaction);
    //   console.log(pendingTransaction);
    return signedMessage.signature;
  } catch (error) {
    console.log(error);
  }
};

export async function broadcastBlockchain({
  signature,
  doc_ipfs,
  song_ipfs,
  aptos_wallet,
}: any) {
  const transaction = {
    arguments: [song_ipfs, doc_ipfs, signature],
    function: `${MODULE_ADDRESS}::OnChainRadio::Broadcast`,
    type: 'entry_function_payload',
    type_arguments: [],
  };
  const broadcastTx = await aptos_wallet.signAndSubmitTransaction(transaction);
  console.log('Boardcast Success', broadcastTx);
}


export async function support({
  aptos_wallet,
  artist_address,
  song_ipfs,
  amount,
}: any) {
  const transaction = {
    arguments: [amount, song_ipfs, artist_address],
    function: `${MODULE_ADDRESS}::OnChainRadio::Donate`,
    type: 'entry_function_payload',
    type_arguments: [],
  };
  const SupportTx = await aptos_wallet.signAndSubmitTransaction(transaction);
  console.log('Support Success', SupportTx);
}