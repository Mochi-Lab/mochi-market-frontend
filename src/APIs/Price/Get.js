import axios from 'axios';

export const getPrices = async (chainId) => {

  const currencies = {
    56: ['binancecoin', 'mochi-market', 'dragon-warrior'],
    97: ['binancecoin', 'mochi-market'],
    137: ['matic-network', 'mochi-market']
  }
  const mapped_currencies = {
    56: ['bnb', 'moma', 'gon'],
    97: ['bnb', 'moma'],
    137: ['matic', 'moma']
  }
  const vs_currencies = {
    56: ['usd', 'bnb'],
    97: ['usd', 'bnb'],
    137: ['usd', 'matic-network']
  }

  if(!currencies[chainId]) return [];

  let result = await axios
    .get(`https://api.coingecko.com/api/v3/simple/price?ids=${currencies[chainId].toString()}&vs_currencies=${vs_currencies[chainId].toString()}`)
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });

  currencies[chainId].forEach((i, index) => {

    if(result[i]) {
      result[mapped_currencies[chainId][index]] = {...result[i]}
      delete result[i];
    }
  })

  return result;
};
