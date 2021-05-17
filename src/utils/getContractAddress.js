import bnb from 'Assets/binance-coin.svg';
import moma from 'Assets/logo-mochi.png';

const contractAddress = {
  //BSC Mainnet
  56: {
    AddressesProvider: '0xc6732Eb8A138052D9e3DFEB66cB0175C94f7e970',
    NftList: '0xC8224F5511fae865793B4235b1aA02011637e742',
    Vault: '0xDa5F1f8d32C094a6c0fc21319bA2E5a64265C429',
    SellOrderList: '0x4786999b7Ebb24876B2bD4705ecc89ECeebDa559',
    Market: '0xc6A8101003d7d2ce14BD344e3df23E4AAfd77899',
    CreativeStudio: '0xa5dD241c1A9A9826fB8E78c7db4dc8fdD3043b66',
    ExchangeOrderList: '0x37ca1D6c7479F3Eb9d6d10309e6f0C611E6bE48F',
    Mochi: '0xB72842D6F5feDf91D22d56202802Bb9A79C6322E',
    NFTCampaign: '0x823437B58dB6390AE6F9bCee696788F854618c40',
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
