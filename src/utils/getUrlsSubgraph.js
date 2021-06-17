const urlsSubgraph = {
  //Polygon Mainnet
  137: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-matic',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic',
  },
  //BSC Mainnet
  56: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-bsc-main',
    url721: 'https://api.thegraph.com/subgraphs/name/daisai3/eip721_bsc1',
  },
  //BSC Testnet
  97: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-bsc',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-bsc',
  },
  1666600000: {
    url1155: '',
    url721: '',
  },
};

export const getUrlSubgraph = (_chainId) => {
  return urlsSubgraph[_chainId];
};
