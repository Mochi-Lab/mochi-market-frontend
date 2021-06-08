import Web3 from 'web3';

export const web3Default = {
  //Polygon Mainnet
  137: {
    web3Default: new Web3(new Web3.providers.HttpProvider('https://rpc-mainnet.maticvigil.com')),
    name: 'Polygon Mainnet',
    explorer: 'https://explorer-mainnet.maticvigil.com/',
  },
};

export const networkDefault = 137;

export const getWeb3List = (_chainId) => {
  return web3Default[_chainId];
};
