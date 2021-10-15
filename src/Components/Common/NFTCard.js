import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Popover } from 'antd';
import imgNotFound from 'Assets/notfound.png';
import { useHistory } from 'react-router-dom';
import { getSymbol } from 'utils/getContractAddress';
import moment from 'moment';
import tick from 'Assets/icons/tick-green.svg';
import { handleChildClick, objToString } from 'utils/helper';
import { isArray } from 'lodash';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import _, { nth } from 'lodash';

const __NFTCardLoader = () => {
  return (
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
  );
};

export const __NFTCardDetail = ({
  chainId,
  token,
  detailNFT,
  collectionName,
  verifiedContracts,
  cardOptions: { blurredBackground = true } = {},
}) => {
  const history = useHistory();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [usdtValue, setUsdtValue] = useState(0);
  const [customExtraInfo, setCustomExtraInfo] = useState('');
  const { coingeckoPrices } = useSelector((state) => state);

  const getCustomExtraInfoText = (token, nftDetail) => {
    const attributes = _.get(nftDetail, 'attributes');
    if (!attributes) return '';
    const extraInfoMapByToken = {
      '0xc33d69a337b796a9f0f7588169cd874c3987bde9': [
        {
          index: 13,
          name: 'Gen',
        },
      ],
      '0x0cb3eedae5e0eb6a3bae7bade59da1671019bb6e': [
        {
          index: 7,
          name: 'Lv',
        },
        {
          index: 3,
          name: '★',
        },
      ],
      '0x821304cb22ed418eee60d55100749ade15c2d0eb': [
        {
          index: 2,
          name: '★',
        },
      ],
    };
    const collectionAddress = _.get(token, 'collectionAddress');
    const extraInfoMap = _.get(extraInfoMapByToken, collectionAddress);
    if (!extraInfoMap) return '';
    return extraInfoMap
      .map(({ index, name }) => {
        const attr = nth(attributes, index);
        return attr ? `${name} ${attr.value}` : null;
      })
      .filter(Boolean)
      .join(' ');
  };

  useEffect(() => {
    const _customExtraInfo = getCustomExtraInfoText(token, detailNFT);
    if (_customExtraInfo !== customExtraInfo) setCustomExtraInfo(_customExtraInfo);
  }, [token, detailNFT]);

  useEffect(() => {
    if (!coingeckoPrices) return;
    const symbol = getSymbol(chainId)[token.token].toLowerCase();
    if (!coingeckoPrices[symbol] || !coingeckoPrices[symbol].usd) return;

    let value = coingeckoPrices[symbol].usd || 0;
    value = token.price * value;
    value = value.toFixed(2);
    setUsdtValue(value);
  }, [coingeckoPrices]);

  if (!getSymbol(chainId)) return <NFTCardLoader />;
  const collectionUrl = `/collection/${chainId}/${token.collectionAddress}`;
  const itemUrl = `/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${token.sellId}`;

  const onClick = (event) => {
    event.preventDefault();
    let eventTarget = event.target;
    history.push(eventTarget.matches('span.link-collection-name') ? collectionUrl : itemUrl);
  };

  const onImageLoad = () => {
    setImageLoaded(true);
  };

  const onImageError = (event) => {
    event.target.onerror = null;
    if (event.target.src === detailNFT.image || detailNFT.image === '') {
      event.target.src = imgNotFound;
      setImageLoaded(true);
    } else {
      event.target.src = detailNFT.image;
    }
  };

  return (
    <a href={itemUrl} onClick={onClick}>
      <Card
        hoverable
        cover={
          <div className='wrap-cover'>
            {blurredBackground && (
              <div
                className={`blurred-background test ${!imageLoaded ? 'opacity-0' : ''}`}
                style={{
                  backgroundImage: `url(${token.thumb !== 'none' ? token.thumb : detailNFT.image})`,
                }}
              />
            )}
            {!imageLoaded && (
              <div
                className='center'
                style={{ width: '100%', height: '100%', position: 'absolute' }}
              >
                <Spin />
              </div>
            )}
            <div className={`NFTResource-Wrapper ${!imageLoaded ? 'opacity-0' : ''}`}>
              <img
                alt={`img-nft-${token.tokenId}`}
                src={token.thumb !== 'none' ? token.thumb : detailNFT.image}
                className='display-resource-nft'
                onLoad={onImageLoad}
                onError={onImageError}
              />

              {customExtraInfo !== '' && (
                <div className='attribs-extra-info'>{customExtraInfo}</div>
              )}
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
            <span>{token.price}</span> <b>{getSymbol(chainId)[token.token]}</b> <br />
          </div>
        )}
        {!!token.price && !!usdtValue && (
          <div className='price-nft-usdt textmode'>
            <span>~${usdtValue}</span>
          </div>
        )}
        <Row justify='space-between'>
          <Col className='footer-card-left'>
            <div className='name-collection'>
              <span className='link-collection-name' tag='span'>
                {collectionName ||
                  token.nameCollection ||
                  token.collectionName ||
                  detailNFT.collectionName}
              </span>
              {verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) && (
                <img src={tick} alt='icon-tick' className='icon-tick' />
              )}
            </div>
            <div className='name-nft textmode'>{token.name || detailNFT.name}</div>
          </Col>
        </Row>
      </Card>
    </a>
  );
};

export const useDetailNFT = (chainId, token) => {
  const [detailNFT, setDetailNFT] = useState(null);
  useEffect(() => {
    async function fetchDetail() {
      if (!token) return setDetailNFT({ name: '', description: '', image: imgNotFound });
      try {
        if (!token.name || token.name === 'Unnamed') token.name = 'ID: ' + token.tokenId;

        // temporary fix for Kryptomon huge images
        if(token.collectionAddress === '0xc33d69a337b796a9f0f7588169cd874c3987bde9' && token.image && token.image.endsWith('.gif')) {
          token.image = token.image.replaceAll('gif', 'png');
        }

        setDetailNFT(token);
      } catch (error) {
        setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [chainId, token]);
  return detailNFT;
};

export const NFTCardLoader = React.memo(__NFTCardLoader);
export const NFTCardDetail = React.memo(__NFTCardDetail);
