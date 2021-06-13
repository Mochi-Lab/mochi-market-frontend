import { parseBalance, listERC721OfOwner } from 'utils/helper';
// import ERC1155 from 'Contracts/ERC1155.json';
import ERC721 from 'Contracts/ERC721.json';
import SampleERC721 from 'Contracts/SampleERC721.json';
import SampleERC1155 from 'Contracts/SampleERC1155.json';
import MochiERC721NFT from 'Contracts/MochiERC721NFT.json';
import MochiERC1155NFT from 'Contracts/MochiERC1155NFT.json';
import AddressesProvider from 'Contracts/AddressesProvider.json';
import Market from 'Contracts/Market.json';
import NFTList from 'Contracts/NFTList.json';
import SellOrderList from 'Contracts/SellOrderList.json';
import Vault from 'Contracts/Vault.json';
import CreativeStudio from 'Contracts/CreativeStudio.json';
import NFTCampaign from 'Contracts/NFTCampaign.json';
import ERC20 from 'Contracts/ERC20.json';
import MOMAabi from 'Contracts/MOMAabi.json';
import axios from 'axios';
import { getContractAddress } from 'utils/getContractAddress';
import * as randomAvatarGenerator from '@fractalsoftware/random-avatar-generator';
import { getWeb3List } from 'utils/getWeb3List';
import { uploadJsonToIpfs, uploadFileToIpfs } from 'utils/ipfs';
import axiosClient from 'api';
import {
  getAllUserErc,
  getAllUserErcFormat,
  getAllOrderListFormat,
  getAllOrderListOfUser,
  getavailableSellOrderERC721,
} from 'api/apiProvider';

var contractAddress;
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const VALUE_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

////////////////////
// Common
////////////////////

export const SET_WEB3 = 'SET_WEB3';
export const setWeb3 = (web3) => async (dispatch, getState) => {
  dispatch({ type: SET_WEB3, web3 });

  let chainId = getState().chainId ? getState().chainId : await web3.eth.net.getId();
  contractAddress = getContractAddress(chainId);

  const addressesProvider = new web3.eth.Contract(
    AddressesProvider.abi,
    contractAddress.AddressesProvider
  );
  const market = new web3.eth.Contract(Market.abi, contractAddress.Market);
  const nftList = new web3.eth.Contract(NFTList.abi, contractAddress.NftList);
  const sellOrderList = new web3.eth.Contract(SellOrderList.abi, contractAddress.SellOrderList);
  const vault = new web3.eth.Contract(Vault.abi, contractAddress.Vault);
  const creativeStudio = new web3.eth.Contract(CreativeStudio.abi, contractAddress.CreativeStudio);
  const nftCampaign = new web3.eth.Contract(NFTCampaign.abi, contractAddress.NFTCampaign);

  dispatch(setAddressesProvider(addressesProvider));
  dispatch(setMarket(market));
  dispatch(setNftList(nftList));
  dispatch(setAcceptedNftsUser());
  dispatch(setSellOrderList(sellOrderList));
  dispatch(setVault(vault));
  dispatch(setCreativeStudio(creativeStudio));
  dispatch(setNftClaimToken(nftCampaign));
  dispatch(setAdminAddress(addressesProvider));

  dispatch(setAvailableSellOrder());
};

export const LOGOUT = 'LOGOUT';
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const SET_CHAINID = 'SET_CHAINID';
export const setChainId = (chainId) => (dispatch) => {
  dispatch({ type: SET_CHAINID, chainId });
};

export const SET_ADMIN_ADDRESS = 'SET_ADMIN_ADDRESS';
export const setAdminAddress = (addressesProvider) => async (dispatch) => {
  let adminAddress = await addressesProvider.methods.getAdmin().call();
  dispatch({
    type: SET_ADMIN_ADDRESS,
    adminAddress,
  });
};

export const SET_ADDRESS = 'SET_ADDRESS';
export const setAddress = (walletAddress) => (dispatch) => {
  if (walletAddress !== null) {
    var shortAddress = `${walletAddress.slice(0, 8)}...${walletAddress.slice(
      walletAddress.length - 6,
      walletAddress.length
    )}`;
    dispatch({
      type: SET_ADDRESS,
      walletAddress,
      shortAddress,
    });
    dispatch(setBalance());

    dispatch(setCollectionByUser());
  }
};

