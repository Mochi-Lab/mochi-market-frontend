import { Card, Row, Col, Popover } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import { getCollection } from 'store/actions';
import store from 'store/index';
import moment from 'moment';
import tick from 'Assets/icons/tick-green.svg';
import './index.scss';
import 'Assets/css/common-card-nft.scss';
import { handleChildClick, objToString } from 'utils/helper';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import LoadingScroll from 'Components/LoadingScroll';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { getDetailNFT } from 'APIs/NFT/Get';
import { isArray } from 'lodash';

function NFTsCard({ token, collectionName }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);
  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let nft = await getDetailNFT(chainId, token.collectionAddress, token.tokenId);
          if (!nft.name || nft.name === 'Unnamed') nft.name = 'ID: ' + token.tokenId;
          token.nameCollection = (
            await store.dispatch(getCollection(token.collectionAddress, null))
          ).collection.name;
          setDetailNFT(nft);
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
        }
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    if (!detailNFT) {
      fetchDetail();
    }
  }, [token, chainId, detailNFT]);

  const visible = !!detailNFT && !!detailNFT.name && !!token;

  return detailNFT !== null ? (
    <>
      {!visible ? null : (
        <Col
          className='gutter-row'
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 6 }}
          xxl={{ span: 6 }}
        >
          <Link
            to={`/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${token.sellId}`}
            target='_blank'
          >
            <Card
              hoverable
              cover={
                <div className='wrap-cover'>
                  <div
                    className='blurred-background'
                    style={{
                      backgroundImage: `url(${!!token.image ? token.image : detailNFT.image})`,
                    }}
                  />
                  <div className='NFTResource-Wrapper'>
                    <img
                      alt={`img-nft-${token.tokenId}`}
                      src={!!token.image ? token.image : detailNFT.image}
                      className='display-resource-nft'
                    />
                  </div>
                </div>
              }
              className='card-nft'
            >
              {!!token.attributes && token.attributes.length > 0 && (
                <Popover
                  onClick={handleChildClick}
                  placement='bottomLeft'
                  content={token.attributes.map((attr, i) => (
                    <div key={i} onClick={handleChildClick}>
                      <strong>{attr.trait_type}</strong>:{' '}
                      {isArray(attr.value)
                        ? attr.value.join(', ')
                        : !!attr.display_type &&
                          attr.display_type.toLowerCase() === 'date' &&
                          !!moment(attr.value).isValid()
                        ? moment(
                            attr.value.toString().length < 13 ? attr.value * 1000 : attr.value
                          ).format('DD-MM-YYYY')
                        : typeof attr.value === 'object'
                        ? objToString(attr.value)
                        : attr.value}
                    </div>
                  ))}
                >
                  <div className='attribs-nft' onClick={handleChildClick}>
                    Stats
                  </div>
                </Popover>
              )}
              {!!token.price && (
                <div className='price-nft textmode'>
                  <span>{token.price}</span> <b>{getSymbol(chainId)[token.token]}</b>
                </div>
              )}
              <Row justify='space-between'>
                <Col className='footer-card-left'>
                  <div className='name-collection'>
                    <Link
                      to={`/collection/${chainId}/${token.collectionAddress}`}
                      className='link-collection-name'
                      tag='span'
                    >
                      {!!collectionName ? collectionName : token.nameCollection}
                    </Link>
                    {verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) && (
                      <img src={tick} alt='icon-tick' className='icon-tick' />
                    )}{' '}
                  </div>
                  <div className='name-nft textmode'>
                    {!!token.name ? token.name : detailNFT.name}
                  </div>
                </Col>
              </Row>
            </Card>
          </Link>
        </Col>
      )}
    </>
  ) : (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 8 }}
      xl={{ span: 6 }}
      xxl={{ span: 6 }}
    >
      <Card
        className='card-nft card-nft-content-loader'
        cover={
          <div className='wrap-cover'>
            <div className='NFTResource-Wrapper'>
              <img
                className='display-resource-nft'
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                alt=''
              />
            </div>
          </div>
        }
      >
        <Row justify='space-between'>
          <Col className='footer-card-left'>
            <div className='name-collection'>&nbsp;</div>
            <div className='name-nft'>&nbsp;</div>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default function NFTsCardBrowse({
  tokens,
  strSearchInCollection,
  fetchExplore,
  isEndOfOrderList,
  loadingScroll,
  collectionName,
}) {
  const [loadingNFTs, setLoadingNFTs] = useStateWithCallbackLazy(false);
  const paginationCards = useCallback(
    async (e) => {
      if (!!tokens && tokens.length > 0 && !!fetchExplore && !isEndOfOrderList && !loadingNFTs) {
        setLoadingNFTs(true, async () => {
          setLoadingNFTs(true);
          if (!loadingNFTs) fetchExplore();
          setLoadingNFTs(false);
        });
      }
    },
    [fetchExplore, isEndOfOrderList, loadingNFTs, tokens, setLoadingNFTs]
  );

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[15, 20]} id='row-cards'>
        <BottomScrollListener onBottom={() => paginationCards()}>
          {!!tokens &&
            tokens.map((token) => (
              <NFTsCard
                key={token.sellId}
                token={token}
                strSearch={strSearchInCollection}
                collectionName={collectionName}
              />
            ))}
        </BottomScrollListener>
      </Row>
      {!!loadingScroll && <LoadingScroll />}
    </div>
  );
}
