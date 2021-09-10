import {
  parseBalance,
  listTokensERC721OfOwner,
  listTokensERC115OfOwner,
  listTokenERC721OfOwnerCQT,
} from 'utils/helper';
import ERC721 from 'Contracts/ERC721.json';
import ERC1155 from 'Contracts/ERC1155.json';
import AddressesProvider from 'Contracts/AddressesProvider.json';
import Market from 'Contracts/Market.json';
import NFTList from 'Contracts/NFTList.json';
import SellOrderList from 'Contracts/SellOrderList.json';
import ERC20 from 'Contracts/ERC20.json';
import MOMAabi from 'Contracts/MOMAabi.json';
import { getContractAddress } from 'utils/getContractAddress';
import { getWeb3List } from 'utils/getWeb3List';
import { getCollectionByAddress } from 'APIs/Collections/Gets';
import { getProfileByAddress, getAdminAll } from 'APIs/Users/Gets';
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

  dispatch(setAddressesProvider(addressesProvider));
  dispatch(setMarket(market));
  dispatch(setNftList(nftList));
  dispatch(setSellOrderList(sellOrderList));
  dispatch(setAcceptedNftsUser());
  dispatch(setAdminAddress(addressesProvider));
};

export const LOGOUT = 'LOGOUT';
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

export const SET_CHAINID = 'SET_CHAINID';
export const setChainId = (chainId) => async (dispatch) => {
  localStorage.setItem('chainId', chainId);
  dispatch({ type: SET_CHAINID, chainId });

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
    await dispatch(getAllAdmins());
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
  }
};

export const SET_BALANCE = 'SET_BALANCE';
export const setBalance = (walletAddress) => async (dispatch, getState) => {
  let { web3 } = getState();
  let balance;
  if (!!walletAddress) {
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
export const setMomaBalance = (walletAddress) => async (dispatch, getState) => {
  let { web3 } = getState();
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
export const SET_INFO_ADMINS = 'SET_INFO_ADMINS';
export const setInfoAdmins = (infoAdmins) => (dispatch) => {
  dispatch({ type: SET_INFO_ADMINS, infoAdmins });
};

export const SET_INFO_USER_LOGIN = 'SET_INFO_USER_LOGIN';
export const setInfoUserLogin = (infoUserLogin) => (dispatch) => {
  dispatch({ type: SET_INFO_USER_LOGIN, infoUserLogin });
};

export const GET_OWNED_ERC721 = 'GET_OWNED_ERC721';
export const GET_OWNED_ERC1155 = 'GET_OWNED_ERC1155';
export const SET_LIST_NTTS_OWNER = 'SET_LIST_NTTS_OWNER';
export const getNFTsOfOwner = (walletAddress) => async (dispatch, getState) => {
  const { acceptedNftsAddress, chainId, web3 } = getState();

  if (!!walletAddress && !!chainId) {
    // Start loading
    dispatch(setLoadingErc721(true));
    let listNFTsOwner = [];
    let erc721Tokens;
    if (parseInt(chainId) === 56) {
      erc721Tokens = await listTokenERC721OfOwnerCQT(
        acceptedNftsAddress,
        walletAddress,
        chainId,
        web3
      );
    } else {
      erc721Tokens = await listTokensERC721OfOwner(acceptedNftsAddress, walletAddress, chainId);
    }

    let erc1155Tokens = await listTokensERC115OfOwner(acceptedNftsAddress, walletAddress, chainId);

    listNFTsOwner = erc721Tokens.concat(erc1155Tokens);

    await dispatch({ type: GET_OWNED_ERC721, erc721Tokens });
    await dispatch({ type: GET_OWNED_ERC1155, erc1155Tokens });
    await dispatch({ type: SET_LIST_NTTS_OWNER, listNFTsOwner });

    // Loading done
    dispatch(setLoadingErc721(false));
  }
};

export const setAcceptedNftsUser = () => async (dispatch, getState) => {
  const { nftList } = getState();
  try {
    let acceptedNftsAddress = await nftList.methods.getAcceptedNFTs().call();
    acceptedNftsAddress = acceptedNftsAddress.map((value) => value.toLowerCase());
    dispatch({ type: SET_ACCEPTED_NFTS, acceptedNftsAddress });
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
  let { walletAddress, web3 } = getState();
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
          dispatch(setStatusActivity({ ...activity, status: 'success', duration: 15000 }));
        });
    } catch (error) {
      error.type = 'error';
      dispatch(showNotification(error));
      dispatch(setStatusActivity({ ...activity, status: 'close' }));
    }
  }
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
  } catch (error) {
    error.type = 'error';
    // dispatch(showNotification(error));
    return error;
  }
};

