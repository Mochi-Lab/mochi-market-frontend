import { Card } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';
import { getDetailNft } from 'api/apiProvider';
import abiERC1155 from 'Contracts/ERC1155.json';
import abiERC721 from 'Contracts/ERC721.json';
import axiosClient from 'api';

export default function CardNFTHome({ token }) {
  const { web3, chainId } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token) {
        try {
          let tokenURI;
          let req;
          var data;
          if (token.is1155) {
            const nft = new web3.eth.Contract(abiERC1155.abi, token.addressToken);
            tokenURI = await nft.methods.uri(token.index).call();

            req = await axios.get(tokenURI);
            data = req.data;
          } else {
            data = await axiosClient.get(getDetailNft(token.addressToken, token.index));
            if (!data) {
              const nft = new web3.eth.Contract(abiERC721.abi, token.addressToken);
              tokenURI = await nft.methods.tokenURI(token.index).call();
              req = await axios.get(tokenURI);
              data = req.data;
            }
          }

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

  return !!detailNFT ? (
    <Link to={`/token/${token.addressToken}/${token.index}`}>
      <Card
        className='home-card'
        cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}
      >
        <div className='ant-card-meta-title'>{detailNFT.name}</div>
        <div className='ant-card-meta-description textmode'>
          {!!token.price ? (
            `${web3.utils.fromWei(token.price, 'ether')} ${getSymbol(chainId)[token.tokenPayment]}`
          ) : (
            <></>
          )}
        </div>
      </Card>
    </Link>
  ) : null;
}
