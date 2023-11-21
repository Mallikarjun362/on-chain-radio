'use client'
import { useGlobalContext } from '../_context/store';
import { Provider, Network } from 'aptos';
import { MODULE_ADDRESS } from '@/utils/3_Constants';
import { useEffect } from 'react';

function ProfilePage() {
  const { wallet_address } = useGlobalContext();
  const getAccountDetails = async () => {
    const provider = new Provider(Network.DEVNET);
    try {
      const ArtistWorkResource = await provider.getAccountResource(
        wallet_address,
        `${MODULE_ADDRESS}::OnChainRadio::Artist_work`
      );
      console.log(ArtistWorkResource, 'profile');

      const client_resource = await provider.getAccountResource(
        wallet_address,
        `${MODULE_ADDRESS}::OnChainRadio::Client_resource`
      );
      console.log(ArtistWorkResource);
      console.log(client_resource);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(()=>{
    getAccountDetails();
  })

  return <div>Enter</div>;
}

export default ProfilePage;