export const SET_BALANCE = 'SET_BALANCE';
export const setBalance = () => async (dispatch, getState) => {
  let { web3, walletAddress } = getState();
  let balance;
  if (walletAddress !== null) {
    balance = await web3.eth.getBalance(walletAddress);
    if (!!balance) balance = parseBalance(balance.toString(), 18);
    else balance = 0;
  } else balance = 0;
  dispatch({
    type: SET_BALANCE,
    balance,
  });
};

export const SET_MOMA_BALANCE = 'SET_MOMA_BALANCE';
export const setMomaBalance = () => async (dispatch, getState) => {
  let { web3, walletAddress } = getState();
  let balance;
  let ctAddress;
  if (!!contractAddress) {
    if (!!contractAddress.MOMA) ctAddress = contractAddress.MOMA;
    else ctAddress = contractAddress.MOMA;

    const Moma = new web3.eth.Contract(ERC20.abi, ctAddress);
    if (walletAddress !== null)
      balance = parseBalance((await Moma.methods.balanceOf(walletAddress).call()).toString(), 18);
    else balance = 0;
    dispatch({
      type: SET_MOMA_BALANCE,
      moma: balance,
    });
  }
};

export const SET_STR_SEARCH = 'SET_STR_SEARCH';
export const setStrSearch = (strSearch) => (dispatch) => {
  dispatch({ type: SET_STR_SEARCH, strSearch });
};

////////////////////
// ERC721
////////////////////
export const INIT_ERC721 = 'INIT_ERC721';
export const INIT_ERC1155 = 'INIT_ERC1155';
export const initERC721 = (acceptedNftsAddress) => async (dispatch, getState) => {
  const { web3, nftList, walletAddress } = getState();
  let erc721Instances = [];
  // let erc1155Instances = [];
  if (!!acceptedNftsAddress) {
    for (let i = 0; i < acceptedNftsAddress.length; i++) {
      let is1155 = await nftList.methods.isERC1155(acceptedNftsAddress[i]).call();
      if (is1155) {
        // erc1155Instances.push(new web3.eth.Contract(ERC1155.abi, acceptedNftsAddress[i]));
      } else {
        erc721Instances.push(new web3.eth.Contract(ERC721.abi, acceptedNftsAddress[i]));
      }
    }

    dispatch({ type: INIT_ERC721, erc721Instances });
    // dispatch({ type: INIT_ERC1155, erc1155Instances });
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
  }
};

export const GET_OWNED_ERC721 = 'GET_OWNED_ERC721';
export const GET_OWNED_ERC1155 = 'GET_OWNED_ERC1155';
export const SET_LIST_NTTS_OWNER = 'SET_LIST_NTTS_OWNER';
export const getNFTsOfOwner = (erc721Instances, walletAddress) => async (dispatch, getState) => {
  if (!walletAddress) return;

  // const { acceptedNftsAddress, chainId } = getState();

  // Start loading
  dispatch(setLoadingErc721(true));

  let listNFTsOwner = await axiosClient.get(getAllUserErc(walletAddress));
  let erc721Tokens = await axiosClient.get(getAllUserErcFormat(walletAddress));

  // let erc1155Tokens = await listTokensERC115OfOwner(acceptedNftsAddress, walletAddress, chainId);
  // listNFTsOwner = listNFTsOwner.concat(erc1155Tokens);

  await dispatch({ type: GET_OWNED_ERC721, erc721Tokens });
  // await dispatch({ type: GET_OWNED_ERC1155, erc1155Tokens });
  await dispatch({ type: SET_LIST_NTTS_OWNER, listNFTsOwner });

  // Loading done
  dispatch(setLoadingErc721(false));
};

