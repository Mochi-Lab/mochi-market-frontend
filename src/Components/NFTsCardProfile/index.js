import { Card, Row, Col, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getSymbol } from 'utils/getContractAddress';
import imgNotFound from 'Assets/notfound.png';
import abiERC1155 from 'Contracts/ERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import '../NFTsCardBrowse/index.css';

function NFTsCardProfile({ token, strSearch }) {
  const { web3, chainId } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          if (token.is1155) {
            const nft = new web3.eth.Contract(abiERC1155.abi, token.addressToken);
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
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token, web3]);

  return !!detailNFT &&
    !!detailNFT.name &&
    (detailNFT.name.toLocaleLowerCase().includes(strSearch.toLowerCase()) ||
      token.collections.toLocaleLowerCase().includes(strSearch.toLowerCase())) ? (
    <Col
      className='gutter-row'
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 8 }}
    >
      {!!detailNFT ? (
        <Link
          to={`/token/${token.addressToken}/${token.index}/${!!token.sellId ? token.sellId : null}`}
        >
          <Card hoverable cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}>
            {token.is1155 ? (
              <p className='textmode'>
                {!!token.soldAmount
                  ? parseInt(token.value) - parseInt(token.soldAmount)
                  : token.value}{' '}
                <span className='text-blur'>of</span> {token.totalSupply}{' '}
                <span className='text-blur'>Available</span>
              </p>
            ) : (
              <p className='height-line'></p>
            )}
            <div className='ant-card-meta-title'>{detailNFT.name}</div>
            <div className='ant-card-meta-description textmode'>
              {!!token.price ? (
                `${web3.utils.fromWei(token.price, 'ether')} ${
                  getSymbol(chainId)[token.tokenPayment]
                }`
              ) : (
                <></>
              )}
            </div>
          </Card>
        </Link>
      ) : (
        <Skeleton active round title='123' />
      )}
    </Col>
  ) : null;
}

export default function ERC721({ tokens }) {
  const [afterFilter, setafterFilter] = useState(!!tokens ? tokens : []);
  const { strSearch } = useSelector((state) => state);

  useEffect(() => {
    if (tokens) setafterFilter(() => tokens);
  }, [tokens]);

  return (
    <div className='explore-nft content-list-nft'>
      <Row justify='start' gutter={[0, 10]}>
        {!!afterFilter ? (
          afterFilter.map((token, index) => (
            <NFTsCardProfile key={index} token={token} strSearch={strSearch} />
          ))
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
