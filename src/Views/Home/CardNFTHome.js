import { Card, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';
import abiERC1155 from 'Contracts/ERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';

export default function CardNFTHome({ token, strSearch }) {
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
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 6 }}
      xl={{ span: 4 }}
      xxl={{ span: 4 }}
    >
      <Link to={`/token/${token.addressToken}/${token.index}/${token.sellId}`}>
        <Card hoverable cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}>
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
    </Col>
  ) : null;
}
