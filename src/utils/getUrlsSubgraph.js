const urlsSubgraph = {
  //Polygon Mainnet
  137: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-matic',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic',
  },
  //BSC Mainnet
  56: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-bsc-main',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-bsc-main',
  },
  //BSC Testnet
  97: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-bsc',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-bsc',
  },
};

export const getUrlSubgraph = (_chainId) => {
  return urlsSubgraph[_chainId];
};
