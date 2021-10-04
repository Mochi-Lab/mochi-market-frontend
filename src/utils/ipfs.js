import axios from 'axios';

export const uploadFileToIpfs = async (data) => {
  try {
    const uploadedData = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data`,
        pinata_api_key: process.env.REACT_APP_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_API_SECRET,
      },
    });
    return uploadedData.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

export const uploadJsonToIpfs = async (data) => {
  try {
    const uploadedData = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      headers: {
        pinata_api_key: process.env.REACT_APP_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_API_SECRET,
      },
    });
    return uploadedData.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFileInIpfs = async (hash) => {
  const result = await axios
    .delete(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
      headers: {
        pinata_api_key: process.env.REACT_APP_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_API_SECRET,
      },
    })
    .then(function (res) {
      return true;
    })
    .catch(function (e) {
      console.log('error:', e);
      return false;
    });
  return result;
};
