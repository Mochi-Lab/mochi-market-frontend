import { useSelector } from 'react-redux';
import IconLoading from 'Components/IconLoading';
import Footer from 'Components/Footer';
import EditCollection from './EditCollection';
import ViewLess from './ViewLess';
import ViewAll from './ViewAll';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'Views/Home/index.scss';
import './index.scss';
import 'Views/Profile/index.scss';
import 'Assets/css/common-card-nft.scss';
import tick from 'Assets/icons/tick-green.svg';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { setInfoCollections, getCollection } from 'store/actions';
import store from 'store/index';
import { getLogoChainsTags } from 'utils/getContractAddress';
import { newMintOf721, newMintOf1155 } from 'utils/helper';
import logoMochi from 'Assets/logo-mochi.png';
import discord from 'Assets/icons/discord-01.svg';
import youtube from 'Assets/icons/youtube.svg';
import facebook from 'Assets/icons/facebook-01.svg';
import instagram from 'Assets/icons/instagram.svg';
import medium from 'Assets/icons/medium-01.svg';
import titok from 'Assets/icons/tiktok.svg';
import github from 'Assets/icons/github-01.svg';
import twitter from 'Assets/icons/twitter-01.svg';
import telegram from 'Assets/icons/telegram-01.svg';
import website from 'Assets/icons/website.svg';
import { selectChain } from 'Connections/web3Modal.js';

