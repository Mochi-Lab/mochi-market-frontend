import * as actions from 'store/actions';

const initialState = {
  // Common
  web3: null,
  chainId: null,
  walletAddress: null,
  shortAddress: null,
  adminAddress: null,
  balance: 0,
  moma: 0,
  allowanceToken: 0,
  strSearch: '',
  listNFTsOwner: null,
  listNFTsOnsale: null,
  verifiedContracts: [],
  infoCollections: {},
  infoUsers: {},
  infoAdmins: {},
  infoUserLogin: null,

  // Erc721
  erc721Instances: null,
  erc721Tokens: null,
  isLoadingErc721: null,

  //Erc1155
  erc1155Instances: null,
  erc1155Tokens: null,

  // Main contracts
  addressesProvider: null,
  nftList: null,
  vault: null,
  sellOrderList: null,
  market: null,
  creativeStudio: null,

  //NftList
  acceptedNftsAddress: [],

  //SellOrderList
  availableSellOrder721: [],
  availableSellOrder1155: [],
  convertErc721Tokens: [],
  convertErc1155Tokens: [],
  mySellOrder: [],

  //CreativeStudio
  userCollections: [],

  // Campaign - Airdrop
  nftCampaign: null,
  listCampaign: [],
  loadingCampaign: false,

  // Notification
  noti: null, // notification = {type:"success/error",message="......"}
  // Status activitys
  activity: null, // activity = { key, 'pending/success/error', 'title', duration(Number/null), 'description'}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_WEB3:
      return {
        ...state,
        web3: action.web3,
      };
    case actions.SET_ADMIN_ADDRESS:
      return {
        ...state,
        adminAddress: action.adminAddress,
      };
    case actions.SET_CHAINID:
      return {
        ...state,
        chainId: action.chainId,
      };
    case actions.SET_ADDRESS:
      return {
        ...state,
        walletAddress: action.walletAddress,
        shortAddress: action.shortAddress,
      };
    case actions.SET_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case actions.SET_MOMA_BALANCE:
      return {
        ...state,
        moma: action.moma,
      };
    case actions.SET_ALLOWANCE:
      return {
        ...state,
        allowanceToken: action.allowanceToken,
      };
    case actions.SET_STR_SEARCH:
      return {
        ...state,
        strSearch: action.strSearch,
      };
    case actions.SET_LIST_NTTS_OWNER:
      return {
        ...state,
        listNFTsOwner: action.listNFTsOwner,
      };
    case actions.SET_LIST_NTTS_ONSALE:
      return {
        ...state,
        listNFTsOnsale: action.listNFTsOnsale,
      };

    case actions.INIT_ERC721:
      return {
        ...state,
        erc721Instances: action.erc721Instances,
      };
    case actions.INIT_ERC1155:
      return {
        ...state,
        erc1155Instances: action.erc1155Instances,
      };
    case actions.GET_OWNED_ERC721:
      return {
        ...state,
        erc721Tokens: action.erc721Tokens,
      };
    case actions.GET_OWNED_ERC1155:
      return {
        ...state,
        erc1155Tokens: action.erc1155Tokens,
      };
    case actions.IS_LOADING_ERC721:
      return {
        ...state,
        isLoadingErc721: action.isLoadingErc721,
      };
    case actions.SET_ADDRESSESPROVIDER:
      return {
        ...state,
        addressesProvider: action.addressesProvider,
      };
    case actions.SET_NFTLIST:
      return {
        ...state,
        nftList: action.nftList,
      };
    case actions.SET_VAULT:
      return {
        ...state,
        vault: action.vault,
      };
    case actions.SET_SELLORDERLIST:
      return {
        ...state,
        sellOrderList: action.sellOrderList,
      };
    case actions.SET_MARKET:
      return {
        ...state,
        market: action.market,
      };
    case actions.SET_ACCEPTED_NFTS:
      return {
        ...state,
        acceptedNftsAddress: action.acceptedNftsAddress,
      };
    case actions.SET_CONVERT_ERC721:
      return {
        ...state,
        convertErc721Tokens: action.convertErc721Tokens,
      };
    case actions.SET_CONVERT_ERC1155:
      return {
        ...state,
        convertErc1155Tokens: action.convertErc1155Tokens,
      };
    case actions.SET_AVAILABLE_SELL_ORDER_721:
      return {
        ...state,
        availableSellOrder721: action.availableSellOrder721,
      };
    case actions.SET_AVAILABLE_SELL_ORDER_1155:
      return {
        ...state,
        availableSellOrder1155: action.availableSellOrder1155,
      };
    case actions.SET_MY_SELL_ORDER:
      return {
        ...state,
        mySellOrder: action.mySellOrder,
      };
    case actions.SET_CREATIVESTUDIO:
      return {
        ...state,
        creativeStudio: action.creativeStudio,
      };
    case actions.SET_USER_COLLECTIONS:
      return {
        ...state,
        userCollections: action.userCollections,
      };
    case actions.SET_NFT_CLAIM_TOKEN:
      return {
        ...state,
        nftCampaign: action.nftCampaign,
      };
    case actions.FETCH_LIST_CAMPAIGN:
      return {
        ...state,
        listCampaign: action.listCampaign,
      };
    case actions.SET_LOADING_CAMPAIGN:
      return {
        ...state,
        loadingCampaign: action.loadingCampaign,
      };
    case actions.LOGOUT:
      return {
        ...state,
        walletAddress: null,
        shortAddress: null,
        adminAddress: null,
        balance: 0,
      };
    case actions.NOTI:
      return {
        ...state,
        noti: action.noti,
      };
    case actions.ACTIVITY:
      return {
        ...state,
        activity: action.activity,
      };
    case actions.SET_VERIFIED_CONTRACTS:
      return {
        ...state,
        verifiedContracts: action.verifiedContracts,
      };
    case actions.SET_INFO_COLLECTIONS:
      return {
        ...state,
        infoCollections: action.infoCollections,
      };
    case actions.SET_INFO_USERS:
      return {
        ...state,
        infoUsers: action.infoUsers,
      };
    case actions.SET_INFO_ADMINS:
      return {
        ...state,
        infoAdmins: action.infoAdmins,
      };
    case actions.SET_INFO_USER_LOGIN:
      return {
        ...state,
        infoUserLogin: action.infoUserLogin,
      };
    default:
      return state;
  }
};

export default rootReducer;