export const setAcceptedNftsUser = () => async (dispatch, getState) => {
  const { nftList } = getState();
  try {
    let acceptedNftsAddress = await nftList.methods.getAcceptedNFTs().call();
    acceptedNftsAddress = acceptedNftsAddress.map((value) => value.toLowerCase());
    dispatch({ type: SET_ACCEPTED_NFTS, acceptedNftsAddress });
    dispatch(initERC721(acceptedNftsAddress));
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const IS_LOADING_ERC721 = 'IS_LOADING_ERC721';
export const setLoadingErc721 = (isLoadingErc721) => async (dispatch) => {
  dispatch({
    type: IS_LOADING_ERC721,
    isLoadingErc721,
  });
};

export const transferNft = (contractAddress, to, tokenId) => async (dispatch, getState) => {
  let { walletAddress, web3, erc721Instances } = getState();
  let nftInstance = new web3.eth.Contract(ERC721.abi, contractAddress);
  try {
    await dispatch(setLoadingTx(true));
    await nftInstance.methods
      .safeTransferFrom(walletAddress, to, tokenId)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Transfer Successfully';
        dispatch(showNotification(noti));
      });

    await dispatch(setLoadingTx(false));
  } catch (error) {
    await dispatch(setLoadingTx(false));
    error.type = 'error';
    dispatch(showNotification(error));
  }
  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
};

////////////////////
// CONTRACT ADDRESS
////////////////////
export const SET_ADDRESSESPROVIDER = 'SET_ADDRESSESPROVIDER';
export const setAddressesProvider = (addressesProvider) => async (dispatch) => {
  dispatch({
    type: SET_ADDRESSESPROVIDER,
    addressesProvider,
  });
};

export const SET_NFTLIST = 'SET_NFTLIST';
export const setNftList = (nftList) => async (dispatch) => {
  dispatch({
    type: SET_NFTLIST,
    nftList,
  });
};

export const SET_VAULT = 'SET_VAULT';
export const setVault = (vault) => async (dispatch) => {
  dispatch({
    type: SET_VAULT,
    vault,
  });
};

export const SET_SELLORDERLIST = 'SET_SELLORDERLIST';
export const setSellOrderList = (sellOrderList) => async (dispatch) => {
  dispatch({
    type: SET_SELLORDERLIST,
    sellOrderList,
  });
};

export const SET_MARKET = 'SET_MARKET';
export const setMarket = (market) => async (dispatch) => {
  dispatch({
    type: SET_MARKET,
    market,
  });
};

export const SET_CREATIVESTUDIO = 'SET_CREATIVESTUDIO';
export const setCreativeStudio = (creativeStudio) => async (dispatch) => {
  dispatch({
    type: SET_CREATIVESTUDIO,
    creativeStudio,
  });
};

////////////////////
// NFTs List
////////////////////

