import axios from 'axios';

export const getDetailNft = async (address, tokenId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/nft/${address}/${tokenId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    });
  return result;
};
