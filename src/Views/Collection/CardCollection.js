import { Card, Col, Popover, Row } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';
import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import tick from 'Assets/icons/tick-green.svg';
import 'Assets/css/common-card-nft.scss';
import { getCollection } from 'store/actions';
import { handleChildClick, getTokenUri, objToString } from 'utils/helper';
import store from 'store/index';
import moment from 'moment';

export default function CardCollection({ token, infoCollection }) {
  const { web3, chainId, verifiedContracts, infoCollections } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);
  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          if (token.is1155) {
            const nft = new web3.eth.Contract(sampleAbiERC1155.abi, token.collectionAddress);
            tokenURI = await nft.methods.uri(token.tokenId).call();
          } else {
            const nft = new web3.eth.Contract(abiERC721.abi, token.collectionAddress);
            tokenURI = await nft.methods.tokenURI(token.tokenId).call();
            // let name = await nft.methods.name().call();
          }

          let req = await getTokenUri(tokenURI);
          const data = req.data;

          token.attributes = !!data.attributes ? data.attributes : null;

          setDetailNFT({
            name: !!data.name ? data.name : 'ID: ' + token.index,
            description: !!data.description ? data.description : '',
            image: !!data.image ? data.image : imgNotFound,
          });
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
        }
        token.nameCollection = (
          await store.dispatch(getCollection(token.collectionAddress, null))
        ).collection.name;
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token, web3, chainId, infoCollections]);

  return !!detailNFT ? (
    <Link
      to={`/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${
        !!token.sellId ? token.sellId : 'null'
      }`}
      target='_blank'
    >
      <Card
        className='collection-card card-nft'
        cover={
          <div className='wrap-cover'>
            <div
              className='blurred-background'
              style={{ backgroundImage: `url(${!!token.image ? token.image : detailNFT.image})` }}
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
      >
        {!!token.attributes && (
          <Popover
            onClick={handleChildClick}
            placement='bottomLeft'
            content={token.attributes.map((attr, i) => (
              <div key={i} onClick={handleChildClick}>
                <strong>{attr.trait_type}</strong>:{' '}
                {!!attr.display_type &&
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
              {!!infoCollection.name ? infoCollection.name : token.nameCollection}
              {!!token.collectionAddress &&
              verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) ? (
                <img src={tick} alt='icon-tick' className='icon-tick' />
              ) : null}{' '}
            </div>
            <div className='name-nft textmode'>{!!token.name ? token.name : detailNFT.name}</div>
          </Col>
        </Row>
      </Card>
    </Link>
  ) : (
    <Card
      className='collection-card card-nft card-nft-content-loader'
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
          <div className='name-nft textmode'>&nbsp;</div>
        </Col>
      </Row>
    </Card>
  );
}
