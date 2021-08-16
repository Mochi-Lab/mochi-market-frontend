import { Card, Row, Col, Skeleton, Popover, Empty } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import tick from 'Assets/icons/tick-green.svg';
import '../NFTsCardBrowse/index.scss';
import 'Assets/css/common-card-nft.scss';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { handleChildClick, objToString } from 'utils/helper';
import moment from 'moment';
import empty from 'Assets/icons/empty.svg';
import LoadingScroll from 'Components/LoadingScroll';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import { getDetailNFT } from 'APIs/NFT/Get';
import { isArray } from 'lodash';

function NFTsCardProfile({ token, onSale }) {
  const { chainId, verifiedContracts } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  const fetchDetail = useCallback(async () => {
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
  }, [chainId, token]);

  useEffect(() => {
    if (!detailNFT) {
      fetchDetail();
    }
  }, [fetchDetail, detailNFT]);

  const visible = !!detailNFT && !!detailNFT.name && !!token;

  return detailNFT !== null ? (
    <>
      {!visible ? null : (
        <Col
          className='gutter-row'
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          {!!detailNFT ? (
            <Link
              to={`/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${
                !!token.sellId ? token.sellId : null
              }`}
            >
              <Card
                hoverable
                cover={
                  <div className='wrap-cover'>
                    <div
                      className='blurred-background'
                      style={{ backgroundImage: `url(${!!token.thumb ? token.thumb : detailNFT.image})` }}
                    />
                    <div className='NFTResource-Wrapper'>
                      <img
                        alt={`img-nft-${!!token.thumb ? token.thumb : detailNFT.image}`}
                        src={!!token.thumb ? token.thumb : detailNFT.image}
                        className='display-resource-nft'
                      />
                    </div>
                  </div>
                }
                className='card-nft'
              >
                {!!token.attributes && token.attributes.length > 0 ? (
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
                ) : (
                  <></>
                )}
                {!!token.price ? (
                  <div className='price-nft textmode'>
                    <span>{token.price}</span> <b>{getSymbol(chainId)[token.token]}</b>
                  </div>
                ) : (
                  <></>
                )}
                <Row justify='space-between'>
                  <Col className={`footer-card-left ${!token.is1155 ? 'fill-width' : ''}`}>
                    <div className='name-collection'>
                      <Link
                        to={`/collection/${chainId}/${token.collectionAddress}`}
                        className='link-collection-name'
                        tag='span'
                      >
                        {!!detailNFT.nameCollection
                          ? detailNFT.nameCollection
                          : token.nameCollection}
                      </Link>
                      {verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) ? (
                        <img src={tick} alt='icon-tick' className='icon-tick' />
                      ) : null}{' '}
                    </div>
                    <div className='name-nft textmode'>
                      {!!token.name ? token.name : detailNFT.name}
                    </div>
                  </Col>
                  {!!token.is1155 && !onSale ? (
                    <Col className='footer-card-right text-right price-nft'>
                      <div className='title-price'>Available</div>
                      <div className=''>
                        {!!token.soldAmount
                          ? parseInt(token.value) - parseInt(token.soldAmount)
                          : token.value}{' '}
                        <span className=''>of</span> {token.totalSupply}{' '}
                      </div>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
              </Card>
            </Link>
          ) : (
            <Skeleton active round title='123' />
          )}
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

export default function ERC721({ tokens, onSale, loadingScroll, fetchExplore, isEndOfOrderList }) {
  const [afterFilter, setafterFilter] = useState(!!tokens ? tokens : []);

  const [loadingNFTs, setLoadingNFTs] = useStateWithCallbackLazy(false);

  useEffect(() => {
    if (tokens) setafterFilter(() => tokens);
  }, [tokens]);

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
      <Row justify={afterFilter.length > 0 ? 'start' : 'center'} gutter={[20, 20]}>
        <BottomScrollListener onBottom={() => paginationCards()}>
          {afterFilter.length > 0 ? (
            afterFilter.map((token, index) => (
              <NFTsCardProfile key={index} token={token} onSale={onSale} />
            ))
          ) : (
            <Empty
              image={empty}
              imageStyle={{
                height: 86,
                width: 86,
              }}
              description={<span className='textmode'>No Data</span>}
            ></Empty>
          )}
        </BottomScrollListener>
      </Row>
      {!!loadingScroll && <LoadingScroll />}
    </div>
  );
}
