import axios from 'axios';

export const getCollectionByAddress = async (address, chainId) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_PROFILE_URL}/collection/${address}/${chainId}`)
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
      `${process.env.REACT_APP_SERVER_PROFILE_URL}/collection/nonce/${addressSubmit}/${addressToken}/${chainId}`
    )
    .then(function (response) {
      return { nonce: response.data.nonce };
    })
    .catch(function (error) {
      console.log(error);
      return { nonce: null, msg: 'error server' };
    });
  return result;
};
