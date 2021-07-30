import axios from 'axios';

export const getSellOrderByAttributes = async (chainId, addressToken, skip, page, objectFilter) => {
  let filterStr = '';
  Object.keys(objectFilter).forEach((attribute, index) => {
    if (Array.isArray(objectFilter[attribute]) && objectFilter[attribute].length > 0) {
      filterStr += `&${attribute}=["${objectFilter[attribute].join('","')}"]`;
    } else if (Object.keys(objectFilter[attribute]).length > 0) {
      filterStr += `&${attribute}=${JSON.stringify(objectFilter[attribute])}`;
    }
  });

  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/filterByAttributes/${chainId}/${addressToken}?skip=${skip}&limit=${page}${filterStr}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellOrderByCollection = async (chainId, addressToken, skip, page) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/byCollection/${chainId}/${addressToken}?skip=${skip}&limit=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellOrderByUser = async (chainId, walletAddress, skip, page) => {
  let result = await axios
    .get(
      `${
        process.env.REACT_APP_SERVER
      }/sellOrder/byUser/${chainId}/${walletAddress.toLowerCase()}?skip=${skip}&limit=${page}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellOrderBySellId = async (chainId, sellId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/bySellId/${chainId}/${sellId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellOrderERC1155 = async (chainId, skip, page) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/erc1155/${chainId}?skip=${skip}&limit=${page}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellOrderERC721 = async (chainId, skip, page) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/erc721/${chainId}?skip=${skip}&limit=${page}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getSellerByNft = async (chainId, addressToken, tokenId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/byNft/${chainId}/${addressToken}/${tokenId}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};

export const getAll = async (chainId, skip, page) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER}/sellOrder/${chainId}?skip=${skip}&limit=${page}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
