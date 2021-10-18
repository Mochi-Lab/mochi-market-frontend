import axios from 'axios';

export const updateCollection = async (
  addressSubmit,
  signature,
  addressToken,
  chainId,
  collection
) => {
  let result = await axios
    .put(`${process.env.REACT_APP_SERVER_URL}/collectionInfo/`, {
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

export const updateAttributesFilter = async (
  addressAdmin,
  signature,
  addressToken,
  chainId,
  attributesFilter
) => {
  attributesFilter = JSON.stringify(attributesFilter);
  let result = await axios
    .put(`${process.env.REACT_APP_SERVER_URL}/collectionInfo/update-attributes-filter`, {
      addressAdmin,
      signature,
      addressToken,
      chainId,
      attributesFilter,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
  return result;
};
