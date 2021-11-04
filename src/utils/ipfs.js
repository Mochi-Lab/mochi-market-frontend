import axios from 'axios';

export const uploadFileToIpfs = async (data) => {
  try {
    const uploadedData = await axios.post(`${process.env.REACT_APP_SERVER_URL}/ipfs/upload`, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    });
    return uploadedData.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

export const uploadJsonToIpfs = async (data) => {
  try {
    const uploadedData = await axios.post(`${process.env.REACT_APP_SERVER_URL}/ipfs/upload-json`, {
      data,
    });
    return uploadedData.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFileInIpfs = async (hash) => {
  try {
    const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/ipfs/update`, { hash });

    return result.data.result;
  } catch (err) {
    console.log({ err });
    return false;
  }
};
