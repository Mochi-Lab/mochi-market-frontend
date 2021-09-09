import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconLoading from 'Components/IconLoading';
import Footer from 'Components/Footer';
import EditCollection from './EditCollection';
import ViewLess from './ViewLess';
import ViewAll from './ViewAll';
import DisplayInfoCollection from './DisplayInfoCollection';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { newMintOf721, newMintOf1155 } from 'utils/helper';
import { selectChain } from 'Connections/web3Modal.js';
import { unpinFooterOnLoad } from 'utils/helper.js';
import { getSellOrderByAttributes, getSellOrderByCollection } from 'APIs/SellOrder/Gets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'Views/Home/index.scss';
import './index.scss';
import 'Views/Profile/index.scss';
import 'Assets/css/common-card-nft.scss';
import {isEmpty} from "lodash";

export default function Collection() {
  let history = useHistory();

  const { chainId, walletAddress, verifiedContracts, nftList, infoAdmins } = useSelector(
    (state) => state
  );

  const { chainID, addressToken } = useParams();
  const statusViewAll = new URLSearchParams(useLocation().search).get('ViewAll');

  const [visibleEitdCollection, setvisibleEitdCollection] = useState(false);
  const [infoCollection, setInfoCollection] = useState();
  const [statusEdit, setStatusEdit] = useState(false);
  const [nftsOnSale, setNftsOnSale] = useState();
  const [viewAll, setViewAll] = useState(null);
  const [loadingNFTs, setLoadingNFTs] = useState();
  const [refreshingNFTs, setRefreshingNFTs] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState();
  const [listNewNFT, setListNewNFT] = useState([]);
  const [objectFilter, setObjectFilter] = useState({});
  const [activeKeysCollapse, setActiveKeysCollapse] = useState([]);
  const [skip, setSkip] = useState(0);
  const [lastLoadedSkip, setLastLoadedSkip] = useState(0);
  const [isEndOfOrderList, setIsEndOfOrderList] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('');
  const [strSearch, setStrSearch] = useState('');

  // Check chainId in route
  useEffect(() => {
    if (parseInt(chainId) !== parseInt(chainID)) selectChain(chainID, walletAddress);
  }, [walletAddress, chainId, chainID]);

  const getInfoCollection = useCallback(async () => {
    if (!!chainId) {
      let tokenAddress = addressToken.toLowerCase();
      let res = await store.dispatch(getCollection(tokenAddress));
      if (infoCollection !== res.collection) {
        setInfoCollection(res.collection);
      }
      return res;
    }
    return null;
  }, [addressToken, chainId, infoCollection]);

  useEffect(() => {
    async function loadInfor() {
      setLoadingInfo(true);
      let res = await getInfoCollection();
      if (!!res) {
        setLoadingInfo(false);
      }
    }
    loadInfor();
  }, [getInfoCollection, addressToken, chainId, walletAddress]);

  const checkRegister = useCallback(async () => {
    let result = false;
    if (
      !!walletAddress &&
      ((!!infoCollection &&
        !!infoCollection.addressSubmit &&
        infoCollection.addressSubmit.toLocaleLowerCase() === walletAddress.toLowerCase()) ||
        infoAdmins.hasOwnProperty(walletAddress.toString().toLowerCase()))
    ) {
      result = true;
    }
    setStatusEdit(result);
  }, [infoCollection, walletAddress, infoAdmins]);

  useEffect(() => {
    checkRegister();
  }, [checkRegister]);

  const fetchExplore = useCallback(async () => {
    try {
      if(!!skip && lastLoadedSkip === skip) return;
      setLastLoadedSkip(skip);

      if (skip > 1) {
        setLoadingScroll(true);
      }

      let exp = !isEmpty(objectFilter) || !isEmpty(strSearch) || tokenPayment !== '0' || typeSort !== '' ? await getSellOrderByAttributes(
        chainID,
        addressToken,
        objectFilter,
        strSearch,
        tokenPayment,
        typeSort,
        skip,
        20
      ) : await getSellOrderByCollection(chainID, addressToken, skip, 20);
      setSkip(skip + 20);

      await setNftsOnSale((nftsOnSale) => (!!nftsOnSale ? [...nftsOnSale, ...exp] : [...exp]));
      setIsEndOfOrderList(exp.length < 20);
      setLoadingScroll(false);
    } catch (error) {
      console.log({ error });
    }
  }, [chainID, addressToken, skip, lastLoadedSkip, objectFilter, strSearch, tokenPayment, typeSort, setNftsOnSale]);

  useEffect(() => {
    async function loadInitNFTs() {
      setLoadingNFTs(true);
      await fetchExplore();
      setLoadingNFTs(false);
    }
    if (chainID && !loadingNFTs && !nftsOnSale) {
      loadInitNFTs();
    }
  }, [chainID, fetchExplore, nftsOnSale, loadingNFTs]);

  const filterChange = useCallback(async () => {
    try {
      setRefreshingNFTs(true);
      let exp = !isEmpty(objectFilter) || !isEmpty(strSearch) || tokenPayment !== '0' || typeSort !== '' ? await getSellOrderByAttributes(
        chainID,
        addressToken,
        objectFilter,
        strSearch,
        tokenPayment,
        typeSort,
        0,
        20
      ) : await getSellOrderByCollection(chainID, addressToken, 0, 20);
      setLastLoadedSkip(0);
      setSkip(20);
      setRefreshingNFTs(false);
      setNftsOnSale(exp);
    } catch (error) {
      console.log({ error });
    }
  }, [chainID, addressToken, objectFilter, strSearch, tokenPayment, typeSort]);

  const newMintNFT = useCallback(async () => {
    if (nftList) {
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      let result;
      if (is1155) {
        result = await newMintOf1155(addressToken, chainID);
      } else {
        result = await newMintOf721(addressToken, chainID);
      }
      setListNewNFT(result);
    }
  }, [addressToken, chainID, nftList]);

  useEffect(() => {
    newMintNFT();
  }, [newMintNFT]);

  const handleSetViewAll = useCallback(
    async (status) => {
      setViewAll(status);
      if (!status) {
        history.push({
          search: '?ViewAll=false',
        });
      } else {
        history.push({
          search: '?ViewAll=true',
        });
      }
    },
    [history]
  );

  useEffect(() => {
    if (statusViewAll === 'false') {
      handleSetViewAll(false);
    } else {
      handleSetViewAll(true);
    }
  }, [statusViewAll, handleSetViewAll]);
  useEffect(() => {
    return unpinFooterOnLoad(!!loadingInfo || !infoCollection || !listNewNFT);
  }, [loadingNFTs, loadingInfo, nftsOnSale, infoCollection, listNewNFT]);

  return (
    <>
      {!!loadingInfo || !infoCollection || !listNewNFT ? (
        // Loading if done load the first type of token user have, if user select other load other
        <div className='center' style={{ width: '100%', height: '100%' }}>
          <IconLoading className='search-icon' />
        </div>
      ) : (
        <div className='collection-detail'>
          <EditCollection
            visible={visibleEitdCollection}
            setvisibleEitdCollection={setvisibleEitdCollection}
            infoCollection={infoCollection}
            getInfoCollection={getInfoCollection}
            addressToken={addressToken}
            chainId={chainId}
          />
          <div className='container'>
            <DisplayInfoCollection
              infoCollection={infoCollection}
              statusEdit={statusEdit}
              setvisibleEitdCollection={setvisibleEitdCollection}
              verifiedContracts={verifiedContracts}
              addressToken={addressToken}
            />
            <ViewLess
              infoCollection={infoCollection}
              nftsOnSale={!!nftsOnSale ? nftsOnSale.slice(0, 10) : []}
              listNewNFT={listNewNFT}
              setViewAll={handleSetViewAll}
              viewAll={viewAll}
              loadingNFTs={loadingNFTs}
            />

            {viewAll !== null ? (
              <ViewAll
                infoCollection={infoCollection}
                nftsOnSale={!!nftsOnSale ? nftsOnSale : []}
                setViewAll={handleSetViewAll}
                viewAll={viewAll}
                loadingNFTs={loadingNFTs}
                refreshingNFTs={refreshingNFTs}
                setObjectFilter={setObjectFilter}
                objectFilter={objectFilter}
                activeKeysCollapse={activeKeysCollapse}
                setActiveKeysCollapse={setActiveKeysCollapse}
                getInfoCollection={getInfoCollection}
                fetchExplore={fetchExplore}
                isEndOfOrderList={isEndOfOrderList}
                loadingScroll={loadingScroll}
                filterChange={filterChange}
                setNftsOnSale={setNftsOnSale}
                setSkip={setSkip}
                tokenPayment={tokenPayment}
                setTokenPayment={setTokenPayment}
                typeSort={typeSort}
                setTypeSort={setTypeSort}
                strSearch={strSearch}
                setStrSearch={setStrSearch}
              />
            ) : null}
          </div>

          <Footer />
        </div>
      )}
    </>
  );
}
