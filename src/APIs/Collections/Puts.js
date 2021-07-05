import axios from 'axios';

export const updateCollection = async (
  addressSubmit,
  signature,
  addressToken,
  chainId,
  collection
) => {
  let result = await axios
    .put(`${process.env.REACT_APP_SERVER_PROFILE_URL}/collection/`, {
      addressSubmit,
      signature,
      addressToken,
      chainId,
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