export const registerNft = (contractAddress) => async (dispatch, getState) => {
  const { nftList, walletAddress, web3 } = getState();

  try {
    // is contract address
    let ERC721token = new web3.eth.Contract(ERC721.abi, contractAddress);
    await ERC721token.methods.name().call();
    nftList.methods
      .registerNFT(contractAddress)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Register Successfully';
        dispatch(showNotification(noti));
      });
  } catch (error) {
    error.message = 'Sorry, but this is not contract address or this address has been accepted';
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const acceptNft = (contractAddress) => async (dispatch, getState) => {
  const { nftList, walletAddress, web3 } = getState();

  try {
    // is contract address
    let ERC721token = new web3.eth.Contract(ERC721.abi, contractAddress);
    await ERC721token.methods.name().call();
    nftList.methods
      .acceptNFT(contractAddress)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Accept Successfully';
        dispatch(showNotification(noti));
      });
  } catch (error) {
    error.message = 'Sorry, but this is not contract address or this address has been accepted';
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const SET_ACCEPTED_NFTS = 'SET_ACCEPTED_NFTS';
export const setAcceptedNfts = () => async (dispatch, getState) => {
  const { nftList } = getState();
  try {
    let acceptedNftsAddress = await nftList.methods.getAcceptedNFTs().call();
    acceptedNftsAddress = acceptedNftsAddress.map((value) => value.toLowerCase());
    dispatch({ type: SET_ACCEPTED_NFTS, acceptedNftsAddress });
    dispatch(initERC721(acceptedNftsAddress));
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return error;
  }
};

////////////////////
// SellOrders List
////////////////////

export const SET_CONVERT_ERC721 = 'SET_CONVERT_ERC721';
export const SET_AVAILABLE_SELL_ORDER_1155 = 'SET_AVAILABLE_SELL_ORDER_1155';
export const SET_AVAILABLE_SELL_ORDER_721 = 'SET_AVAILABLE_SELL_ORDER_721';
export const SET_LIST_NTTS_ONSALE = 'SET_LIST_NTTS_ONSALE';
export const SET_CONVERT_ERC1155 = 'SET_CONVERT_ERC1155';
export const setAvailableSellOrder = (walletAddress) => async (dispatch, getState) => {
  const { sellOrderList } = getState();
  let listNFTsOnsale = [];

  // Loading done
  if (sellOrderList) {
    try {
      if (!!walletAddress)
        listNFTsOnsale = await axiosClient.get(getAllOrderListOfUser(walletAddress));

      let Erc721Tokens = await axiosClient.get(getAllOrderListFormat());

      let availableSellOrder721 = await axiosClient.get(getavailableSellOrderERC721());

      let convertErc721Tokens = await Promise.all(
        Erc721Tokens.map((token) => {
          let avatarData = randomAvatarGenerator.generateRandomAvatarData();
          token.avatarToken = randomAvatarGenerator.getAvatarFromData(avatarData);
          return token;
        })
      );

      dispatch({
        type: SET_LIST_NTTS_ONSALE,
        listNFTsOnsale,
      });

      dispatch({
        type: SET_AVAILABLE_SELL_ORDER_721,
        availableSellOrder721,
      });

      dispatch({
        type: SET_CONVERT_ERC721,
        convertErc721Tokens,
      });

      // dispatch({
      //   type: SET_CONVERT_ERC1155,
      //   convertErc1155Tokens,
      // });

      dispatch(setLoadingErc721(false));
    } catch (e) {
      console.log(e);
      dispatch({
        type: SET_AVAILABLE_SELL_ORDER_721,
        availableSellOrder721: [],
      });
      dispatch({
        type: SET_AVAILABLE_SELL_ORDER_1155,
        availableSellOrder1155: [],
      });
      dispatch({
        type: SET_CONVERT_ERC721,
        convertErc721Tokens: [],
      });
      dispatch({
        type: SET_CONVERT_ERC1155,
        convertErc1155Tokens: [],
      });
      return null;
    }
  }
};

export const SET_MY_SELL_ORDER = 'SET_MY_SELL_ORDER';
export const setMySellOrder = () => async (dispatch, getState) => {
  const { sellOrderList, walletAddress } = getState();
  try {
    let mySellOrder = await sellOrderList.methods.getAllSellOrderIdListByUser(walletAddress).call();
    dispatch({ type: SET_MY_SELL_ORDER, mySellOrder });
  } catch (e) {
    console.log(e);
  }
};

export const createSellOrder = (nftAddress, tokenId, price, token, is1155) => async (
  dispatch,
  getState
) => {
  const { market, walletAddress, web3, erc721Instances } = getState();
  try {
    let amount;

    if (is1155) {
    } else {
      const erc721Instance = await new web3.eth.Contract(ERC721.abi, nftAddress);

      // Check to see if nft have accepted
      let addressApproved = await erc721Instance.methods.getApproved(tokenId).call();

      if (addressApproved !== market._address)
        // Approve ERC721
        await erc721Instance.methods
          .approve(market._address, tokenId)
          .send({ from: walletAddress });

      amount = 1;
    }

    // Create Sell Order
    await market.methods
      // TODO : can sale with other token
      .createSellOrder(nftAddress, tokenId, amount, price, token)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Create Sell Order Successfully !';
        dispatch(showNotification(noti));
      });
    // Fetch new availableOrderList
    dispatch(setAvailableSellOrder());
    // get own nft
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
    return true;
  } catch (error) {
    console.log({ error });
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const SET_ALLOWANCE = 'SET_ALLOWANCE';
export const approveToken = (orderDetail) => async (dispatch, getState) => {
  const { market, walletAddress, web3 } = getState();

  if (orderDetail.token !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.token);
    const allowance = await instaneErc20.methods.allowance(walletAddress, market._address).call();
    if (parseInt(allowance) <= 0) {
      await instaneErc20.methods
        .approve(market._address, VALUE_MAX)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Approve Successfully !';
          dispatch(showNotification(noti));
          dispatch({ type: SET_ALLOWANCE, allowanceToken: VALUE_MAX });
          return true;
        })
        .on('error', (error, receipt) => {
          console.log('approveERC20: ', error);
          // message.error('Oh no! Something went wrong !');
          return false;
        });
    }
  }
};

