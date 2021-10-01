import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsProfile from 'Components/NFTsProfile';
import { getNFTsOfOwner } from 'store/actions';
import store from 'store/index';

export default function TabOwner({ address }) {
  const { listNFTsOwner, chainId, walletAddress } = useSelector((state) => state);

  const [loadingGetOwner, setloadingGetOwner] = useState(false);

  const fetchOwner = useCallback(async () => {
    setloadingGetOwner(true);
    await store.dispatch(getNFTsOfOwner(address));
    setloadingGetOwner(false);
  }, [address]);

  useEffect(() => {
    if (!!chainId && !!address && !!walletAddress) {
      fetchOwner();
    }
  }, [fetchOwner, address, chainId, walletAddress]);

  return <NFTsProfile listNFTs={listNFTsOwner} isLoadingErc721={loadingGetOwner} onSale={false} />;
}
