import axios from 'axios';

export const getCollectionByAddress = async (address, chainId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/collectionInfo/${address}/${chainId}`)
    .then(function (response) {
      return { collection: response.data.collection };
    })
    .catch(function (error) {
      return { collection: null, msg: 'error server' };
    });
  return result;
};

export const getNonce = async (addressSubmit, addressToken, chainId) => {
  let result = await axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/collectionInfo/nonce/${addressSubmit}/${addressToken}/${chainId}`
    )
    .then(function (response) {
      return { nonce: response.data.nonce };
    })
    .catch(function (error) {
      return { nonce: null, msg: 'error server' };
    });
  return result;
};

export const getAllCollections = async (chainId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/collection/${chainId}`)
    .then(function (response) {
      return response.data.collections;
    })
    .catch(function (error) {
      return [];
    });
  return result;
};
