import { Card, Row, Col, Skeleton } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import { getCollection } from 'store/actions';
import useLoadImage from 'hooks/useLoadImage';
import store from 'store/index';

import tick from 'Assets/icons/tick-green.svg';
import mochi from 'Assets/icons/mochi.png';
import './index.scss';
import 'Assets/css/common-card-nft.scss';

function NFTsCard({ token, strSearch }) {
  const { web3, chainId, verifiedContracts, infoCollections } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);
  const [src, { blur }] = useLoadImage(mochi, detailNFT);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          if (token.is1155) {
            const nft = new web3.eth.Contract(sampleAbiERC1155.abi, token.addressToken);
            tokenURI = await nft.methods.uri(token.index).call();
          } else {
            const nft = new web3.eth.Contract(abiERC721.abi, token.addressToken);
            tokenURI = await nft.methods.tokenURI(token.index).call();
          }
          let req = await axios.get(tokenURI);
          const data = req.data;
          setDetailNFT({
            name: !!data.name ? data.name : 'Unnamed',
            description: !!data.description ? data.description : '',
            image: !!data.image ? data.image : imgNotFound,
          });
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
        }
        token.nameCollection = (
          await store.dispatch(getCollection(token.addressToken, null))
        ).collection.name;
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token, web3, chainId, infoCollections]);

  return !!detailNFT &&
    !!detailNFT.name &&
    (detailNFT.name.toLocaleLowerCase().includes(strSearch.toLowerCase()) ||
      token.nameCollection.toLocaleLowerCase().includes(strSearch.toLowerCase())) ? (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 8 }}
      xl={{ span: 6 }}
      xxl={{ span: 6 }}
    >
      {!!detailNFT ? (
        <Link to={`/token/${token.addressToken}/${token.index}/${token.sellId}`}>
          <Card
            hoverable
            cover={
              <div className='wrap-cover'>
                <div className='blurred-background' style={{ backgroundImage: `url(${src})` }} />
                <div className='NFTResource-Wrapper'>
                  {/* <img alt={`img-nft-${token.index}`} src={src} className='display-resource-nft' /> */}
                  <img
                    src={src}
                    alt={`img-nft-${token.index}`}
                    className='display-resource-nft'
                    style={{
                      filter: blur ? 'blur(20px)' : 'none',
                      transition: blur ? 'none' : 'filter 0.3s ease-out',
                    }}
                  />
                </div>
              </div>
            }
            className='card-nft'
          >
            {!!token.price ? (
              <div className='price-nft textmode'>
                <span>{web3.utils.fromWei(token.price, 'ether')}</span>{' '}
                <b>{getSymbol(chainId)[token.tokenPayment]}</b>
              </div>
            ) : (
              <></>
            )}
            <Row justify='space-between'>
              <Col className='footer-card-left'>
                <div className='name-collection'>
                  {verifiedContracts.includes(token.addressToken.toLocaleLowerCase()) ? (
                    <img src={tick} alt='icon-tick' className='icon-tick' />
                  ) : null}{' '}
                  <Link
                    to={`/collection/${token.addressToken}`}
                    className='link-collection-name'
                    tag='span'
                  >
                    {token.nameCollection}
                  </Link>
                </div>
                <div className='name-nft textmode'>{detailNFT.name}</div>
              </Col>
            </Row>
          </Card>
        </Link>
      ) : (
        <Skeleton active round title='123' />
      )}
    </Col>
  ) : null;
}

export default function NFTsCardBrowse({ tokens, tokenPayment, typeSort, filterCountCallback }) {
  const [afterFilter, setAfterFilter] = useState(!!tokens ? tokens : []);
  const { strSearch, web3 } = useSelector((state) => state);
  useEffect(() => {
    filterCountCallback(afterFilter.length);
  }, [afterFilter.length, filterCountCallback]);

  const sortOrders = useCallback(async () => {
    var BN = web3.utils.BN;
    let filterByTokenPayment =
      tokenPayment === '0' ? tokens : tokens.filter((order) => order.tokenPayment === tokenPayment);
    switch (typeSort) {
      case 'recentlyListed':
        setAfterFilter(filterByTokenPayment);
        break;
      case 'latestCreated':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            a.sortIndex < b.sortIndex ? 1 : a.sortIndex > b.sortIndex ? -1 : 0
          )
        );
        break;
      case 'priceAsc':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            !new BN(a.price).gt(new BN(b.price)) ? 1 : new BN(a.price).gt(new BN(b.price)) ? -1 : 0
          )
        );
        break;
      case 'priceDesc':
        setAfterFilter(
          filterByTokenPayment.sort((a, b) =>
            new BN(a.price).gt(new BN(b.price)) ? 1 : !new BN(a.price).gt(new BN(b.price)) ? -1 : 0
          )
        );
        break;
      default:
        break;
    }
  }, [tokens, tokenPayment, typeSort, web3]);

  useEffect(() => {
    if (tokens) sortOrders();
  }, [tokens, sortOrders]);

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[15, 20]}>
        {!!afterFilter ? (
          afterFilter.map((token, index) => (
            <NFTsCard key={index} token={token} strSearch={strSearch} />
          ))
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
