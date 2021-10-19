import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsProfile from 'Components/NFTsProfile';
import { getNFTsOfOwner } from 'store/actions';
import { getDetailNFT, getListNFTsOwner } from 'APIs/NFT/Get';
import store from 'store/index';

export default function TabOwner({ address }) {
  const { chainId } = useSelector((state) => state);

  const [loadingGetOwner, setloadingGetOwner] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [nftsOwner, setNftsOwner] = useState();
  const [skip, setSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);
  const fetchOwner = useCallback(async () => {
    if (!!chainId) {
      try {
        if (skip > 1) {
          setLoadingScroll(true);
        }
        let listRaw721 = await getListNFTsOwner(address, skip, 20);
        let exp = await Promise.all(
          listRaw721.map(async (e) => {
            let nft = await getDetailNFT(chainId, e.Address, e.TokenID);
            if (!nft.name || nft.name === 'Unnamed') nft.name = 'ID: ' + e.TokenID;
            nft['is1155'] = false;
            return nft;
          })
        );
        // console.log(nftsOwner, exp, 'ownmer');
        setSkip(skip + 20);
        setNftsOwner((nftsOwner) => (!!nftsOwner ? [...nftsOwner, ...exp] : [...exp]));
        if (exp.length < 20) setIsEndOfOrderList(true);
        setLoadingScroll(false);
      } catch (error) {
        console.log({ error });
      }
    }

    //   setloadingGetOwner(true);
    //   await store.dispatch(getNFTsOfOwner(address));
    //   setloadingGetOwner(false);
  }, [address, skip, chainId]);

  // useEffect(() => {
  //   if (!!chainId && !!address) {
  //     fetchOwner();
  //   }
  // }, [fetchOwner, address, chainId, walletAddress]);

  useEffect(() => {
    async function loadingInit() {
      setloadingGetOwner(true);
      await fetchOwner();
      setloadingGetOwner(false);
    }
    console.log(nftsOwner, chainId, address);
    if (!nftsOwner) {
      loadingInit();
    }
  }, [fetchOwner, nftsOwner, chainId, address]);

  return (
    <NFTsProfile
      listNFTs={nftsOwner}
      isLoadingErc721={loadingGetOwner}
      loadingScroll={loadingScroll}
      fetchExplore={fetchOwner}
      isEndOfOrderList={isEndOfOrderList}
      onSale={false}
      loadingNFT={loadingGetOwner}
    />
  );
}
