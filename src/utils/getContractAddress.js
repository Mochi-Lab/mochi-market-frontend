import bnb from 'Assets/icons/binance-smart-chain-icon.png';
import polygon from 'Assets/icons/polygon-icon.png';
import moma from 'Assets/logo-mochi.png';
import one from 'Assets/one-coin.png';
import movr from 'Assets/logo/moonriver.png';
import eightbit from 'Assets/logo/8bit.png';

import bscTag from 'Assets/logo/bsc.png';
import polygonTag from 'Assets/logo/polygon.png';
import harmonyTag from 'Assets/logo/harmony.png';
import movrTag from 'Assets/logo/moonriver.png';

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
    AddressesProvider: '0x76860AE8bD4AEdB07B5132077B3d5d008372A508',
    CreativeStudio: '0x26Cc9D8E0f03DFFCb4871F28Eb180cF4EE243f10',
    ExchangeOrderList: '0xD42A02bF1f9a4312A562513Fa16BA92FC5a1481c',
    Market: '0x853e7F20ab4490C6de165dAdfFb279Fb7AD79Ca2',
    NftList: '0xb3CE71FB88D9D2949dDc2a1c31004653D77415d1',
    SellOrderList: '0xA8485f0D7B8fB88aC124876733ed7e5bE68169a2',
    Vault: '0x544F79e54111d2B8e389fEBf9f7d41F62FEb9372',
    SeedifyNFT: '0xfA66C3001E0B3f9c6c203f5bBE483D121B28Ae6D',
    NFTCampaign: '0x23442A5094aC64f1B54D07a199e79738f56bdbfE',
    MochiERC721NFT: '0x3047A0d0dd41F24cBC8f54c512e96c81f990ba76',
    MochiERC1155NFT: '0x26Db9D95e8Be4Acaeee493448f28A9e7c62e7a0C',
    MOMA: '0x777d20e16c6bc508d5989e81a6c9b5034a32c6dd',
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
    MOMA: '',
  },
  1285: {
    AddressesProvider: '0xF4Bdd04BA1872d6290D78c178c1AD95581f28B12',
    NftList: '0x722914310b1C536bDAd99f0CEf78A6f86374918F',
    Vault: '0xC3dfFF07e61DCbe790C6c33762d11a3BFCf553AB',
    SellOrderList: '0xC154dDE0Bfb17aDEC133C402328894b9443bc6c8',
    ExchangeOrderList: '0xaf3c8bF4e213e586b31e69D9aF28b4836D7ec76c',
    CreativeStudio: '0x7c0be8De5c08b9FDF69AfF5e5A446Dd16B95843e',
    Market: '0x923E13952840cb66Eb3bbF32245b422a1cA360F2',
    MochiERC721NFT: '',
    MochiERC1155NFT: '',
    MarketAdmin: '0x6BD98658EeD1B4411bdF485DcE4D31e6087A14b6',
    MOMA: '',
  },
};

const tokensPayment = {
  //Polygon Mainnet
  137: [
    {
      address: '0xe3ab61371ecc88534c522922a026f2296116c109',
      icon: moma,
      symbol: 'MOMA',
      collections: {},
      hiddens: [],
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      icon: polygon,
      symbol: 'MATIC',
      collections: {},
      hiddens: [],
    },
  ],
  //BSC Mainnet
  56: [
    {
      address: '0xb72842d6f5fedf91d22d56202802bb9a79c6322e',
      icon: moma,
      symbol: 'MOMA',
      collections: {},
      hiddens: [],
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      icon: bnb,
      symbol: 'BNB',
      collections: {},
      hiddens: [],
    },
    {
      address: '0x8f661bd044b8799fde621079e4a48171848ad614',
      icon: eightbit,
      symbol: '8BIT',
      collections: {},
      hiddens: [],
    },
  ],
  //BSC Testnet
  97: [
    {
      address: '0x777d20e16c6bc508d5989e81a6c9b5034a32c6dd',
      icon: moma,
      symbol: 'MOMA',
      collections: {},
      hiddens: [],
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      icon: bnb,
      symbol: 'BNB',
      collections: {},
      hiddens: [],
    },
  ],
  1666600000: [
    {
      address: '0x0000000000000000000000000000000000000000',
      icon: one,
      symbol: 'ONE',
      collections: {},
      hiddens: [],
    },
  ],
  1285: [
    {
      address: '0x0000000000000000000000000000000000000000',
      icon: movr,
      symbol: 'MOVR',
      collections: {},
      hiddens: [],
    },
  ],
};

const symbolToken = {
  //Polygon Mainnet
  137: {
    '0xe3ab61371ecc88534c522922a026f2296116c109': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'MATIC',
  },
  //BSC Mainnet
  56: {
    '0xb72842d6f5fedf91d22d56202802bb9a79c6322e': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'BNB',
    '0x8f661bd044b8799fde621079e4a48171848ad614': '8BIT',
  },
  //BSC Testnet
  97: {
    '0x777d20e16c6bc508d5989e81a6c9b5034a32c6dd': 'MOMA',
    '0x0000000000000000000000000000000000000000': 'BNB',
  },
  1666600000: {
    '0x0000000000000000000000000000000000000000': 'ONE',
  },
  1285: {
    '0x0000000000000000000000000000000000000000': 'MOVR',
  },
};

const infoChains = {
  //Polygon Mainnet
  137: { name: 'Polygon', icon: polygon },
  //BSC Mainnet
  56: { name: 'BSC', icon: bnb },
  //BSC Testnet
  97: { name: 'BSC-Testnet', icon: bnb },
  // Harmony mainet
  // 1666600000: { name: 'Harmony', icon: one },
  // Moonbase
  1285: { name: 'Moonriver', icon: movr },
};

export const listChainsSupport = [
  { chainId: 56, name: 'BSC', icon: bnb, mochiGraphEnabled: true /*BSC Mainnet*/ },
  { chainId: 137, name: 'Polygon', icon: polygon, mochiGraphEnabled: true /* Polygon Mainnet*/ },
  { chainId: 97, name: 'BSC-Testnet', icon: bnb, mochiGraphEnabled: false /*BSC Testnet*/ },
  // { chainId: 1666600000, name: 'Harmony', icon: one /*BSC Testnet*/ },
  { chainId: 1285, name: 'Moonriver', icon: movr, mochiGraphEnabled: false /*Moonriver Testnet*/ },
];

const logoChainsTags = {
  //Polygon Mainnet
  137: { name: 'Polygon', logo: polygonTag },
  //BSC Mainnet
  56: { name: 'BSC', logo: bscTag },
  //BSC Testnet
  97: { name: 'BSC-Testnet', logo: bscTag },
  // Harmony mainet
  1666600000: { name: 'Harmony', logo: harmonyTag },
  // Moonbase
  1285: { name: 'Moonriver', icon: movrTag },
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
export const getInfoChain = (_chainId) => {
  return infoChains[_chainId];
};
export const getLogoChainsTags = (_chainId) => {
  return logoChainsTags[_chainId];
};

export const getMochiGraphSupport = (_chainId) => {
  return listChainsSupport.filter(x => x.chainId === _chainId)[0].mochiGraphEnabled || false;
};
