import {
  parseBalance,
  listTokensERC721OfOwner,
  listTokensERC115OfOwner,
  getAllOwnersOf1155,
} from 'utils/helper';
import ERC721 from 'Contracts/ERC721.json';
import ERC1155 from 'Contracts/ERC1155.json';
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
import { getWeb3List } from 'utils/getWeb3List';
import { uploadJsonToIpfs, uploadFileToIpfs } from 'utils/ipfs';
import { getCollectionByAddress } from 'APIs/Collections/Gets';
import { getProfileByAddress } from 'APIs/Users/Gets';
import logoCollectionDefault from 'Assets/logo-mochi.png';
import avatarDefault from 'Assets/avatar-profile.png';

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

  try {
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + '/verifyAllNetwork?network=' + chainId
    );
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Error fetching data ' + data);
    }
    dispatch(setVerifiedContracts(data));
  } catch (e) {
    console.log(e);
  }

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
  localStorage.setItem('chainId', chainId);
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
export const setAddress = (walletAddress) => async (dispatch) => {
  if (walletAddress !== null) {
    var shortAddress = `${walletAddress.slice(0, 7)}...${walletAddress.slice(
      walletAddress.length - 7,
      walletAddress.length
    )}`;

    let infoUserLogin = (await dispatch(getUser(walletAddress))).user;

    dispatch({
      type: SET_ADDRESS,
      walletAddress,
      shortAddress,
    });

    dispatch({
      type: SET_INFO_USER_LOGIN,
      infoUserLogin,
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
    if (!!balance) {
      balance = parseBalance(balance.toString(), 18);
      dispatch({
        type: SET_BALANCE,
        balance,
      });
    }
  }
};

export const SET_MOMA_BALANCE = 'SET_MOMA_BALANCE';
export const setMomaBalance = () => async (dispatch, getState) => {
  let { web3, walletAddress } = getState();
  let balance;
  let ctAddress;
  if (!!contractAddress && contractAddress.MOMA.length > 0) {
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

export const SET_VERIFIED_CONTRACTS = 'SET_VERIFIED_CONTRACTS';
export const setVerifiedContracts = (verifiedContracts) => (dispatch) => {
  dispatch({ type: SET_VERIFIED_CONTRACTS, verifiedContracts });
};

export const SET_INFO_COLLECTIONS = 'SET_INFO_COLLECTIONS';
export const setInfoCollections = (infoCollections) => (dispatch) => {
  dispatch({ type: SET_INFO_COLLECTIONS, infoCollections });
};

export const SET_INFO_USERS = 'SET_INFO_USERS';
export const setInfoUsers = (infoUsers) => (dispatch) => {
  dispatch({ type: SET_INFO_USERS, infoUsers });
};

export const SET_INFO_USER_LOGIN = 'SET_INFO_USER_LOGIN';
export const setInfoUserLogin = (infoUserLogin) => (dispatch) => {
  dispatch({ type: SET_INFO_USER_LOGIN, infoUserLogin });
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

  const { acceptedNftsAddress, chainId } = getState();

  // Start loading
  dispatch(setLoadingErc721(true));

  let listNFTsOwner = [];

  // var getERC721 = (instance) => {
  //   return new Promise(async (resolve) => {
  //     let ERC721token = {};
  //     const balanceOwner = await instance.methods.balanceOf(walletAddress).call();
  //     if (balanceOwner > 0) {
  //       ERC721token.balanceOf = balanceOwner;
  //       ERC721token.name = await instance.methods.name().call();
  //       ERC721token.symbol = await instance.methods.symbol().call();
  //       ERC721token.tokens = [];
  //       if (balanceOwner > 0) {
  //         ERC721token.name = await instance.methods.name().call();
  //         ERC721token.symbol = await instance.methods.symbol().call();
  //         ERC721token.tokens = [];

  //         for (let i = 0; i < balanceOwner; i++) {
  //           let token = {};
  //           token.index = await instance.methods.tokenOfOwnerByIndex(walletAddress, i).call();
  //           token.tokenURI = await instance.methods.tokenURI(token.index).call();
  //           token.addressToken = instance._address;
  //           token.is1155 = false;
  //           ERC721token.tokens.push(token);
  //           listNFTsOwner.push(token);
  //         }
  //         resolve(ERC721token);
  //       } else {
  //         resolve();
  //       }
  //     } else {
  //       resolve();
  //     }
  //   });
  // };

  // let erc721Tokens = await Promise.all(
  //   erc721Instances.map(async (instance) => {
  //     return await getERC721(instance);
  //   })
  // );

  // erc721Tokens = erc721Tokens.filter(function (el) {
  //   return el != null;
  // });

  let erc721Tokens = await listTokensERC721OfOwner(acceptedNftsAddress, walletAddress, chainId);
  let erc1155Tokens = await listTokensERC115OfOwner(acceptedNftsAddress, walletAddress, chainId);

  listNFTsOwner = erc721Tokens.concat(erc1155Tokens);

  await dispatch({ type: GET_OWNED_ERC721, erc721Tokens });
  await dispatch({ type: GET_OWNED_ERC1155, erc1155Tokens });
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

export const transferNft = (contractAddress, to, tokenId, amount, is1155) => async (
  dispatch,
  getState
) => {
  let { walletAddress, web3, erc721Instances } = getState();
  let activity = {
    key: `transfer-${Date.now()}`,
    status: 'pending',
    title: 'Transfer',
    duration: 0,
    txHash: null,
  };
  if (is1155) {
    let nftInstance = new web3.eth.Contract(ERC1155.abi, contractAddress);
    try {
      dispatch(setStatusActivity(activity));
      await nftInstance.methods
        .safeTransferFrom(walletAddress, to, tokenId, amount, '0x')
        .send({ from: walletAddress })
        .on('transactionHash', function (txHash) {
          activity = { ...activity, txHash };
          dispatch(setStatusActivity(activity));
        })
        .on('receipt', (receipt) => {
          // let noti = {};
          // noti.type = 'success';
          // noti.message = 'Transfer Successfully';
          // dispatch(showNotification(noti));
          activity = { ...activity, status: 'success', duration: 15000 };
          dispatch(setStatusActivity(activity));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
      dispatch(setStatusActivity({ ...activity, status: 'close' }));
    }
  } else {
    let nftInstance = new web3.eth.Contract(ERC721.abi, contractAddress);
    try {
      dispatch(setStatusActivity(activity));
      await nftInstance.methods
        .safeTransferFrom(walletAddress, to, tokenId)
        .send({ from: walletAddress })
        .on('receipt', (receipt) => {
          // let noti = {};
          // noti.type = 'success';
          // noti.message = 'Transfer Successfully';
          // dispatch(showNotification(noti));
          dispatch(setStatusActivity({ ...activity, status: 'success', duration: 15000 }));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
      dispatch(setStatusActivity({ ...activity, status: 'close' }));
    }
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

export const registerNft = (contractAddress, isERC1155) => async (dispatch, getState) => {
  const { nftList, walletAddress } = getState();

  try {
    // is contract address
    // let ERC721token = new web3.eth.Contract(ERC721.abi, contractAddress);
    // await ERC721token.methods.name().call();
    await nftList.methods
      .registerNFT(contractAddress, isERC1155)
      .send({ from: walletAddress })
      .on('receipt', (receipt) => {
        let noti = {};
        noti.type = 'success';
        noti.message = 'Register Successfully';
        dispatch(showNotification(noti));
      });
    return true;
  } catch (error) {
    error.message = 'Sorry, but this is not contract address or this address has been accepted';
    error.type = 'error';
    dispatch(showNotification(error));
    return false;
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
    // dispatch(showNotification(error));
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
  const { sellOrderList, web3, chainId } = getState();
  let listNFTsOnsale = [];
  let infoCollections = {};

  const pushErc721 = async (listNftContract) => {
    let ERC721token = { name: '', symbol: '', avatarToken: '', tokens: [] };
    let resCollection = await dispatch(getCollection(listNftContract.nftAddress, infoCollections));
    infoCollections = resCollection.infoCollections;
    ERC721token.addressToken = listNftContract.nftAddress;
    ERC721token.name = resCollection.collection.name;
    ERC721token.symbol = await listNftContract.instance.methods.symbol().call();
    ERC721token.avatarToken = resCollection.collection.logo;

    ERC721token.tokens = await Promise.all(
      listNftContract.tokenId.map(async (order, index) => {
        let token = {};
        token.index = order.id;
        token.tokenURI = await listNftContract.instance.methods.tokenURI(order.id).call();
        token.addressToken = listNftContract.instance._address;
        token.price = listNftContract.price[index];
        token.nameCollection = ERC721token.name;
        token.symbolCollections = ERC721token.symbol;
        token.sortIndex = order.sortIndex;
        token.tokenPayment = listNftContract.tokenPayment[index];
        token.seller = listNftContract.seller[index];
        token.sellId = listNftContract.sellId[index];
        token.is1155 = false;
        if (
          !!walletAddress &&
          listNftContract.seller[index].toLowerCase() === walletAddress.toLowerCase()
        ) {
          listNFTsOnsale.push(token);
        }

        return token;
      })
    );
    return ERC721token;
  };

  const pushErc1155 = async (listNftContract) => {
    let ERC1155token = { name: '', avatarToken: '', tokens: [] };
    let resCollection = await dispatch(getCollection(listNftContract.nftAddress, infoCollections));
    infoCollections = resCollection.infoCollections;
    ERC1155token.name = resCollection.collection.name;
    ERC1155token.addressToken = listNftContract.nftAddress;
    ERC1155token.tokenId = listNftContract.tokenId[0].id;
    ERC1155token.avatarToken = resCollection.collection.logo;

    ERC1155token.tokens = await Promise.all(
      listNftContract.tokenId.map(async (order, index) => {
        let token = {};
        token.index = order.id;
        token.addressToken = listNftContract.nftAddress;
        token.price = listNftContract.price[index];
        token.nameCollection = ERC1155token.name;
        token.symbolCollections = ERC1155token.symbol;
        token.sortIndex = order.sortIndex;
        token.tokenPayment = listNftContract.tokenPayment[index];
        token.seller = listNftContract.seller[index];
        token.amount = listNftContract.amount[index];
        token.sellId = listNftContract.sellId[index];
        token.value = listNftContract.amount[index];
        token.soldAmount = listNftContract.soldAmount[index];
        token.is1155 = true;
        token.totalSupply = (
          await getAllOwnersOf1155(listNftContract.nftAddress, order.id, chainId, '')
        ).totalSupply;
        if (
          !!walletAddress &&
          listNftContract.seller[index].toLowerCase() === walletAddress.toLowerCase()
        ) {
          listNFTsOnsale.push(token);
        }

        return token;
      })
    );
    return ERC1155token;
  };

  // Loading done
  if (sellOrderList) {
    try {
      let availableSellOrderIdList = await sellOrderList.methods
        .getAvailableSellOrdersIdList()
        .call();
      let availableSellOrderERC721 = await sellOrderList.methods
        .getSellOrdersByIdList(availableSellOrderIdList.resultERC721)
        .call();

      let availableSellOrderERC1155 = await sellOrderList.methods
        .getSellOrdersByIdList(availableSellOrderIdList.resultERC1155)
        .call();

      var convertErc721Tokens = [];
      var listNftContracts721 = [];

      if (!!availableSellOrderERC721) {
        availableSellOrderERC721.map(async (sellOrder, i) => {
          let token = {
            sellId: [],
            tokenId: [],
            price: [],
            tokenPayment: [],
            seller: [],
            amount: [],
          };
          let nftindex = listNftContracts721.findIndex(
            (nft) => nft.nftAddress === sellOrder.nftAddress
          );
          if (nftindex === -1) {
            //cant fine nft in list => nft in a new collection
            token.nftAddress = sellOrder.nftAddress;
            token.instance = new web3.eth.Contract(ERC721.abi, sellOrder.nftAddress);
            token.tokenId.push({ sortIndex: i, id: sellOrder.tokenId });
            token.price.push(sellOrder.price);
            token.tokenPayment.push(sellOrder.token);
            token.seller.push(sellOrder.seller);
            token.amount.push(sellOrder.amount);
            token.sellId.push(sellOrder.sellId);
            listNftContracts721.push(token);
          } else {
            // push nft to existing collection
            listNftContracts721[nftindex].tokenId.push({ sortIndex: i, id: sellOrder.tokenId });
            listNftContracts721[nftindex].price.push(sellOrder.price);
            listNftContracts721[nftindex].tokenPayment.push(sellOrder.token);
            listNftContracts721[nftindex].seller.push(sellOrder.seller);
            listNftContracts721[nftindex].amount.push(sellOrder.amount);
            listNftContracts721[nftindex].sellId.push(sellOrder.sellId);
          }
        });
      }

      convertErc721Tokens = await Promise.all(
        listNftContracts721.map(async (listNftcontract) => {
          return await pushErc721(listNftcontract);
        })
      );

      var convertErc1155Tokens = [];
      var listNftContracts1155 = [];
      if (!!availableSellOrderERC1155 && availableSellOrderERC1155.length > 0) {
        availableSellOrderERC1155.map(async (sellOrder, i) => {
          let token = {
            sellId: [],
            tokenId: [],
            price: [],
            tokenPayment: [],
            seller: [],
            amount: [],
            soldAmount: [],
          };

          let nftindex = listNftContracts1155.findIndex(
            (nft) => nft.nftAddress.toLowerCase() === sellOrder.nftAddress.toLowerCase()
          );

          if (nftindex === -1) {
            //cant fine nft in list => nft in a new collection
            token.nftAddress = sellOrder.nftAddress;
            token.instance = new web3.eth.Contract(SampleERC1155.abi, sellOrder.nftAddress);
            token.tokenId.push({ sortIndex: i, id: sellOrder.tokenId });
            token.price.push(sellOrder.price);
            token.tokenPayment.push(sellOrder.token);
            token.seller.push(sellOrder.seller);
            token.amount.push(sellOrder.amount);
            token.sellId.push(sellOrder.sellId);
            token.soldAmount.push(sellOrder.soldAmount);
            listNftContracts1155.push(token);
          } else {
            // push nft to existing collection
            listNftContracts1155[nftindex].tokenId.push({ sortIndex: i, id: sellOrder.tokenId });
            listNftContracts1155[nftindex].price.push(sellOrder.price);
            listNftContracts1155[nftindex].tokenPayment.push(sellOrder.token);
            listNftContracts1155[nftindex].seller.push(sellOrder.seller);
            listNftContracts1155[nftindex].amount.push(sellOrder.amount);
            listNftContracts1155[nftindex].sellId.push(sellOrder.sellId);
            listNftContracts1155[nftindex].soldAmount.push(sellOrder.soldAmount);
          }
        });
      }

      convertErc1155Tokens = await Promise.all(
        listNftContracts1155.map(async (listNftcontract) => {
          return await pushErc1155(listNftcontract);
        })
      );

      dispatch({
        type: SET_LIST_NTTS_ONSALE,
        listNFTsOnsale,
      });

      dispatch({
        type: SET_AVAILABLE_SELL_ORDER_721,
        availableSellOrder721: availableSellOrderERC721,
      });
      dispatch({
        type: SET_AVAILABLE_SELL_ORDER_1155,
        availableSellOrder1155: availableSellOrderERC1155,
      });
      dispatch({
        type: SET_CONVERT_ERC721,
        convertErc721Tokens,
        convertErc1155Tokens,
      });
      dispatch({
        type: SET_CONVERT_ERC1155,
        convertErc1155Tokens,
      });
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

export const createSellOrder = (nftAddress, tokenId, price, tokenPayment, amount, is1155) => async (
  dispatch,
  getState
) => {
  const { market, walletAddress, web3, erc721Instances, sellOrderList } = getState();
  let activity = {
    key: `sell-${Date.now()}`,
    status: 'pending',
    title: 'Sell',
    duration: 0,
    txHash: null,
  };
  try {
    if (is1155) {
      const erc1155Instance = await new web3.eth.Contract(ERC1155.abi, nftAddress);
      // Check to see if nft have accepted
      let isApprovedForAll = await erc1155Instance.methods
        .isApprovedForAll(walletAddress, market._address)
        .call();

      if (!isApprovedForAll) {
        let activity = {
          key: `approve-${Date.now()}`,
          status: 'pending',
          title: 'Approve',
          duration: 0,
          txHash: null,
        };

        dispatch(setStatusActivity(activity));
        // Approve ERC1155
        try {
          await erc1155Instance.methods
            .setApprovalForAll(market._address, true)
            .send({ from: walletAddress })
            .on('transactionHash', function (txHash) {
              activity = { ...activity, txHash };
              dispatch(setStatusActivity(activity));
            });
          activity = { ...activity, status: 'success', duration: 15000 };
          dispatch(setStatusActivity(activity));
        } catch (error) {
          dispatch(setStatusActivity({ ...activity, status: 'close' }));
          return false;
        }
      }
    } else {
      const erc721Instance = await new web3.eth.Contract(ERC721.abi, nftAddress);

      // Check to see if nft have accepted
      let addressApproved = await erc721Instance.methods
        .isApprovedForAll(walletAddress, market._address)
        .call();

      if (!addressApproved) {
        // if not approved
        let activity = {
          key: `approve-${Date.now()}`,
          status: 'pending',
          title: 'Approve',
          duration: 0,
          txHash: null,
        };
        dispatch(setStatusActivity(activity));

        // Approve All ERC721
        try {
          await erc721Instance.methods
            .setApprovalForAll(market._address, true)
            .send({ from: walletAddress })
            .on('transactionHash', function (txHash) {
              activity = { ...activity, txHash };
              dispatch(setStatusActivity(activity));
            });
          activity = { ...activity, status: 'success', duration: 15000 };
          dispatch(setStatusActivity(activity));
        } catch (error) {
          dispatch(setStatusActivity({ ...activity, status: 'close' }));
          return false;
        }
      }
    }

    // Create Sell Order
    dispatch(setStatusActivity(activity));
    await market.methods
      // TODO : can sale with other tokenPayment
      .createSellOrder(nftAddress, tokenId, amount, price, tokenPayment)
      .send({ from: walletAddress })
      .on('transactionHash', function (txHash) {
        activity = { ...activity, txHash };
        dispatch(setStatusActivity(activity));
      })
      .on('receipt', (receipt) => {
        // let noti = {};
        // noti.type = 'success';
        // noti.message = 'Create Sell Order Successfully !';
        // dispatch(showNotification(noti));
        activity = { ...activity, status: 'success', duration: 15000 };
        dispatch(setStatusActivity(activity));
      });
    // Fetch new availableOrderList
    dispatch(setAvailableSellOrder());
    // get own nft
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));

    let orders = await sellOrderList.methods
      .getAvailableSellOrdersIdListByUser(walletAddress)
      .call();
    return {
      status: true,
      sellId: is1155 ? orders.resultERC1155.slice(-1) : orders.resultERC721.slice(-1),
    };
  } catch (error) {
    console.log({ error });
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
    return { status: false, sellId: null };
  }
};

export const SET_ALLOWANCE = 'SET_ALLOWANCE';
export const approveToken = (orderDetail) => async (dispatch, getState) => {
  const { market, walletAddress, web3 } = getState();
  if (orderDetail.tokenPayment !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.tokenPayment);
    const allowance = await instaneErc20.methods.allowance(walletAddress, market._address).call();
    if (parseInt(allowance) <= 0) {
      let activity = {
        key: `approve-${Date.now()}`,
        status: 'pending',
        title: 'Approve',
        duration: 0,
        txHash: null,
      };
      dispatch(setStatusActivity(activity));
      await instaneErc20.methods
        .approve(market._address, VALUE_MAX)
        .send({ from: walletAddress })
        .on('transactionHash', function (txHash) {
          activity = { ...activity, txHash };
          dispatch(setStatusActivity(activity));
        })
        .on('receipt', (receipt) => {
          // let noti = {};
          // noti.type = 'success';
          // noti.message = 'Approve Successfully !';
          // dispatch(showNotification(noti));
          activity = { ...activity, status: 'success', duration: 15000 };
          dispatch(setStatusActivity(activity));
          dispatch({ type: SET_ALLOWANCE, allowanceToken: VALUE_MAX });
          return true;
        })
        .on('error', (error, receipt) => {
          console.log('approveERC20: ', error);
          dispatch(setStatusActivity({ ...activity, status: 'close' }));
          return false;
        });
    }
  }
};

export const buyNft = (orderDetail, is1155) => async (dispatch, getState) => {
  const { market, walletAddress, erc721Instances, chainId, web3 } = getState();
  let link = null;
  let value = 0;
  if (orderDetail.tokenPayment !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.tokenPayment);
    const allowance = await instaneErc20.methods.allowance(walletAddress, market._address).call();
    if (parseInt(allowance) <= 0) {
      let activity = {
        key: `approve-${Date.now()}`,
        status: 'pending',
        title: 'Approve',
        duration: 0,
        txHash: null,
      };

      dispatch(setStatusActivity(activity));
      await instaneErc20.methods
        .approve(market._address, VALUE_MAX)
        .send({ from: walletAddress })
        .on('transactionHash', function (txHash) {
          activity = { ...activity, txHash };
          dispatch(setStatusActivity(activity));
        })
        .on('receipt', (receipt) => {
          // let noti = {};
          // noti.type = 'success';
          // noti.message = 'Approve Successfully !';
          // dispatch(showNotification(noti));
          activity = { ...activity, status: 'success', duration: 15000 };
          dispatch(setStatusActivity(activity));
          return true;
        })
        .on('error', (error, receipt) => {
          console.log('approveERC20: ', error);
          dispatch(setStatusActivity({ ...activity, status: 'close' }));
          return false;
        });
    }
  } else {
    value = orderDetail.price;
  }

  let activity = {
    key: `buy-${Date.now()}`,
    status: 'pending',
    title: 'Buy',
    duration: 0,
    txHash: null,
  };
  try {
    dispatch(setStatusActivity(activity));
    await market.methods
      .buy(orderDetail.sellId, is1155 ? orderDetail.amount : 1, walletAddress, '0x')
      .send({ from: walletAddress, value: value })
      .on('transactionHash', function (txHash) {
        activity = { ...activity, txHash };
        dispatch(setStatusActivity(activity));
      })
      .on('receipt', (receipt) => {
        activity = { ...activity, status: 'success', duration: 15000 };
        dispatch(setStatusActivity(activity));
        link = getWeb3List(chainId).explorer + receipt.transactionHash;
      });

    // Fetch new availableOrderList
    dispatch(setAvailableSellOrder());
    // get own nft
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
    return { status: true, link };
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
    return { status: false, link: null };
  }
};

export const updatePrice = (sellId, newPrice) => async (dispatch, getState) => {
  const { market, walletAddress, erc721Instances } = getState();
  let activity = {
    key: `update-price-${Date.now()}`,
    status: 'pending',
    title: 'Update Price',
    duration: 0,
    txHash: null,
  };
  try {
    await market.methods
      .updatePrice(sellId, newPrice)
      .send({ from: walletAddress })
      .on('transactionHash', (txHash) => {
        activity = { ...activity, txHash };
        dispatch(setStatusActivity(activity));
      });

    // Fetch new availableOrderList
    dispatch(setAvailableSellOrder());
    // get own nft
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
    activity = { ...activity, status: 'success', duration: 15000 };
    dispatch(setStatusActivity(activity));
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
    return false;
  }
};

export const cancelSellOrder = (orderDetail) => async (dispatch, getState) => {
  const { market, walletAddress, erc721Instances } = getState();
  let activity = {
    key: `cancel-${Date.now()}`,
    status: 'pending',
    title: 'Cancel',
    duration: 0,
    txHash: null,
  };
  try {
    dispatch(setStatusActivity(activity));
    await market.methods
      .cancelSellOrder(orderDetail.sellId)
      .send({ from: walletAddress })
      .on('transactionHash', (txHash) => {
        activity = { ...activity, txHash };
        dispatch(setStatusActivity(activity));
      });

    // Fetch new availableOrderList
    dispatch(setAvailableSellOrder());
    // get own nft
    dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
    activity = { ...activity, status: 'success', duration: 15000 };
    dispatch(setStatusActivity(activity));

    return true;
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
    return false;
  }
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
      // dispatch(showNotification(error));
      console.log(error);
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
      // dispatch(showNotification(error));
      console.log(error);
    }
  }

  // get own nft
  dispatch(getNFTsOfOwner(erc721Instances, walletAddress));
};

// TODO
export const generateERC1155NFT = (collectionId, id, amount, tokenUri, routeFunc) => async (
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
          noti.type = 'redirect-profile';
          noti.message = 'Create Successfully !';
          noti.fn = routeFunc;
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      // dispatch(showNotification(error));
      console.log(error);
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
          noti.type = 'redirect-profile';
          noti.message = 'Create Successfully !';
          noti.fn = routeFunc;
          dispatch(showNotification(noti));
        });
    } catch (error) {
      error.type = 'error';
      // dispatch(showNotification(error));
      console.log(error);
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
    // dispatch(showNotification(error));
    console.log(error);
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
            let tokenIds = await listTokensERC721OfOwner(
              instanceNFT,
              walletAddress,
              contractAddress.Market
            );
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
    // dispatch(showNotification(error));
    console.log(error);
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
    // dispatch(showNotification(error));
    console.log(error);
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
    // dispatch(showNotification(error));
    console.log(error);
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

export const ACTIVITY = 'ACTIVITY';
export const setStatusActivity = (activity) => (dispatch) => {
  dispatch({ type: ACTIVITY, activity });
};

// Collection
export const getCollection = (addressToken, _collections) => async (dispatch, getState) => {
  addressToken = addressToken.toLowerCase();
  const { web3, nftList, chainId, infoCollections } = getState();
  let collections = !!_collections ? _collections : infoCollections;
  let collection;
  if (!!collections[addressToken]) {
    collection = collections[addressToken];
  } else {
    let res;

    if (!collections[addressToken]) {
      res = await getCollectionByAddress(addressToken, chainId);
    }

    if (!!res && !!res.collection) {
      collection = res.collection;
      if (!collection.name) collection.name = 'Unnamed';
      if (!res.collection.name) res.collection.name = 'Unnamed';
      collections[addressToken] = res.collection;
      dispatch(setInfoCollections(collections));
    } else {
      if (web3 && nftList) {
        let nameCollection;
        let is1155 = await nftList.methods.isERC1155(addressToken).call();
        let tokenURI;
        if (!!is1155) {
          const erc1155Instances = await new web3.eth.Contract(SampleERC1155.abi, addressToken);
          try {
            tokenURI = await erc1155Instances.methods.uri().call();
          } catch (error) {
            tokenURI = null;
          }
          try {
            nameCollection = await erc1155Instances.methods.name().call();
          } catch (error) {
            nameCollection = null;
          }
        } else {
          const erc721Instances = await new web3.eth.Contract(SampleERC721.abi, addressToken);
          try {
            nameCollection = await erc721Instances.methods.name().call();
          } catch (error) {
            nameCollection = null;
          }
        }

        if (!nameCollection && !!tokenURI) {
          try {
            let req = await axios.get(tokenURI);
            const data = req.data;

            nameCollection = !!data.name ? data.name : 'Unnamed';
          } catch (error) {
            nameCollection = 'Unnamed';
          }
        } else if (!nameCollection && !tokenURI) {
          nameCollection = 'Unnamed';
        }

        collection = { name: nameCollection, logo: logoCollectionDefault, addressToken, chainId };
        collections[addressToken] = collection;
        dispatch(setInfoCollections(collections));
      }
    }
  }

  return { collection, infoCollections: collections };
};

// user
export const getUser = (walletAddress, _users) => async (dispatch, getState) => {
  walletAddress = walletAddress.toLowerCase();
  const { infoUsers } = getState();
  let users = !!_users ? _users : infoUsers;
  let user;
  if (!!users[walletAddress]) {
    user = users[walletAddress];
  } else {
    let res;
    if (!users[walletAddress]) {
      try {
        res = await getProfileByAddress(walletAddress);
      } catch (error) {
        res = null;
      }
    }

    if (!!res && !!res.user) {
      user = res.user;
      users[walletAddress] = res.user;
      dispatch(setInfoUsers(users));
    } else {
      user = { username: 'Unnamed', avatar: avatarDefault };
      users[walletAddress] = user;
      dispatch(setInfoUsers(users));
    }
  }

  return { user, infoUsers: users };
};
