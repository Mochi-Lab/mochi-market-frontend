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
        process.env.REACT_APP_SERVER_URL
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
      `${process.env.REACT_APP_SERVER_URL}/sellOrder/byCollection/${chainId}/${addressToken}?skip=${skip}&limit=${page}`
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
        process.env.REACT_APP_SERVER_URL
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
        process.env.REACT_APP_SERVER_URL
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
    .get(`${process.env.REACT_APP_SERVER_URL}/sellOrder/bySellId/${chainId}/${sellId}`)
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
      `${process.env.REACT_APP_SERVER_URL}/sellOrder/byType/erc1155/${chainId}?skip=${skip}&limit=${page}`
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
      `${process.env.REACT_APP_SERVER_URL}/sellOrder/byType/erc721/${chainId}?skip=${skip}&limit=${page}`
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
    .get(
      `${process.env.REACT_APP_SERVER_URL}/sellOrder/byNft/${chainId}/${addressToken}/${tokenId}`
    )
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
    .get(`${process.env.REACT_APP_SERVER_URL}/sellOrder/${chainId}?skip=${skip}&limit=${page}`)
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
        process.env.REACT_APP_SERVER_URL
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

export const getSellOrderHistoryByNft = async (chainId, collectionAddress, tokenId) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/sellOrder/historyByNft/${chainId}/${collectionAddress}` +
        (tokenId ? `/${tokenId}` : '')
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return [];
    });
  return result;
};

export const getSellOrderHistoryByUser = async (chainId, userAddress) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/sellOrder/historyByUser/${chainId}/${userAddress}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return [];
    });
  return result;
};