export const buyNft = (orderDetail) => async (dispatch, getState) => {
  const { market, walletAddress, erc721Instances, chainId, web3 } = getState();
  let link = null;
  let value = 0;

  if (orderDetail.token !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.token);
    const allowance = await instaneErc20.methods.allowance(walletAddress, market._address).call();
    if (parseInt(allowance) <= 0) {
      await instaneErc20.methods
        .approve(market._address, VALUE_MAX)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Approve Successfully !';
          dispatch(showNotification(noti));
          return true;
        })
        .on('error', (error, receipt) => {
          console.log('approveERC20: ', error);
          // message.error('Oh no! Something went wrong !');
          return false;
        });
    }
  } else {
    value = orderDetail.price;
  }

  try {
    await market.methods
      .buy(orderDetail.sellId, 1, walletAddress, '0x')
      .send({ from: walletAddress, value: value })
      .on('receipt', (receipt) => {
        link = getWeb3List(chainId).explorer + receipt.transactionHash;
      });
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }

  // Fetch new availableOrderList
  dispatch(setAvailableSellOrder());
  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
  return link;
};

export const cancelSellOrder = (orderDetail) => async (dispatch, getState) => {
  const { market, walletAddress, erc721Instances } = getState();
  try {
    await dispatch(setLoadingTx(true));
    await market.methods
      .cancelSellOrder(orderDetail.sellId)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Cancel Successfully !';
        dispatch(showNotification(noti));
      });
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }

  await dispatch(setLoadingTx(false));

  // Fetch new availableOrderList
  dispatch(setAvailableSellOrder());
  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
};

export const IS_LOADING_TX = 'IS_LOADING_TX';
export const setLoadingTx = (isLoadingTx) => async (dispatch) => {
  dispatch({
    type: IS_LOADING_TX,
    isLoadingTx,
  });
};

////////////////////
// Create New NFT
////////////////////

// TODO
export const generateERC721NFT = (collectionId, tokenUri, routeFunc) => async (
  dispatch,
  getState
) => {
  const { web3, chainId, walletAddress, erc721Instances, userCollections } = getState();
  contractAddress = getContractAddress(chainId);
  let erc721Instance;
  if (collectionId !== -1) {
    erc721Instance = await new web3.eth.Contract(
      SampleERC721.abi,
      userCollections[collectionId].contractAddress
    );

    try {
      await erc721Instance.methods
        .mint(walletAddress, tokenUri, NULL_ADDRESS)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'redirect-profile';
          noti.message = 'Create Successfully !';
          noti.fn = routeFunc;
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
    }
  } else {
    erc721Instance = await new web3.eth.Contract(
      MochiERC721NFT.abi,
      contractAddress.MochiERC721NFT
    );

    try {
      await erc721Instance.methods
        .mint(tokenUri)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'redirect-profile';
          noti.message = 'Create Successfully !';
          noti.fn = routeFunc;
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
    }
  }

  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
};

// TODO
export const generateERC1155NFT = (collectionId, id, amount, tokenUri) => async (
  dispatch,
  getState
) => {
  const { web3, chainId, walletAddress, erc721Instances, userCollections } = getState();
  contractAddress = getContractAddress(chainId);
  let erc1155Instance;
  if (collectionId !== -1) {
    erc1155Instance = await new web3.eth.Contract(
      SampleERC1155.abi,
      userCollections[collectionId].contractAddress
    );

    try {
      await erc1155Instance.methods
        .mint(walletAddress, id, amount, tokenUri, NULL_ADDRESS)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Create Successfully !';
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
    }
  } else {
    erc1155Instance = await new web3.eth.Contract(
      MochiERC1155NFT.abi,
      contractAddress.MochiERC1155NFT
    );

    try {
      await erc1155Instance.methods
        .mint(amount, tokenUri, NULL_ADDRESS)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Create Successfully !';
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
    }
  }

  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
};

////////////////////
// Create Collection
////////////////////

