<<<<<<< HEAD
import polygon from 'Assets/polygon.png';
=======
import matic from 'Assets/matic-coin.png';
>>>>>>> polygon network
import moma from 'Assets/logo-mochi.png';

const contractAddress = {
  //Polygon Mainnet
  137: {
    AddressesProvider: '0x2d8AC3A928C68376D2C410c1Bbfc274A7180B311',
    NftList: '0xD54EB87F4f534FF72124E2745DD8eCce378639FE',
    Vault: '0xafdA570145F70627391A0B3A7e0dC50ACD60B948',
    SellOrderList: '0xA8981ace188C1ad21032CD4A1d582b561E307399',
    Market: '0x82663917Eb05C25881a0871F6968c8F5C9F3Eb00',
    CreativeStudio: '0x564662D0424bA2b47fbCF66375fEE5a3C27f2153',
    ExchangeOrderList: '0xa700cb79Cf7498Aa50cD2fDDac8d9Ae36192F938',
    NFTCampaign: '0x823437B58dB6390AE6F9bCee696788F854618c40',
    MochiERC721NFT: '0x3fA6E16489f1731354A613C86cd8bcd674BEacB6',
    MochiERC1155NFT: '0x48f97C67C03f63A927053892861485f7373053d4',
    MarketAdmin: '0x6a24414449Bc450c8aC835A82615bD5c51C83110',
    MOMA: '0xd56217853008e37cf4Aa9Bf72C2ECd4eE7813910',
  },
};

const tokensPayment = {
  137: [
    { address: '0xd56217853008e37cf4Aa9Bf72C2ECd4eE7813910', icon: moma, symbol: 'MOMA' },
    { address: '0x0000000000000000000000000000000000000000', icon: matic, symbol: 'MATIC' },
  ],
};

const symbolToken = {
  137: {
    '0xd56217853008e37cf4Aa9Bf72C2ECd4eE7813910': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'MATIC',
  },
};

export const getContractAddress = (_chainId) => {
  return contractAddress[_chainId];
};
export const getTokensPayment = (_chainId) => {
  return tokensPayment[_chainId];
};
export const getSymbol = (_chainId) => {
  return symbolToken[_chainId];
};
