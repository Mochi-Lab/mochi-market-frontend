import { uploadFileToIpfs, deleteFileInIpfs } from 'utils/ipfs';

export const uploadIPFS = async (files) => {
  return new Promise(async function (resolve, reject) {
    try {
      let formData = new FormData();
      formData.append('file', files[0]);
      const ipfsHash = await uploadFileToIpfs(formData);
      let image = 'https://storage.mochi.market/ipfs/' + ipfsHash;
      resolve({ image, ipfsHash });
    } catch (error) {
      console.error(error);
      reject({ image: null, ipfsHash: null, msg: error.message });
    }
  });
};

export const updateIPFS = async (files, ipfsHash) => {
  try {
    let resDelete = await deleteFileInIpfs(ipfsHash);
    if (!!resDelete) return await uploadIPFS(files);
    else return { image: null, ipfsHash: null, msg: 'delete fail' };
  } catch (error) {
    return { image: null, ipfsHash: null, msg: error.message };
  }
};
