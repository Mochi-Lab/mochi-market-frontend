import axios from 'axios';

export const getDetailNFT = async (chainId, addressToken, tokenId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/nft/${chainId}/${addressToken}/${tokenId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
