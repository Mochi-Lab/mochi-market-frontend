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

//BSC only
export const getListNFTsOwner = async (addressToken, skip, page) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_NFT_DATA}/erc721/byOwner/${addressToken}?skip=${skip}&limit=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
