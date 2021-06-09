import { Button, message, Tabs } from 'antd';
import {
  ExpandAltOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ERC721 from 'Contracts/ERC721.json';
import ERC1155 from 'Contracts/ERC1155.json';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import IconLoading from 'Components/IconLoading';
import Sell from 'Components/Sell';
import Buy from 'Components/Buy';
import Cancel from 'Components/Cancel';
import Transfer from 'Components/Transfer';
import ConnectWallet from 'Components/ConnectWallet';
import Share from 'Components/Share';
import BackButton from 'Components/BackButton';
import { getSymbol } from 'utils/getContractAddress';
import { getAllOwnersOf1155 } from 'utils/helper';
import avatarDefault from 'Assets/avatar-profile.png';
import imgNotFound from 'Assets/notfound.png';

import './style.css';

const { TabPane } = Tabs;

const RenderSwitch = ({ status, token, orderDetail, is1155 }) => {
  switch (status) {
    case 3:
      return <Cancel orderDetail={orderDetail} />;
    case 2:
      return (
        <div className='PE'>
          <div className='actions-btn'>
            <Sell token={token} is1155={is1155} />
            <div className='cAFwWB' />
            <Transfer token={token} />
          </div>
        </div>
      );
    case 1:
      return <Buy orderDetail={orderDetail} />;
    default:
      return <div></div>;
  }
};

export default function DetailNFT() {
  const [token, setToken] = useState(null);
  const [is1155, setIs1155] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [status, setStatus] = useState(0);
  const [owners, setOwners] = useState([]);
  const [indexAvailable, setIndexAvailable] = useState(null);
  const [expandImgDetail, setExpandImgDetail] = useState(false);
  // get details nft
  const {
    web3,
    walletAddress,
    sellOrderList,
    availableSellOrder721,
    market,
    chainId,
    nftList,
    convertErc1155Tokens,
  } = useSelector((state) => state);
  const { addressToken, id, sellID } = useParams();

  const getNFTDetails = useCallback(async () => {
    if (web3 && nftList) {
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      let tokenURI;
      if (is1155) {
        const erc1155Instances = await new web3.eth.Contract(ERC1155.abi, addressToken);
        tokenURI = await erc1155Instances.methods.uri(id).call();
      } else {
        const erc721Instances = await new web3.eth.Contract(ERC721.abi, addressToken);
        tokenURI = await erc721Instances.methods.tokenURI(id).call();
      }
      // get token info
      try {
        let req = await axios.get(tokenURI);
        const data = req.data;
        setToken({
          name: !!data.name ? data.name : 'Unnamed',
          description: !!data.description ? data.description : '',
          image: !!data.image ? data.image : imgNotFound,
        });
      } catch (error) {
        setToken({ name: 'Unnamed', description: '', image: imgNotFound });
      }
    }
  }, [addressToken, id, nftList, web3]);

  useEffect(() => {
    getNFTDetails();
  }, [getNFTDetails]);

  const setStatuActionsNFT = useCallback(async () => {
    if (web3 && sellOrderList && availableSellOrder721 && nftList) {
      var sellId = {};
      try {
        sellId = await sellOrderList.methods.getLatestSellIdERC721(addressToken, id).call();
      } catch (error) {
        console.log(error);
        sellId.found = false;
      }
      try {
        let is1155 = await nftList.methods.isERC1155(addressToken).call();
        //==========================================================================================
        //----------------------------Process ERC1155-----------------------------------------------
        //==========================================================================================
        if (is1155) {
          setIs1155(true);
          let onSaleOfAddressToken;
          let listOwners;

          for (let i = 0; i < convertErc1155Tokens.length; i++) {
            const collection = convertErc1155Tokens[i];
            if (collection.addressToken.toLowerCase() === addressToken.toLowerCase()) {
              onSaleOfAddressToken = collection;
              break;
            }
          }
          if (!!onSaleOfAddressToken) {
            // onSaleOfAddressToken;
          } else {
            listOwners = await getAllOwnersOf1155(addressToken, id, chainId);
            setOwners(listOwners);
          }

          if (!!walletAddress && Number.isInteger(sellID) && sellID !== 'null') {
            const sellOrder = await sellOrderList.methods.getSellOrderById(sellID).call();
            if (sellOrder.seller.toLowerCase() === walletAddress.toLowerCase()) {
              setStatus(3);
            } else {
              setStatus(1);
            }
          } else if (!!walletAddress && sellID === 'null') {
            for (let i = 0; i < listOwners.length; i++) {
              const owner = listOwners[i];
              if (owner.owner.toLowerCase() === walletAddress.toLowerCase()) {
                setStatus(2);
                break;
              } else {
                setStatus(0);
              }
            }
          } else {
            Number.isInteger(sellID) && sellID !== 'null' ? setStatus(1) : setStatus(0);
          }
        } else {
          //========================================================================================
          //----------------------------Process ERC721----------------------------------------------
          //========================================================================================
          const erc721Instances = await new web3.eth.Contract(ERC721.abi, addressToken);

          let tokenOwner;
          // check if user is owner of token
          if (!!sellId.found) {
            const order = await sellOrderList.methods.getSellOrderById(sellId.id).call();
            if (order.isActive) {
              tokenOwner = order.seller;
              setOwners([{ owner: tokenOwner }]);
            } else {
              tokenOwner = await erc721Instances.methods.ownerOf(id).call();
              setOwners([{ owner: tokenOwner }]);
            }
          } else {
            tokenOwner = await erc721Instances.methods.ownerOf(id).call();
            setOwners([{ owner: tokenOwner }]);
          }

          let isSelling;

          if (!!walletAddress) {
            isSelling = await sellOrderList.methods
              .checkDuplicateERC721(addressToken, id, walletAddress)
              .call();
          }

          if (walletAddress && isSelling) {
            setStatus(3);
          } else if (walletAddress && tokenOwner.toLowerCase() === walletAddress.toLowerCase()) {
            // Check if the token is in the order list?
            let isOnList = await sellOrderList.methods
              .checkDuplicateERC721(addressToken, id, tokenOwner)
              .call();
            isOnList ? setStatus(3) : setStatus(2);
          } else {
            let isOnList = await sellOrderList.methods
              .checkDuplicateERC721(addressToken, id, tokenOwner)
              .call();

            isOnList || tokenOwner === market._address ? setStatus(1) : setStatus(0);
          }
          let fil = availableSellOrder721.filter(
            (token) => token.nftAddress === addressToken && token.tokenId === id
          );
          setOrderDetail(fil[0]);

          let indexInAvalableSell = availableSellOrder721.findIndex(
            (token) => token.nftAddress === addressToken && token.tokenId === id
          );
          setIndexAvailable(indexInAvalableSell);
        }
      } catch (error) {
        console.log({ error });
        message.error("NFT doesn't exist!");
      }
    }
  }, [
    addressToken,
    availableSellOrder721,
    chainId,
    convertErc1155Tokens,
    id,
    market,
    nftList,
    sellOrderList,
    walletAddress,
    web3,
    sellID,
  ]);

  useEffect(() => {
    setStatuActionsNFT();
  }, [setStatuActionsNFT]);

  return (
    <div className='detail-page center'>
      {!!token ? (
        expandImgDetail ? (
          <div className='zoom'>
            <div className='btn-zoomin'>
              <div className='btns'>
                <Button
                  shape='circle'
                  icon={<FullscreenExitOutlined />}
                  size='large'
                  onClick={() => setExpandImgDetail(false)}
                />
              </div>
            </div>
            <div className='zimage center'>
              <div className='inimage'>
                <img alt='img-nft' src={token.image} />
              </div>
            </div>
          </div>
        ) : (
          <div className='detail-main'>
            <div className='expand-img-nft'>
              <div className='top-btns'>
                <BackButton />

                <Button
                  shape='circle'
                  icon={<ExpandAltOutlined />}
                  size='large'
                  onClick={() => setExpandImgDetail(true)}
                />
              </div>

              {indexAvailable - 1 > 0 ? (
                <div className='btL'>
                  <Link
                    to={`/token/${availableSellOrder721[indexAvailable - 1].nftAddress}/${
                      availableSellOrder721[indexAvailable - 1].tokenId
                    }`}
                  >
                    <Button shape='circle' icon={<LeftOutlined />} size='large' />
                  </Link>
                </div>
              ) : (
                <></>
              )}

              <div className='image-label center'>
                <div className='imgl'>
                  <img alt='img-nft' src={token.image} />
                </div>
              </div>

              {!!availableSellOrder721 && indexAvailable + 1 < availableSellOrder721.length ? (
                <div className='btR'>
                  <Link
                    to={`/token/${availableSellOrder721[indexAvailable + 1].nftAddress}/${
                      availableSellOrder721[indexAvailable + 1].tokenId
                    }`}
                  >
                    <Button shape='circle' icon={<RightOutlined />} size='large' />
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className='side-bar'>
              <div className='detail-content'>
                <div className='detail-title'>
                  <h1 className='text-title textmode'>{token.name}</h1>
                  <Share token={token} />
                </div>
                {orderDetail ? (
                  <div className='price-nft'>
                    <div className='price-eth pink-font'>
                      {web3.utils.fromWei(orderDetail.price, 'ether')}{' '}
                      {getSymbol(chainId)[orderDetail.token]}
                    </div>
                    <div className='textmode price-eth'>1 of 1</div>
                  </div>
                ) : (
                  <></>
                )}

                <div className='detail-des'>
                  <div className='description-nft textmode'>{token.description}</div>
                </div>
                <div className='detail-owner'>
                  <Tabs defaultActiveKey='1'>
                    <TabPane tab='Owners' key='1'>
                      {owners.map((owner, index) => (
                        <Link to={`/profile/${owner.owner}`} className='owner' key={index}>
                          <img src={avatarDefault} alt='avatar-default' /> {'  '}
                          <strong>{owner.owner}</strong>
                        </Link>
                      ))}
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              {window.innerWidth > 770 ? (
                <div className='footer-sidebar'>
                  <div className='actions-buy-bid'>
                    <RenderSwitch
                      status={status}
                      token={token}
                      orderDetail={orderDetail}
                      is1155={is1155}
                    />
                    <div className='feeService textmode'>
                      Service fee
                      <span className='pt textmode'> 2.5% </span>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {window.innerWidth < 770 ? (
              <div className='footer-sidebar'>
                <div className='actions-buy-bid'>
                  {walletAddress ? (
                    <RenderSwitch status={status} token={token} orderDetail={orderDetail} />
                  ) : (
                    <ConnectWallet />
                  )}

                  <div className='feeService textmode'>
                    Service fee
                    <span className='pt textmode'> 2.5% </span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )
      ) : (
        <div className='center' style={{ width: '100%', minHeight: '200px' }}>
          <IconLoading />
        </div>
      )}
    </div>
  );
}
