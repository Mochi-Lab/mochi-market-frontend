import axios from 'axios';

export const getProfileByAddress = async (address) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/${address}`)
    .then(function (response) {
      return { user: response.data.user };
    })
    .catch(function (error) {
      return { user: null, msg: 'error server' };
    });
  return result;
};

export const checkUsernameExists = async (username) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/exists/${username}`)
    .then(function (response) {
      return { status: response.data.status };
    })
    .catch(function (error) {
      console.log(error);
      return { status: false, msg: 'error server' };
    });
  return result;
};

export const getNonce = async (address) => {
  let result = await axios
    .get(`${process.env.REACT_APP_SERVER_PROFILE_URL}/user/nonce/${address}`)
    .then(function (response) {
      return { nonce: response.data.nonce };
    })
    .catch(function (error) {
      console.log(error);
      return { nonce: null, msg: 'error server' };
    });
  return result;
};
