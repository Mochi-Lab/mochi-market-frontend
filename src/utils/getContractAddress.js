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
    AddressesProvider: '0x58DCda8BE738526433F41a57A5F7C50CF31aC6a6',
    NftList: '0xA47448ffda2545a6F94a4405e0E3F0A724f03a25',
    Vault: '0xC8eDbEDb8D36e154E44633aEDF25BAB512cDB51E',
    SellOrderList: '0xbC3Ca88f389818a91BA2433D2d3646bdA697D56D',
    ExchangeOrderList: '0xAaC9d7C8B03781aB62bb939574eB5321679D4645',
    CreativeStudio: '0x1D05e07064119D2F7e99F4E445ce03C622C9592c',
    Market: '0x2d1C412547020705121459B8Bd34b5bEBD61a50a',
    MochiERC721NFT: '0xF477Bc11f2a8863EBe857Ed28bda611977C16c4b',
    MochiERC1155NFT: '0x1AE2608D0Ac4214865f93c6ea47F1dc2C73a5D0B',
    MarketAdmin: '0x5B0641CD333DF2D6A48868Ce219b00Eab4b2298E',
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
