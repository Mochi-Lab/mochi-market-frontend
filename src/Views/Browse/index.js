import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import NFTsFilterBrowse from 'Components/NFTsFilterBrowse';
import BannerSearchHome from 'Components/BannerSearchHome';
import { carouselBanner } from 'Constants/constantCarousel';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getCollection } from 'store/actions';
import store from 'store/index';
import Footer from 'Components/Footer';
import { unpinFooterOnLoad } from 'utils/helper.js';
import { getCollectionBySearchAndPayment, getAllBySearchAndPayment } from 'APIs/SellOrder/Gets';
import { getAllCollections } from 'APIs/Collections/Gets';

export default function Browse() {
  const { chainId, verifiedContracts, strSearch } = useSelector((state) => state);

  const addressToken = new URLSearchParams(useLocation().search).get('addressToken');

  const [nftsOnSale, setNftsOnSale] = useState();
  const [skip, setSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [loadingNFTs, setLoadingNFTs] = useState();
  const [listCollections, setListCollections] = useState();
  const [selectedToken, setSelectedToken] = useState();
  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('');

  const inputSearch = useRef(null);
  useEffect(() => {
    if (!!inputSearch) {
      inputSearch.current.focus();
    }
  }, []);

  const fetchExplore = useCallback(async () => {
    if (!!chainId) {
      try {
        if (skip > 1) {
          setLoadingScroll(true);
        }
        let exp;
        if (!!selectedToken) {
          exp = await getCollectionBySearchAndPayment(
            chainId,
            selectedToken,
            strSearch,
            tokenPayment,
            typeSort,
            skip,
            20
          );
        } else {
          exp = await getAllBySearchAndPayment(
            chainId,
            strSearch,
            tokenPayment,
            typeSort,
            skip,
            20
          );
        }

        setSkip(skip + 20);
        setNftsOnSale((nftsOnSale) => (!!nftsOnSale ? [...nftsOnSale, ...exp] : [...exp]));
        if (exp.length < 20) setIsEndOfOrderList(true);
        setLoadingScroll(false);
      } catch (error) {
        console.log({ error });
      }
    }
  }, [chainId, skip, selectedToken, strSearch, tokenPayment, typeSort]);

  useEffect(() => {
    async function loadingInit() {
      setLoadingNFTs(true);
      await fetchExplore();
      setLoadingNFTs(false);
    }
    if (!nftsOnSale) {
      loadingInit();
    }
  }, [fetchExplore, nftsOnSale, chainId, selectedToken]);

  const loadAllCollections = useCallback(async () => {
    if (!!chainId) {
      try {
        let collections = await getAllCollections(chainId);
        let listCollections = await Promise.all(
          collections.map(async (c) => {
            if (verifiedContracts.includes(c.address.toLocaleLowerCase())) {
              let collection = (await store.dispatch(getCollection(c.address, null))).collection;
              return collection;
            }
          })
        );
        setListCollections(listCollections.filter((c) => !!c));
      } catch (error) {
        console.log({ error });
      }
    }
  }, [chainId, verifiedContracts]);

  useEffect(() => {
    loadAllCollections();
  }, [loadAllCollections]);

  useEffect(() => {
    return unpinFooterOnLoad(loadingNFTs || loadingNFTs === null);
  }, [loadingNFTs]);
  return (
    <>
      <BannerSearchHome
        carouselBanner={carouselBanner}
        inputSearch={inputSearch}
        setSkip={setSkip}
        setNftsOnSale={setNftsOnSale}
      />
      <div className='container' style={{ width: '100%', height: '100%' }}>
        <NFTsFilterBrowse
          collectionsNFT={nftsOnSale}
          isLoadingErc721={loadingNFTs}
          addressToken={addressToken}
          isEndOfOrderList={isEndOfOrderList}
          loadingScroll={loadingScroll}
          fetchExplore={fetchExplore}
          listCollections={listCollections}
          setSelectedToken={setSelectedToken}
          setSkip={setSkip}
          setNftsOnSale={setNftsOnSale}
          tokenPayment={tokenPayment}
          setTokenPayment={setTokenPayment}
          typeSort={typeSort}
          setTypeSort={setTypeSort}
        />
      </div>
      <Footer />
    </>
  );
}
