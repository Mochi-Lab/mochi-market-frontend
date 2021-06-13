import { Button, /* message, */ Tabs } from 'antd';
import { ExpandAltOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import IconLoading from 'Components/IconLoading';
import ConnectWallet from 'Components/ConnectWallet';
import Share from 'Components/Share';
import BackButton from 'Components/BackButton';
import { getSymbol } from 'utils/getContractAddress';
import helperGetNFTDetails from '../helperGetNFTDetails';
import helperGetOwner1155 from '../helperGetOwner1155';
import helperStatusActions721 from '../helperStatusActions721';
import helperStatusActions1155 from './helperStatusActions1155';
import RenderSwitch from '../RenderSwitch';
import BuySmall from 'Components/BuySmall';
import { setAvailableSellOrder } from 'store/actions';
import store from 'store/index';
import avatarDefault from 'Assets/avatar-profile.png';

import '../style.css';

const { TabPane } = Tabs;

export default function DetailsNftOrder() {
  const [token, setToken] = useState(null);
  const [is1155, setIs1155] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [status, setStatus] = useState(0);
  const [owners, setOwners] = useState([]);
  const [ownersOnSale, setOwnersOnSale] = useState([]);
  const [expandImgDetail, setExpandImgDetail] = useState(false);
  const [available, setAvailable] = useState(1);
  const [totalSupply, setTotalSupply] = useState(1);

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
    availableSellOrder1155,
    erc1155Tokens,
  } = useSelector((state) => state);
  const { addressToken, id, sellID } = useParams();

  useEffect(() => {
    const fetchSetAvailableOrdersNew = async () => {
      await store.dispatch(setAvailableSellOrder());
    };
    fetchSetAvailableOrdersNew();
    setTimeout(() => {
      fetchSetAvailableOrdersNew();
      fetchSetAvailableOrdersNew();
    }, 500);
  }, []);

  // Get detail nft by TokenURI for both 721 and 1155
  useEffect(() => {
    helperGetNFTDetails(web3, nftList, addressToken, id, erc1155Tokens, setAvailable, setToken);
  }, [web3, nftList, addressToken, id, erc1155Tokens]);

  // Modules getOwners1155 to other file so short index file
  const getOwners1155 = useCallback(async () => {
    if (!!market) {
      helperGetOwner1155(
        convertErc1155Tokens,
        addressToken,
        id,
        chainId,
        market,
        setTotalSupply,
        setOwners,
        setOwnersOnSale
      );
    }
  }, [convertErc1155Tokens, addressToken, id, chainId, market]);

  // Check status action sell, transfer, cancel and buy
  const statusActions = useCallback(async () => {
    if (web3 && sellOrderList && availableSellOrder721 && nftList) {
      let is1155 = await nftList.methods.isERC1155(addressToken).call();
      //  Process ERC1155
      if (is1155) {
        getOwners1155();
        setIs1155(true);
        helperStatusActions1155(
          availableSellOrder721,
          availableSellOrder1155,
          nftList,
          sellOrderList,
          walletAddress,
          web3,
          sellID,
          setStatus,
          setOrderDetail
        );
      } else {
        //  Process ERC721
        helperStatusActions721(
          addressToken,
          availableSellOrder721,
          id,
          market,
          nftList,
          sellOrderList,
          walletAddress,
          web3,
          setStatus,
          setOwners,
          setOwnersOnSale,
          setOrderDetail
        );
      }
    }
  }, [
    addressToken,
    availableSellOrder721,
    availableSellOrder1155,
    id,
    market,
    nftList,
    sellOrderList,
    walletAddress,
    web3,
    sellID,
    getOwners1155,
  ]);

  useEffect(() => {
    statusActions();
  }, [statusActions]);

  return (
    <div className='detail-page center'>
      {!!token && !!orderDetail ? (
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

              <div className='image-label center'>
                <div className='imgl'>
                  <img alt='img-nft' src={token.image} />
                </div>
              </div>
            </div>

            <div className='side-bar'>
              <div className='detail-content'>
                <div className='detail-title'>
                  <h1 className='text-title textmode'>{token.name}</h1>
                  <Share token={token} />
                </div>
                {!!orderDetail ? (
                  <div className='price-nft'>
                    <span className='textmode price-eth'>
                      {`${
                        !!is1155
                          ? parseInt(orderDetail.amount) - parseInt(orderDetail.soldAmount)
                          : orderDetail.amount
                      } of ${totalSupply}`}
                    </span>
                    <span className='price-eth pink-font'>
                      {web3.utils.fromWei(orderDetail.price, 'ether')}{' '}
                      {getSymbol(chainId)[orderDetail.token]}
                    </span>
                    <span className='textmode price-eth'>each</span>
                  </div>
                ) : (
                  <></>
                )}

                <div className='detail-des'>
                  <div className='description-nft textmode'>{token.description}</div>
                </div>
                <div className='detail-owner'>
                  <Tabs
                    defaultActiveKey={
                      Number.isInteger(parseInt(sellID)) && sellID !== 'null' ? '2' : '1'
                    }
                  >
                    <TabPane tab='Owners' key='1'>
                      {owners.map((owner, index) => (
                        <div key={index} className='avatar-link-available'>
                          <div className='avatar-owner'>
                            <img src={avatarDefault} alt='avatar-default' />
                          </div>
                          <div className='link-and-available'>
                            <Link to={`/profile/${owner.owner}`} className='owner'>
                              <strong>{owner.owner}</strong>
                            </Link>
                            <div>
                              {owner.value} <span className='text-blur'> no sale of</span>{' '}
                              {totalSupply} <span className='text-blur '>Available</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabPane>
                    <TabPane tab='On Sale' key='2'>
                      {ownersOnSale.map((owner, index) => (
                        <div key={index} className='avatar-link-available'>
                          <div className='avatar-owner'>
                            <img src={avatarDefault} alt='avatar-default' />
                          </div>
                          <div className='link-and-available'>
                            <Link to={`/profile/${owner.seller}`} className='owner'>
                              <strong>{owner.seller}</strong>
                            </Link>
                            <div>
                              {!!is1155
                                ? parseInt(owner.value) - parseInt(owner.soldAmount)
                                : owner.value}
                              <span className='text-blur'>/</span>
                              {totalSupply} <span className='text-blur '>price</span>{' '}
                              {web3.utils.fromWei(owner.price, 'ether')}{' '}
                              {getSymbol(chainId)[owner.tokenPayment]}{' '}
                              <span className='text-blur '>each</span> {''}
                              {!walletAddress ||
                              (!!walletAddress &&
                                owner.seller.toLowerCase() !== walletAddress.toLowerCase()) ? (
                                <BuySmall
                                  orderDetail={owner}
                                  is1155={is1155}
                                  id={id}
                                  addressToken={addressToken}
                                  getOwners1155={getOwners1155}
                                >
                                  buy
                                </BuySmall>
                              ) : null}
                            </div>
                          </div>
                        </div>
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
                      available={available}
                      web3={web3}
                      getOwners1155={getOwners1155}
                      addressToken={addressToken}
                      id={id}
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
                    <RenderSwitch
                      status={status}
                      token={token}
                      orderDetail={orderDetail}
                      is1155={is1155}
                      available={available}
                      web3={web3}
                      getOwners1155={getOwners1155}
                      addressToken={addressToken}
                      id={id}
                    />
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
