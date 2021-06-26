import { /* Button,  message, */ Tabs, Grid, Image } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import IconLoading from 'Components/IconLoading';
import Share from 'Components/Share';
import { getSymbol } from 'utils/getContractAddress';
import helperGetNFTDetails from './helperGetNFTDetails';
import helperGetOwner1155 from './helperGetOwner1155';
import helperStatusActions721 from './helperStatusActions721';
import helperStatusActions1155Order from './DetailsNftOrder/helperStatusActions1155Order';
import helperStatusActions1155Profile from './DetailsNftProfile/helperStatusActions1155Profile';
import RenderSwitch from './RenderSwitch';
import BuySmall from 'Components/BuySmall';
import IconCoppy from 'Components/IconCoppy';
import { getRootExplorer } from 'utils/getRootExplorer';
import { setAvailableSellOrder, getUser, setInfoUsers } from 'store/actions';
import avatarDefault from 'Assets/avatar-profile.png';
import tick from 'Assets/icons/tick-green.svg';

import './index.scss';

const { TabPane } = Tabs;

const { useBreakpoint } = Grid;

export default function DetailNFT() {
  const { lg } = useBreakpoint();

  const dispatch = useDispatch();

  const [token, setToken] = useState(null);
  const [is1155, setIs1155] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const [status, setStatus] = useState(0);
  const [owners, setOwners] = useState([]);
  const [ownersOnSale, setOwnersOnSale] = useState([]);
  const [available, setAvailable] = useState(1);
  const [totalSupply, setTotalSupply] = useState(1);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const [infoOwners, setInfoOwners] = useState({});

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
    verifiedContracts,
    infoCollections,
    infoUsers,
  } = useSelector((state) => state);
  const { addressToken, id, sellID } = useParams();

  useEffect(() => {
    const fetchSetAvailableOrdersNew = async () => {
      await dispatch(setAvailableSellOrder());
    };
    fetchSetAvailableOrdersNew();
    setTimeout(() => {
      fetchSetAvailableOrdersNew();
      fetchSetAvailableOrdersNew();
    }, 500);
  }, [dispatch]);

  // Get detail nft by TokenURI for both 721 and 1155
  useEffect(() => {
    helperGetNFTDetails(web3, nftList, addressToken, id, erc1155Tokens, setAvailable, setToken);
  }, [web3, nftList, addressToken, id, erc1155Tokens, infoCollections]);

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
        if (Number.isInteger(parseInt(sellID)) && sellID !== 'null')
          helperStatusActions1155Order(
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
        else helperStatusActions1155Profile(walletAddress, setStatus, addressToken, id, chainId);
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
    chainId,
  ]);

  useEffect(() => {
    statusActions();
  }, [statusActions]);

  const getInfoOwners = useCallback(() => {
    let _infoUsers = infoUsers;
    owners.forEach(async (owner) => {
      let res = await dispatch(getUser(owner.owner.toLowerCase()));
      let infoUser = res.user;
      _infoUsers[owner.owner.toLowerCase()] = infoUser;
    });
    setInfoOwners(_infoUsers);
    dispatch(setInfoUsers(_infoUsers));
  }, [dispatch, infoUsers, owners]);

  useEffect(() => {
    getInfoOwners();
  }, [getInfoOwners]);

  return (
    <div className='detail-page center'>
      <div className='body-page'>
        {!!token ? (
          <div className='detail-main'>
            {lg ? (
              <div className='info-wrap-left'>
                <div className='expand-img-nft'>
                  <div className='image-label center'>
                    <Image alt='img-nft' src={token.image} />
                  </div>
                </div>

                <div className='properties-nft'>
                  <div className='content-properties'>
                    <div className='title-tab-properties'>
                      <h3 className='textmode'>Properties</h3>
                    </div>
                    <div className='list-properties'>
                      <div className='items-properties'>
                        {!!token.attributes
                          ? token.attributes.map((attr, i) => (
                              <div className='item-properties' key={i}>
                                <div className='name-properties'>{attr.trait_type}</div>
                                <div className='value-properties textmode'>{attr.value}</div>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className='info-wrap-right'>
              <div className='info-order-nft'>
                <div className='collections-nft'>
                  <Link to={`/collection/${addressToken.toLowerCase()}`}>
                    {token.nameCollection}
                  </Link>
                  {verifiedContracts.includes(addressToken.toLowerCase()) ? (
                    <img src={tick} alt='icon-tick' />
                  ) : null}
                </div>
                <div className='detail-title'>
                  <h1 className='text-title textmode'>{token.name}</h1>
                  <Share token={token} />
                </div>
                {!lg ? (
                  <div className='expand-img-nft-mobile'>
                    <div className='image-label center'>
                      <Image alt='img-nft' src={token.image} />
                    </div>
                  </div>
                ) : null}
                <div className={`detail-des textmode ${showMoreDescription ? 'no-nowrap' : ''}`}>
                  {token.description.length > 75 ? (
                    !showMoreDescription ? (
                      <>
                        {token.description.substring(0, 50) + '...'}
                        <span
                          className='show-more-description'
                          onClick={() => setShowMoreDescription(true)}
                        >
                          show more <DoubleRightOutlined />
                        </span>
                      </>
                    ) : (
                      <>
                        {token.description}
                        <span
                          className='show-more-description'
                          onClick={() => setShowMoreDescription(false)}
                        >
                          <DoubleLeftOutlined /> less
                        </span>
                      </>
                    )
                  ) : (
                    token.description
                  )}
                </div>
                {!!orderDetail ? (
                  <div className='owner-order-nft'>
                    <img
                      src={
                        !!infoOwners[orderDetail.seller.toLowerCase()]
                          ? infoOwners[orderDetail.seller.toLowerCase()].avatar
                          : avatarDefault
                      }
                      alt='avatar-default'
                    />{' '}
                    <span className='text-blur mr-0d5rem'>Owned by </span>{' '}
                    <a href={`/profile/${orderDetail.seller}`} className='href-to-address-contract'>
                      {`${orderDetail.seller.slice(0, 8)}...${orderDetail.seller.slice(
                        orderDetail.seller.length - 6,
                        orderDetail.seller.length
                      )}`}
                    </a>
                    <button className='btn-coppy'>
                      <span className='icon-coppy'>
                        <IconCoppy address={orderDetail.seller} />
                      </span>
                    </button>
                  </div>
                ) : (
                  ''
                )}

                <div className='info-contract-nft'>
                  <p className='info-contract-item'>
                    <span>Contract Address</span>
                    <span className='wrap-address-and-coppy'>
                      <a
                        href={`${getRootExplorer(chainId)}/address/${addressToken}`}
                        target='_blank'
                        rel='noreferrer'
                        className='href-to-address-contract'
                      >
                        {lg
                          ? addressToken
                          : `${addressToken.slice(0, 8)}...${addressToken.slice(
                              addressToken.length - 6,
                              addressToken.length
                            )}`}
                      </a>
                      <button className='btn-coppy'>
                        <span className='icon-coppy'>
                          <IconCoppy address={addressToken} />
                        </span>
                      </button>
                    </span>
                  </p>
                  <p className='info-contract-item'>
                    <span>Token ID</span>
                    <span>{id}</span>
                  </p>
                </div>
                <div className='purchase-nft'>
                  <div className='style-purchase'>
                    {!!orderDetail ? (
                      <div className='title-and-price'>
                        <p className='title-price'>Price</p>
                        <div className='price'>
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
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className='actions-nft'>
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
                    </div>
                  </div>
                </div>
              </div>
              {!lg ? (
                <div className='properties-nft'>
                  <div className='content-properties'>
                    <div className='title-tab-properties'>
                      <h3>Properties</h3>
                    </div>
                    <div className='list-properties'>
                      <div className='items-properties'>
                        {!!token.attributes
                          ? token.attributes.map((attr, i) => (
                              <div className='item-properties' key={i}>
                                <div className='name-properties'>{attr.trait_type}</div>
                                <div className='value-properties'>{attr.value}</div>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className='list-owners-and-orders'>
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
                            <img
                              src={
                                !!infoOwners[owner.owner.toLowerCase()]
                                  ? infoOwners[owner.owner.toLowerCase()].avatar
                                  : avatarDefault
                              }
                              alt='avatar-default'
                            />
                          </div>
                          <div className='link-and-available'>
                            <Link to={`/profile/${owner.owner.toLowerCase()}`} className='owner'>
                              {!!infoOwners[owner.owner.toLowerCase()] &&
                              infoOwners[owner.owner.toLowerCase()].username !== 'Unamed' ? (
                                <strong>@{infoOwners[owner.owner.toLowerCase()].username}</strong>
                              ) : (
                                <strong>
                                  {lg
                                    ? owner.owner
                                    : `${owner.owner.slice(0, 8)}...${owner.owner.slice(
                                        owner.owner.length - 6,
                                        owner.owner.length
                                      )}`}
                                </strong>
                              )}
                            </Link>
                            <div className='textmode'>
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
                            <img
                              src={
                                !!infoOwners[owner.seller.toLowerCase()]
                                  ? infoOwners[owner.seller.toLowerCase()].avatar
                                  : avatarDefault
                              }
                              alt='avatar-default'
                            />
                          </div>
                          <div className='link-and-available'>
                            <Link to={`/profile/${owner.seller}`} className='owner'>
                              {!!infoOwners[owner.seller.toLowerCase()] &&
                              infoOwners[owner.seller.toLowerCase()].username !== 'Unamed' ? (
                                <strong>@{infoOwners[owner.seller.toLowerCase()].username}</strong>
                              ) : (
                                <strong>
                                  {lg
                                    ? owner.seller
                                    : `${owner.seller.slice(0, 8)}...${owner.seller.slice(
                                        owner.seller.length - 6,
                                        owner.seller.length
                                      )}`}
                                </strong>
                              )}
                            </Link>
                            <div className='textmode'>
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
            </div>
          </div>
        ) : (
          <div className='center' style={{ width: '100%', minHeight: '200px' }}>
            <IconLoading />
          </div>
        )}
      </div>
    </div>
  );
}
