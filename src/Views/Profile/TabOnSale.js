import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsProfile from 'Components/NFTsProfile';
import { setAvailableSellOrder } from 'store/actions';
import store from 'store/index';

export default function TabOnSale({ address }) {
  const { listNFTsOnsale, isLoadingErc721, erc721Instances } = useSelector((state) => state);

  const [loadingGetOnSale, setloadingGetOnSale] = useState(false);

  const fetchOnSale = useCallback(async () => {
    setloadingGetOnSale(true);
    await store.dispatch(setAvailableSellOrder(address));
    setloadingGetOnSale(false);
  }, [address]);

  useEffect(() => {
    if (!!erc721Instances && !!address) {
      fetchOnSale();
    }
  }, [fetchOnSale, address, erc721Instances]);

  return (
    <NFTsProfile
      listNFTs={listNFTsOnsale}
      isLoadingErc721={isLoadingErc721 || loadingGetOnSale}
      onSale={true}
    />
  );
}
