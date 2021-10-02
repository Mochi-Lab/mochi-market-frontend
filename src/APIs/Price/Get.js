import axios from 'axios';
import {getCoingeckoCurrencies} from "utils/getCoingeckoCurrencies";

export const getPrices = async (chainId) => {

  const coingeckoConfig = getCoingeckoCurrencies(chainId);
  if(!coingeckoConfig) return [];

  let result = await axios
    .get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoConfig.currencies.toString()}&vs_currencies=${coingeckoConfig.vs_currencies.toString()}`)
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });

  coingeckoConfig.currencies.forEach((i, index) => {

    if(result[i]) {
      result[coingeckoConfig.mapped_currencies[index]] = {...result[i]}
      delete result[i];
    }
  })

  return result;
};
