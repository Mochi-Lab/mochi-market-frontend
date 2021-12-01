const coingeckoMappings = {
  //BSC Mainnet
  56: {
    currencies: ['binancecoin', 'mochi-market'],
    mapped_currencies: ['bnb', 'moma'],
    vs_currencies: ['bnb', 'usd'],
  },
  //BSC Testnet
  97: {
    currencies: ['binancecoin', 'mochi-market'],
    mapped_currencies: ['bnb', 'moma'],
    vs_currencies: ['bnb', 'usd'],
  },
  //Polygon
  137: {
    currencies: ['matic-network', 'mochi-market'],
    mapped_currencies: ['matic', 'moma'],
    vs_currencies: ['matic-network', 'usd'],
  },
  //Moonbase
  1285: {
    currencies: ['moonriver'],
    mapped_currencies: ['moonriver'],
    vs_currencies: ['moonriver', 'usd'],
  },
  //SDN
  336: {
    currencies: ['shiden-network'],
    mapped_currencies: ['shiden-network'],
    vs_currencies: ['shiden-network', 'usd'],
  },
};

export const getCoingeckoCurrencies = (_chainId) => {
  return coingeckoMappings[_chainId];
};
