import Web3 from 'web3';

export const web3Default = {
  //Polygon Mainnet
  137: {
    web3Default: new Web3(
      new Web3.providers.HttpProvider('https://matic-mainnet.chainstacklabs.com')
    ),
    name: 'Polygon Mainnet',
    explorer: 'https://polygonscan.com/',
  },
  //BSC Mainnet
  56: {
    web3Default: new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')),
    name: 'BSC Mainnet',
    explorer: 'https://bscscan.com/tx/',
  },
  //BSC Testnet
  97: {
    web3Default: new Web3(
      new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s3.binance.org:8545/')
    ),
    name: 'BSC Testnet',
    explorer: 'https://testnet.bscscan.com/tx/',
  },
  //BSC Testnet
  1666600000: {
    web3Default: new Web3(new Web3.providers.HttpProvider('https://api.harmony.one')),
    name: 'Harmony',
    explorer: 'https://explorer.pops.one/#/tx/',
  },
  // Moonbase
  1287: {
    web3Default: new Web3(new Web3.providers.HttpProvider('https://rpc.testnet.moonbeam.network')),
    name: 'Moonbase',
    explorer: 'https://moonbase-blockscout.testnet.moonbeam.network/',
  },
};

// export const networkDefault = 137;
export const networkDefault = !!localStorage.getItem('chainId')
  ? parseInt(localStorage.getItem('chainId'))
  : 56;

export const getWeb3List = (_chainId) => {
  return web3Default[_chainId];
};
