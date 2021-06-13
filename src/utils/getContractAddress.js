import polygon from 'Assets/polygon.png';
import moma from 'Assets/logo-mochi.png';

const contractAddress = {
  //Polygon Mainnet
  137: {
    AddressesProvider: '0xF4Bdd04BA1872d6290D78c178c1AD95581f28B12',
    NftList: '0x722914310b1C536bDAd99f0CEf78A6f86374918F',
    Vault: '0xC3dfFF07e61DCbe790C6c33762d11a3BFCf553AB',
    SellOrderList: '0xC154dDE0Bfb17aDEC133C402328894b9443bc6c8',
    Market: '0x923E13952840cb66Eb3bbF32245b422a1cA360F2',
    CreativeStudio: '0x602332522f85c2fC29603F1e26Ff4A0A9B390FF2',
    ExchangeOrderList: '0xaf3c8bF4e213e586b31e69D9aF28b4836D7ec76c',
    NFTCampaign: '0x823437B58dB6390AE6F9bCee696788F854618c40',
    MochiERC721NFT: '0x796eac3C12bd3E6031AA8c2f8B4B610D5CA4F7B0',
    MochiERC1155NFT: '0xB55262e367074eE0F9F4F994391Cec2ebcD03251',
    MarketAdmin: '0x5B0641CD333DF2D6A48868Ce219b00Eab4b2298E',
    MOMA: '0xE3AB61371ECc88534C522922a026f2296116C109',
  },
};

const tokensPayment = {
  137: [
    { address: '0xE3AB61371ECc88534C522922a026f2296116C109', icon: moma, symbol: 'MOMA' },
    { address: '0x0000000000000000000000000000000000000000', icon: polygon, symbol: 'MATIC' },
  ],
};

const symbolToken = {
  137: {
    '0xE3AB61371ECc88534C522922a026f2296116C109': 'MOMA',
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
