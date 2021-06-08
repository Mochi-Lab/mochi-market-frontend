const urlsSubgraph = {
  //Polygon Mainnet
  137: {
    url1155: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip1155-matic',
    url721: 'https://api.thegraph.com/subgraphs/name/tranchien2002/eip721-matic',
  },
};

export const getUrlSubgraph = (_chainId) => {
  return urlsSubgraph[_chainId];
};
