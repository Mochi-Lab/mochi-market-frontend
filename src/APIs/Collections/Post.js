import axios from 'axios';

export const uploadCollection = async (chainId, addressToken, addressSubmit, collection) => {
  let result = await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/collectionInfo/`, {
      chainId,
      addressToken,
      addressSubmit,
      collection,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
  return result;
};

export const verifySignature = async (chainId, addressToken, addressSubmit, signature) => {
  let result = await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/collectionInfo/verify-signature`, {
      chainId,
      addressToken,
      addressSubmit,
      signature,
    })
    .then(function (response) {
      return { status: response.data.status };
    })
    .catch(function (error) {
      console.log(error);
      return { status: false, msg: 'error server' };
    });
  return result;
};
