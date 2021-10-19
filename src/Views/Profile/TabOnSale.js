import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsProfile from 'Components/NFTsProfile';
import { getSellOrderByUser } from 'APIs/SellOrder/Gets';

export default function TabOnSale({ address }) {
  const { chainId } = useSelector((state) => state);

  const [loadingGetOnSale, setloadingGetOnSale] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [nftsOnSale, setNftsOnSale] = useState();
  const [skip, setSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);

  const fetchOnSale = useCallback(async () => {
    if (!!chainId) {
      try {
        if (skip > 1) {
          setLoadingScroll(true);
        }
        let exp = await getSellOrderByUser(chainId, address, skip, 20);
        console.log(nftsOnSale, exp, 'ownmer');
        setSkip(skip + 20);
        setNftsOnSale((nftsOnSale) => (!!nftsOnSale ? [...nftsOnSale, ...exp] : [...exp]));
        if (exp.length < 20) setIsEndOfOrderList(true);
        setLoadingScroll(false);
      } catch (error) {
        console.log({ error });
      }
    }
  }, [address, skip, chainId]);

  useEffect(() => {
    async function loadingInit() {
      setloadingGetOnSale(true);
      await fetchOnSale();
      setloadingGetOnSale(false);
    }
    console.log(nftsOnSale, chainId, address);
    if (!nftsOnSale) {
      loadingInit();
    }
  }, [fetchOnSale, nftsOnSale, chainId, address]);

  return (
    <NFTsProfile
      listNFTs={nftsOnSale}
      isLoadingErc721={loadingGetOnSale}
      onSale={true}
      loadingScroll={loadingScroll}
      fetchExplore={fetchOnSale}
      isEndOfOrderList={isEndOfOrderList}
      loadingNFT={loadingGetOnSale}
    />
  );
}
