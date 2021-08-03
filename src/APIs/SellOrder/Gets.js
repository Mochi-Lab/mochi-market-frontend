import axios from 'axios';

export const getSellOrderByAttributes = async (
  chainId,
  addressToken,
  objectFilter,
  strSearch,
  tokenPayment,
  typeSort,
  skip,
  page
) => {
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
      `${
        process.env.REACT_APP_SERVER
      }/sellOrder/filterByAttributes/${chainId}/${addressToken}/${strSearch}?skip=${skip}&limit=${page}${
        tokenPayment !== '0' ? `&token=${tokenPayment}` : ''
      }${!!typeSort ? `&asc=${typeSort}` : ''}${filterStr}`
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

export const getCollectionBySearchAndPayment = async (
  chainId,
  addressToken,
  searchStr,
  tokenPayment,
  typeSort,
  skip,
  page
) => {
  let result = await axios
    .get(
      `${
        process.env.REACT_APP_SERVER
      }/sellOrder/byCollection/${chainId}/${addressToken}/${searchStr}?skip=${skip}&limit=${page}${
        tokenPayment !== '0' ? `&token=${tokenPayment}` : ''
      }${!!typeSort ? `&asc=${typeSort}` : ''}`
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
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/byType/erc1155/${chainId}?skip=${skip}&limit=${page}`
    )
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
    .get(
      `${process.env.REACT_APP_SERVER}/sellOrder/byType/erc721/${chainId}?skip=${skip}&limit=${page}`
    )
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

export const getAllBySearchAndPayment = async (
  chainId,
  searchStr,
  tokenPayment,
  typeSort,
  skip,
  page
) => {
  let result = await axios
    .get(
      `${
        process.env.REACT_APP_SERVER
      }/sellOrder/${chainId}/${searchStr}?skip=${skip}&limit=${page}${
        tokenPayment !== '0' ? `&token=${tokenPayment}` : ''
      }${!!typeSort ? `&asc=${typeSort}` : ''}`
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
