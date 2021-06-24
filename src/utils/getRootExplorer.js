const rootExplorer = {
  //BSC Mainnet
  56: 'https://bscscan.com',
  //BSC Testnet
  97: 'https://testnet.bscscan.com',
  //Polygon
  137: 'https://polygonscan.com',
  //Harmony
  1666600000: 'https://explorer.pops.one/#',
};

export const getRootExplorer = (_chainId) => {
  return rootExplorer[_chainId];
};
