import axios from 'axios';

export const changeRole = async (addressAdmin, signature, addressUpdate, role) => {
  addressAdmin = addressAdmin.toLowerCase();
  addressUpdate = addressUpdate.toLowerCase();
  let result = await axios
    .put(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/update-role`, {
      addressAdmin,
      signature,
      addressUpdate,
      role,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
  return result;
};
