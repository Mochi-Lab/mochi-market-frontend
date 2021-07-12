import { Card, Col, Popover, Row } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';
import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import tick from 'Assets/icons/tick-green.svg';
import 'Assets/css/common-card-nft.scss';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { handleChildClick } from '../../utils/helper';

export default function CardNFTHome({ token }) {
  const { web3, chainId, verifiedContracts, infoCollections } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

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

          token.attributes = !!data.attributes ? data.attributes : null;

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

  return !!detailNFT ? (
    <Link to={`/token/${chainId}/${token.addressToken}/${token.index}/${token.sellId}`}>
      <Card
        className='home-card card-nft'
        cover={
          <div className='wrap-cover'>
            <div
              className='blurred-background'
              style={{ backgroundImage: `url(${detailNFT.image})` }}
            />
            <div className='NFTResource-Wrapper'>
              <img
                alt={`img-nft-${token.index}`}
                src={detailNFT.image}
                className='display-resource-nft'
              />
            </div>
          </div>
        }
      >
        {!!token.attributes ? (
          <Popover
            onClick={handleChildClick}
            placement='bottomLeft'
            content={token.attributes.map((attr, i) => (
              <div key={i} onClick={handleChildClick}>
                <strong>{attr.trait_type}</strong>: {attr.value}
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
                to={`/collection/${chainId}/${token.addressToken}`}
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
  ) : null;
}
