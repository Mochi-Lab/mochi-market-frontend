import axios from 'axios';

export const updateProfile = async (user) => {
  let result = await axios
    .post(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/`, { user })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
  return result;
};

export const verifySignature = async (address, signature) => {
  let result = await axios
    .post(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/verify-signature`, {
      address,
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
