import bnb from 'Assets/binance-coin.svg';
import moma from 'Assets/logo-mochi.png';
import one from 'Assets/one-coin.png';

const contractAddress = {
  //BSC Mainnet
  56: {
    AddressesProvider: '0xF4Bdd04BA1872d6290D78c178c1AD95581f28B12',
    NftList: '0x722914310b1C536bDAd99f0CEf78A6f86374918F',
    Vault: '0xC3dfFF07e61DCbe790C6c33762d11a3BFCf553AB',
    SellOrderList: '0xC154dDE0Bfb17aDEC133C402328894b9443bc6c8',
    Market: '0x923E13952840cb66Eb3bbF32245b422a1cA360F2',
    CreativeStudio: '0x602332522f85c2fC29603F1e26Ff4A0A9B390FF2',
    ExchangeOrderList: '0xaf3c8bF4e213e586b31e69D9aF28b4836D7ec76c',
    NFTCampaign: '0x823437B58dB6390AE6F9bCee696788F854618c40',
    MochiERC721NFT: '0x6BC2B366ba60db1B11d5Eed4d7Ba454a972eD0F2',
    MochiERC1155NFT: '0xF3B667C44DeaDd7Ac1A32C60Bf0023a3cb18B6dA',
    MarketAdmin: '0x5B0641CD333DF2D6A48868Ce219b00Eab4b2298E',
    MOMA: '0xb72842d6f5fedf91d22d56202802bb9a79c6322e',
  },
  //BSC Testnet
  97: {
    AddressesProvider: '0x3B03c145dB30abe7205f6bBd8828Bf5efedCd7f7',
    CreativeStudio: '0x4b24D2F9d19DF53Ee8261cdD46ED3Ac9650077dc',
    ExchangeOrderList: '0x3abb7Aa54197bb0D59c9991f8ca0C71c80C79121',
    Market: '0xDD1158EAfE57e2da9F4bfB8aa0996e2Fb1bEa252',
    NftList: '0x25C2113484DD7b0BEa5ea92419C42aba18773604',
    SellOrderList: '0x1274d949d83282E3BE4b7255521Ae970d636E85f',
    Vault: '0x0CC109D580EC9b77138d60f13c84757c44cE6b5E',
    SeedifyNFT: '0xfA66C3001E0B3f9c6c203f5bBE483D121B28Ae6D',
    NFTCampaign: '0x23442A5094aC64f1B54D07a199e79738f56bdbfE',
    MochiERC721NFT: '0xE81eB5f4BA1355F6B57Ac7dF4F7d1f669946fA73',
    MochiERC1155NFT: '0x42Baf95B6F88be9a3825978Ac5E12af362A7e252',
    MOMA: '0x9980a36dFdcE320E24e2CAcB2Ac3e91022A91A2f',
  },
  // Harmony mainet
  1666600000: {
    AddressesProvider: '0x2d8AC3A928C68376D2C410c1Bbfc274A7180B311',
    NftList: '0xD54EB87F4f534FF72124E2745DD8eCce378639FE',
    Vault: '0xafdA570145F70627391A0B3A7e0dC50ACD60B948',
    SellOrderList: '0xA8981ace188C1ad21032CD4A1d582b561E307399',
    ExchangeOrderList: '0xa700cb79Cf7498Aa50cD2fDDac8d9Ae36192F938',
    CreativeStudio: '0x564662D0424bA2b47fbCF66375fEE5a3C27f2153',
    Market: '0x82663917Eb05C25881a0871F6968c8F5C9F3Eb00',
    MochiERC721NFT: '0x60D7257E61545137cd14EeDBE2C2Eb12Ee84AFdC',
    MochiERC1155NFT: '0x09a076F607B03e42AF13fD7EfEfec2c765E4f711',
    MarketAdmin: '0x6a24414449Bc450c8aC835A82615bD5c51C83110',
  },
};

const tokensPayment = {
  //BSC Mainnet
  56: [
    { address: '0xB72842D6F5feDf91D22d56202802Bb9A79C6322E', icon: moma, symbol: 'MOMA' },
    { address: '0x0000000000000000000000000000000000000000', icon: bnb, symbol: 'BNB' },
  ],
  //BSC Testnet
  97: [
    { address: '0x9980a36dFdcE320E24e2CAcB2Ac3e91022A91A2f', icon: moma, symbol: 'MOMA' },
    { address: '0x0000000000000000000000000000000000000000', icon: bnb, symbol: 'BNB' },
  ],
  1666600000: [{ address: '0x0000000000000000000000000000000000000000', icon: one, symbol: 'ONE' }],
};

const symbolToken = {
  //BSC Mainnet
  56: {
    '0xB72842D6F5feDf91D22d56202802Bb9A79C6322E': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'BNB',
  },
  //BSC Testnet
  97: {
    '0x9980a36dFdcE320E24e2CAcB2Ac3e91022A91A2f': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'BNB',
  },
  1666600000: {
    '0x0000000000000000000000000000000000000000': 'ONE',
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
