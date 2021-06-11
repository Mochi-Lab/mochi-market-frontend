const rootExplorer = {
  //BSC Mainnet
  56: 'https://bscscan.com/tx/',
  //BSC Testnet
  97: 'https://testnet.bscscan.com/tx/',
};

export const getRootExplorer = (_chainId) => {
  return rootExplorer[_chainId];
};