export const SET_USER_COLLECTIONS = 'SET_USER_COLLECTIONS';
export const setCollectionByUser = () => async (dispatch, getState) => {
  let { walletAddress, creativeStudio } = getState();
  try {
    let userCollections = await creativeStudio.methods.getCollectionsByUser(walletAddress).call();
    userCollections = JSON.stringify(userCollections);
    userCollections = JSON.parse(userCollections);

    // add index in array usercollection
    let formatUserCollections = userCollections.map((userCollection, index) => {
      userCollection.index = index;
      userCollection.id = userCollection[0];
      userCollection.contractAddress = userCollection[1];
      userCollection.isERC1155 = userCollection[2];
      userCollection.creator = userCollection[3];

      return userCollection;
    });

    dispatch({ type: SET_USER_COLLECTIONS, userCollections: formatUserCollections });
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const createERC1155Collection = ({ name, symbol }) => async (dispatch, getState) => {
  let { walletAddress, creativeStudio } = getState();

  try {
    await creativeStudio.methods
      .createERC1155Collection(name, symbol)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        dispatch(setCollectionByUser());
        let noti = {};
        noti.type = 'success';
        noti.message = 'Create Successfully !';
        dispatch(showNotification(noti));
      });
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
  // get own nft
  dispatch(setAcceptedNfts());
};

export const createERC721Collection = ({ name, symbol }) => async (dispatch, getState) => {
  let { walletAddress, creativeStudio } = getState();
  try {
    await creativeStudio.methods
      .createERC721Collection(name, symbol)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        dispatch(setCollectionByUser());
        let noti = {};
        noti.type = 'success';
        noti.message = 'Create Successfully !';
        dispatch(showNotification(noti));
      });
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
  // get own nft
  dispatch(setAcceptedNfts());
};

////////////////////
// Campaign - Airdrop
////////////////////

export const SET_NFT_CLAIM_TOKEN = 'SET_NFT_CLAIM_TOKEN';
export const setNftClaimToken = (nftCampaign) => async (dispatch) => {
  dispatch({
    type: SET_NFT_CLAIM_TOKEN,
    nftCampaign,
  });
};