export default function Collection() {
  const {
    isLoadingErc721,
    chainId,
    walletAddress,
    verifiedContracts,
    infoCollections,
    nftList,
    convertErc1155Tokens,
    convertErc721Tokens,
  } = useSelector((state) => state);
  const { chainID, addressToken } = useParams();

  const [visibleEitdCollection, setvisibleEitdCollection] = useState(false);
  const [collections, setCollections] = useState(infoCollections);
  const [infoCollection, setInfoCollection] = useState({});
  const [statusEdit, setStatusEdit] = useState(false);
  const [nftsOnSale, setNftsOnSale] = useState([]);
  const [viewAll, setViewAll] = useState(null);
  const [loadingNFTs, setLoadingNFTs] = useState();
  const [listNewNFT, setListNewNFT] = useState([]);

  // Check chainId in route
  useEffect(() => {
    if (parseInt(chainId) !== parseInt(chainID)) selectChain(chainID, walletAddress);
  }, [walletAddress, chainId, chainID]);

  const getInfoCollection = useCallback(
    async (collection) => {
      let _collections;
      let tokenAddress = addressToken.toLowerCase();
      if (!!collection) {
        _collections = collections;
        _collections[tokenAddress] = collection;
        setInfoCollection(collection);
      } else {
        let res = await store.dispatch(getCollection(tokenAddress, collections));
        _collections = res.infoCollections;
        if (infoCollection !== res.collection) {
          setInfoCollection(res.collection);
        }
      }
      if (_collections[tokenAddress] !== collections[tokenAddress]) {
        setCollections(_collections);
        await store.dispatch(setInfoCollections(_collections));
      }
    },
    [addressToken, collections, infoCollection]
  );

  useEffect(() => {
    getInfoCollection();
  }, [getInfoCollection, addressToken, chainId, walletAddress]);

  const checkRegister = useCallback(async () => {
    let result = false;
    if (
      !!walletAddress &&
      !!infoCollection &&
      !!infoCollection.addressSubmit &&
      infoCollection.addressSubmit.toLocaleLowerCase() === walletAddress.toLowerCase()
    ) {
      result = true;
    }
    setStatusEdit(result);
  }, [infoCollection, walletAddress]);

  useEffect(() => {
    checkRegister();
  }, [checkRegister]);

  const filterCollectionInOnSale = useCallback(async () => {
    if (!!nftList) {
      setLoadingNFTs(true);
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      let onSaleOfAddressToken = [];
      if (is1155) {
        for (let i = 0; i < convertErc1155Tokens.length; i++) {
          const collection = convertErc1155Tokens[i];
          if (collection.addressToken.toLowerCase() === addressToken.toLowerCase()) {
            onSaleOfAddressToken = collection.tokens;
          }
        }
      } else {
        for (let i = 0; i < convertErc721Tokens.length; i++) {
          const collection = convertErc721Tokens[i];
          if (collection.addressToken.toLowerCase() === addressToken.toLowerCase()) {
            onSaleOfAddressToken = collection.tokens;
            break;
          }
        }
      }
      setNftsOnSale(onSaleOfAddressToken);
      setLoadingNFTs(false);
    }
  }, [addressToken, convertErc1155Tokens, convertErc721Tokens, nftList]);

  useEffect(() => {
    filterCollectionInOnSale();
  }, [filterCollectionInOnSale]);

  const collectionOnSaleLess = () => {
    setLoadingNFTs(true);
    let listNFT = nftsOnSale;
    listNFT = listNFT.sort((a, b) =>
      a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
    );
    setLoadingNFTs(false);
    return listNFT.slice(0, 10);
  };

  const collectionOnSaleAll = () => {
    setLoadingNFTs(true);
    let listNFT = nftsOnSale;
    listNFT = listNFT.sort((a, b) =>
      a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
    );
    setLoadingNFTs(false);
    return listNFT;
  };

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

  return (
    <div className='collection-detail'>
      <EditCollection
        visible={visibleEitdCollection}
        setvisibleEitdCollection={setvisibleEitdCollection}
        infoCollection={infoCollection}
        getInfoCollection={getInfoCollection}
        addressToken={addressToken}
        chainId={chainId}
      />
      {isLoadingErc721 || isLoadingErc721 === null ? (
        // Loading if done load the first type of token user have, if user select other load other
        <div className='center' style={{ width: '100%', height: '100%' }}>
          <IconLoading className='search-icon' />
        </div>
      ) : (
        <div className='container'>
          <div className='collection-info'>
            <div className='collection-info-content'>
              <div className='logo-grid'>
                <div className='logo-collection'>
                  <div className='wrap-img-logo'>
                    <img
                      src={!!infoCollection.logo ? infoCollection.logo : logoMochi}
                      alt='logo-collection'
                    />
                  </div>
                </div>
                {!!statusEdit ? (
                  <button
                    className='btn-edit-collection'
                    onClick={() => setvisibleEitdCollection(true)}
                  >
                    <div className='textmode'>Edit Collection</div>
                  </button>
                ) : (
                  ''
                )}
              </div>
              <div className='info-grid'>
                <div className='collection-name textmode'>
                  {infoCollection.name}
                  {verifiedContracts.includes(addressToken.toLocaleLowerCase()) ? (
                    <img src={tick} alt='icon-tick' className='icon-tick' />
                  ) : null}{' '}
                </div>
                <div className='list-tags textmode'>
                  {!!infoCollection.chainId ? (
                    <div className='item-tag'>
                      <img src={getLogoChainsTags(infoCollection.chainId).logo} alt='img-tag' />
                      <span className='textmode'>
                        {getLogoChainsTags(infoCollection.chainId).name}
                      </span>
                    </div>
                  ) : (
                    'Tags: '
                  )}
                </div>
                <div className='description-colletion textmode'>
                  {!!infoCollection.description ? infoCollection.description : 'Description:'}
                </div>
                <div className='statistics-colletion'></div>
                <div className='contact-colletion'>
                  {!!infoCollection.website ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.website}
                      className='link-contact'
                    >
                      <img src={website} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Website</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.twitter ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.twitter}
                      className='link-contact'
                    >
                      <img src={twitter} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Twitter</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.telegram ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.telegram}
                      className='link-contact'
                    >
                      <img src={telegram} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Telegram</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.discord ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.discord}
                      className='link-contact'
                    >
                      <img src={discord} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Discord</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.youtube ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.youtube}
                      className='link-contact'
                    >
                      <img src={youtube} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>YouTube</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.facebook ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.facebook}
                      className='link-contact'
                    >
                      <img src={facebook} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Facebook</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.instagram ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.instagram}
                      className='link-contact'
                    >
                      <img src={instagram} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Instagram</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.github ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.github}
                      className='link-contact'
                    >
                      <img src={github} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Github</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.medium ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.medium}
                      className='link-contact'
                    >
                      <img src={medium} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Medium</div>
                    </a>
                  ) : (
                    ''
                  )}
                  {!!infoCollection.titok ? (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={infoCollection.titok}
                      className='link-contact'
                    >
                      <img src={titok} alt='icon-link' className='icon-contact' />
                      <div className='name-contact textmode'>Titok</div>
                    </a>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className='contact-grid'></div>
            </div>
          </div>

          <ViewLess
            infoCollection={infoCollection}
            collectionOnSale={collectionOnSaleLess}
            listNewNFT={listNewNFT}
            setViewAll={setViewAll}
            viewAll={viewAll}
            loadingNFTs={loadingNFTs}
          />

          {viewAll !== null ? (
            <ViewAll
              infoCollection={infoCollection}
              collectionOnSale={collectionOnSaleAll}
              setViewAll={setViewAll}
              viewAll={viewAll}
              loadingNFTs={loadingNFTs}
            />
          ) : null}
        </div>
      )}
      <Footer />
    </div>
  );
}