export const createSellOrder = (nftAddress, tokenId, price, tokenPayment, amount, is1155) => async (
  dispatch,
  getState
) => {
  const { market, walletAddress, web3, sellOrderList } = getState();
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
        activity = { ...activity, status: 'success', duration: 15000 };
        dispatch(setStatusActivity(activity));
      });
    // Fetch new availableOrderList
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
  if (orderDetail.token !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.token);
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
  const { market, walletAddress, chainId, web3 } = getState();
  let link = null;
  let value = 0;
  if (orderDetail.token !== NULL_ADDRESS) {
    const instaneErc20 = new web3.eth.Contract(ERC20.abi, orderDetail.token);
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
    value = web3.utils.toWei((orderDetail.amount * orderDetail.price).toString(), 'ether');
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

    return { status: true, link };
  } catch (error) {
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
    return { status: false, link: null };
  }
};

export const updatePrice = (sellId, newPrice) => async (dispatch, getState) => {
  const { market, walletAddress } = getState();
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
  const { market, walletAddress } = getState();
  let activity = {
    key: `cancel-${Date.now()}`,
    status: 'pending',
    title: 'Cancel',
    duration: 0,
    txHash: null,
  };
  try {
    dispatch(setStatusActivity(activity));
    const estimateGasUsed = await market.methods.cancelSellOrder(orderDetail.sellId).estimateGas({ from: walletAddress })
    console.log("estimateGasUsed = ", estimateGasUsed);
    await market.methods
      .cancelSellOrder(orderDetail.sellId)
      .send({ from: walletAddress })
      .on('transactionHash', (txHash) => {
        activity = { ...activity, txHash };
        dispatch(setStatusActivity(activity));
      });

    activity = { ...activity, status: 'success', duration: 15000 };
    dispatch(setStatusActivity(activity));

    return true;
  } catch (error) {
    console.log("error", error);
    error.type = 'error';
    dispatch(showNotification(error));
    dispatch(setStatusActivity({ ...activity, status: 'close' }));
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
  const { chainId, infoCollections } = getState();
  let collections = !!_collections ? _collections : infoCollections;
  let collection;

  if (!!collections[addressToken]) {
    collection = collections[addressToken];
    return { collection, infoCollections: collections };
  }

  if (!collections[addressToken]) {
    let res = await getCollectionByAddress(addressToken, chainId);

    if (!!res && !!res.collection) {
      collection = res.collection;
      if (!collection.name) collection.name = 'Unnamed';
      collections[addressToken] = res.collection;
      dispatch(setInfoCollections(collections));
      return { collection, infoCollections: collections };
    }

    if (!res || !res.collection) {
      collection = { name: 'Unnamed', logo: logoCollectionDefault, addressToken, chainId };
      collections[addressToken] = collection;
      dispatch(setInfoCollections(collections));
      return { collection, infoCollections: collections };
    }
  }
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

// Admin
export const getAllAdmins = () => async (dispatch, getState) => {
  let res = await getAdminAll();
  if (!!res && !!res.admins) {
    let admins = res.admins;
    let listAdmin = {};
    admins.forEach((e) => (listAdmin[e.address.toLowerCase()] = e));
    dispatch(setInfoAdmins(listAdmin));
  } else {
    dispatch(setInfoAdmins({}));
  }
};