export const FETCH_LIST_CAMPAIGN = 'FETCH_LIST_CAMPAIGN';
export const fetchListCampaign = () => async (dispatch, getState) => {
  let { nftCampaign, web3, walletAddress } = getState();
  try {
    if (!!web3 && !!contractAddress && !!contractAddress.NFTCampaign) {
      dispatch(setLoadingCampaign(true));
      if (!nftCampaign) {
        nftCampaign = new web3.eth.Contract(NFTCampaign.abi, contractAddress.NFTCampaign);
        dispatch(setNftClaimToken(nftCampaign));
      }
      let allCampaigns = await nftCampaign.methods.getAllCaimpaigns().call();
      let listCampaignFilter = allCampaigns.filter((campaign) => campaign.status !== '3');
      let getCampaignsByOwner = [];
      const ownerContractCampaign = await nftCampaign.methods.owner().call();
      if (!!walletAddress) {
        if (walletAddress.toLowerCase() !== ownerContractCampaign.toLowerCase()) {
          getCampaignsByOwner = await nftCampaign.methods.getCampaignsByOwner(walletAddress).call();
          listCampaignFilter = listCampaignFilter.filter(
            (campaign) =>
              campaign.status === '1' || getCampaignsByOwner.includes(campaign.campaignId)
          );
        }
      } else {
        listCampaignFilter = allCampaigns.filter((campaign) => campaign.status === '1');
      }
      var getInfoCampaign = (instance) => {
        return new Promise(async (resolve) => {
          let req = await axios.get(instance.infoURL);
          let infoCampaign = { ...instance };
          infoCampaign.titleShort = req.data.titleShort ? req.data.titleShort : '';
          infoCampaign.slogan = req.data.slogan ? req.data.slogan : '';
          infoCampaign.titleDescription = req.data.titleDescription
            ? req.data.titleDescription
            : '';
          infoCampaign.description = req.data.description ? req.data.description : '';
          infoCampaign.urlIcon = req.data.urlIcon ? req.data.urlIcon : '';
          infoCampaign.urlBanner = req.data.urlBanner ? req.data.urlBanner : '';

          let balanceNFT = 0;
          let tokensYetClaim = [];
          let canCancel = false;
          let allNFTsOfOwner = [];
          if (!!walletAddress) {
            let instanceNFT = new web3.eth.Contract(ERC721.abi, instance.nftAddress);
            let tokenIds = (
              await listERC721OfOwner(instanceNFT, walletAddress, contractAddress.Market)
            ).owned;
            balanceNFT = tokenIds.length;
            if (balanceNFT > 0) {
              for (let i = 0; i < balanceNFT; i++) {
                let tokenId = tokenIds[i];
                let claimStatus = await nftCampaign.methods
                  .getClaimStatus(instance.campaignId, tokenId)
                  .call();
                if (!claimStatus) {
                  tokensYetClaim.push(tokenId);
                }
                let tokenURI = await instanceNFT.methods.tokenURI(tokenId).call();
                try {
                  let req = await axios.get(tokenURI);
                  let detail = req.data;
                  detail.tokenId = tokenId;
                  allNFTsOfOwner.push(detail);
                } catch (error) {
                  let detail = { name: 'Unnamed', description: '', tokenId };
                  allNFTsOfOwner.push(detail);
                }
              }
            }
            if (instance.campaignOwner.toLowerCase() === walletAddress.toLowerCase()) {
              canCancel = true;
            }
          }
          let instanceTokenEarn = await new web3.eth.Contract(ERC20.abi, instance.tokenAddress);
          infoCampaign.symbolTokenEarn = !!instanceTokenEarn
            ? await instanceTokenEarn.methods.symbol().call()
            : '';
          infoCampaign.balanceTokenEarn =
            !!instanceTokenEarn && !!walletAddress
              ? await instanceTokenEarn.methods.balanceOf(walletAddress).call()
              : null;
          infoCampaign.balanceNFT = !!balanceNFT ? balanceNFT : 0;
          infoCampaign.tokensYetClaim = !!tokensYetClaim ? tokensYetClaim : [];
          infoCampaign.canCancel = canCancel;
          infoCampaign.ownerContractCampaign = ownerContractCampaign;
          infoCampaign.allNFTsOfOwner = allNFTsOfOwner;
          resolve(infoCampaign);
        });
      };

      listCampaignFilter = listCampaignFilter.sort((a, b) => {
        if (a.campaignId > b.campaignId) return -1;
        if (a.campaignId < b.campaignId) return 1;
        return 0;
      });
      let listCampaign = await Promise.all(
        listCampaignFilter.map(async (instance) => {
          return await getInfoCampaign(instance);
        })
      );
      dispatch({ type: FETCH_LIST_CAMPAIGN, listCampaign });
      dispatch(setLoadingCampaign(false));
    }
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const addCampaign = (
  nftAddress,
  tokenAddress,
  totalSlots,
  amountPerSlot,
  startTime,
  endTime,
  titleShort,
  slogan,
  titleDescription,
  description,
  iconToken,
  bannerImg
) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress, web3 } = getState();
  try {
    let resultAdd = false;
    if (!!nftCampaign) {
      let contentCampaign = {
        titleShort: '',
        slogan: '',
        description: '',
        urlIcon: '',
        urlBanner: '',
      };

      const promiseIcon = new Promise(async (resolve, reject) => {
        if (!!iconToken) {
          let formData = new FormData();
          formData.append('file', iconToken);

          let ipfsHash = await uploadFileToIpfs(formData);
          resolve('https://storage.mochi.market/ipfs/' + ipfsHash);
        } else {
          resolve();
        }
      });

      const promiseBanner = new Promise(async (resolve, reject) => {
        if (!!bannerImg) {
          let formData = new FormData();
          formData.append('file', iconToken);

          let ipfsHash = await uploadFileToIpfs(formData);
          resolve('https://storage.mochi.market/ipfs/' + ipfsHash);
        } else {
          resolve();
        }
      });

      let result = await Promise.all([promiseIcon, promiseBanner]);
      contentCampaign.titleShort = titleShort ? titleShort : '';
      contentCampaign.slogan = slogan ? slogan : '';
      contentCampaign.titleDescription = titleDescription ? titleDescription : '';
      contentCampaign.description = description ? description : '';
      contentCampaign.urlIcon = result[0] ? result[0] : '';
      contentCampaign.urlBanner = result[1] ? result[1] : '';

      let ipfsHash = await uploadJsonToIpfs(contentCampaign);
      let infoURL = 'https://storage.mochi.market/ipfs/' + ipfsHash;

      amountPerSlot = web3.utils.toWei(amountPerSlot.toString(), 'ether');
      resultAdd = await nftCampaign.methods
        .registerCampaign(
          nftAddress,
          tokenAddress,
          totalSlots,
          amountPerSlot,
          startTime,
          endTime,
          infoURL
        )
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Create Campaign Successfully';
          dispatch(showNotification(noti));
          return true;
        });
    }
    return resultAdd;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const checkWhiteListNft = (addressNft) => async (dispatch, getState) => {
  let { nftList, web3 } = getState();
  try {
    if (!nftList) {
      let nftList = new web3.eth.Contract(NFTList.abi, contractAddress.NftList);
      dispatch(setNftList(nftList));
    }
    const result = await nftList.methods.isAcceptedNFT(addressNft).call();
    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const checkAllowanceCampaign = (addressToken, amount) => async (dispatch, getState) => {
  const { walletAddress, web3 } = getState();
  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    let allowance = await instaneErc20.methods
      .allowance(walletAddress, contractAddress.NFTCampaign)
      .call();
    return allowance;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const checkBalance = (addressToken) => async (dispatch, getState) => {
  const { walletAddress, web3 } = getState();
  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    let weiBalance = await instaneErc20.methods.balanceOf(walletAddress).call();
    let symbol = await instaneErc20.methods.symbol().call();
    return { weiBalance, symbol };
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
  }
};

export const approveERC20 = (addressToken, amount) => async (dispatch, getState) => {
  let { web3, walletAddress } = getState();
  try {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, addressToken);
    await instaneErc20.methods
      .approve(contractAddress.NFTCampaign, VALUE_MAX)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Approve Successfully !';
        dispatch(showNotification(noti));
        return true;
      });
  } catch (error) {
    console.log('approveERC20: ', error);
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const forceEndCampaign = (campaignId) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .forceEnd(campaignId)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Cancel Successfully !';
        dispatch(showNotification(noti));
        return true;
      });
    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const claimTokenByNFT = (campaignId, tokenIds) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .claim(campaignId, tokenIds, walletAddress)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Claim Successfully !';
        dispatch(showNotification(noti));
        return true;
      });

    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const acceptCampaign = (campaignId) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .acceptCampaign(campaignId)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Accept Campaign Successfully !';
        dispatch(showNotification(noti));
        return true;
      });

    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const SET_LOADING_CAMPAIGN = 'SET_LOADING_CAMPAIGN';
