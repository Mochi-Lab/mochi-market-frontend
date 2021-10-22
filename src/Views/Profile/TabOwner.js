import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NFTsProfile from 'Components/NFTsProfile';
import {
  listTokensERC721OfOwner,
  listTokensERC115OfOwner,
  listTokensERC721OfOwnerEnums,
} from 'utils/helper';
import { getListNFTsOwner } from 'APIs/NFT/Get';

export default function TabOwner({ address }) {
  let { chainId, acceptedNftsAddress, walletAddress, web3, nftList } = useSelector(
    (state) => state
  );

  const [loadingGetOwner, setloadingGetOwner] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [nftsOwner, setNftsOwner] = useState();
  const [skip721, setSkip721] = useState(0);
  const [skip1155, setSkip1155] = useState(0);
  const [isEndOf721, setIsEndOf721] = useState(false);
  const [isEndOf1155, setIsEndOf1155] = useState(false);
  chainId = +chainId;
  const fetchOwner = useCallback(async () => {
    if (!chainId) return;
    if (chainId === 56) {
      //BSC mainnet
      if (!chainId || (isEndOf721 && isEndOf1155)) return;
      try {
        if (skip721 + skip1155 > 1) {
          setLoadingScroll(true);
        }
        if (!isEndOf721) {
          let exp721 = await getListNFTsOwner(chainId, address, skip721, 20, 'erc721');
          setNftsOwner((nftsOwner) => (!!nftsOwner ? [...nftsOwner, ...exp721] : [...exp721]));
          setSkip721((c) => c + 20);
          if (exp721.length < 20) setIsEndOf721(true);
        }

        if (!isEndOf1155) {
          let exp1155 = await getListNFTsOwner(chainId, address, skip1155, 20, 'erc1155');
          setNftsOwner((nftsOwner) => (!!nftsOwner ? [...nftsOwner, ...exp1155] : [...exp1155]));
          setSkip1155((c) => c + 20);
          if (exp1155.length < 20) setIsEndOf1155(true);
        }

        setLoadingScroll(false);
      } catch (error) {
        console.log({ error });
      }
    } else {
      setloadingGetOwner(true);
      let erc721Tokens;
      if (parseInt(chainId) === 1287) {
        //Moonriver
        erc721Tokens = await listTokensERC721OfOwnerEnums(
          acceptedNftsAddress,
          walletAddress,
          chainId,
          web3,
          nftList
        );
      } else {
        erc721Tokens = await listTokensERC721OfOwner(acceptedNftsAddress, walletAddress, chainId);
      }
      let erc1155Tokens = await listTokensERC115OfOwner(
        acceptedNftsAddress,
        walletAddress,
        chainId
      );
      setNftsOwner(erc721Tokens.concat(erc1155Tokens));
      setloadingGetOwner(false);
    }
  }, [address, skip721, skip1155, chainId, isEndOf721, isEndOf1155]);

  useEffect(() => {
    async function loadingInit() {
      setloadingGetOwner(true);
      await fetchOwner();
      setloadingGetOwner(false);
    }
    if (!nftsOwner) {
      loadingInit();
    }
  }, [fetchOwner, nftsOwner, chainId, address]);
  if (chainId === 56) {
    return (
      <NFTsProfile
        listNFTs={nftsOwner}
        isLoadingErc721={loadingGetOwner}
        loadingScroll={loadingScroll}
        fetchExplore={fetchOwner}
        isEndOfOrderList={isEndOf721 && isEndOf1155}
        onSale={false}
        loadingNFT={loadingGetOwner}
      />
    );
  } else {
    return <NFTsProfile listNFTs={nftsOwner} isLoadingErc721={loadingGetOwner} onSale={false} />;
  }
}