export const setLoadingCampaign = (loadingCampaign) => async (dispatch) => {
  dispatch({
    type: SET_LOADING_CAMPAIGN,
    loadingCampaign,
  });
};

export const addMoreSlots = (campaignId, slots) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .addMoreSlots(campaignId, slots)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Add More Slots Successfully !';
        dispatch(showNotification(noti));
        return true;
      });

    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const rescheduleCampaign = (campaignId, startTime, endTime) => async (
  dispatch,
  getState
) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .rescheduleCampaign(campaignId, startTime, endTime)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Change Time Successfully !';
        dispatch(showNotification(noti));
        return true;
      });

    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const extendCampaign = (campaignId, endTime) => async (dispatch, getState) => {
  let { nftCampaign, walletAddress } = getState();
  try {
    let result = await nftCampaign.methods
      .extendCampaign(campaignId, endTime)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Extend Time Successfully !';
        dispatch(showNotification(noti));
        return true;
      });
    return result;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
  }
};

export const faucetMOMA = () => async (dispatch, getState) => {
  const { walletAddress, web3 } = getState();
  try {
    if (!!walletAddress && !!contractAddress && !!contractAddress.MOMA) {
      const instaneFaucet = new web3.eth.Contract(MOMAabi.abi, contractAddress.MOMA);
      let result = await instaneFaucet.methods
        .faucet()
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          let noti = {};
          noti.type = 'success';
          noti.message = 'Faucet Successfully !';
          dispatch(showNotification(noti));
          return true;
        });
      return result;
    }
    return false;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification('Please try again in 5 minutes'));
    return false;
  }
};

export const checkFaucet = (addressToken) => async (dispatch, getState) => {
  const { walletAddress, web3 } = getState();
  try {
    if (!!walletAddress && !!contractAddress && !!contractAddress.MOMA) {
      const instaneFaucet = new web3.eth.Contract(MOMAabi.abi, contractAddress.MOMA);
      const lastTimeFaucet = await instaneFaucet.methods.userToTimestamp(walletAddress).call();
      const blockNumberLatest = await web3.eth.getBlockNumber();
      const blockLatest = await web3.eth.getBlock(blockNumberLatest);
      return blockLatest.timestamp - lastTimeFaucet >= 300;
    }
    return false;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification('Something went wrong! please try again later'));
  }
};

export const NOTI = 'NOTI';
export const showNotification = (noti) => (dispatch) => {
  dispatch({ type: NOTI, noti });
};
