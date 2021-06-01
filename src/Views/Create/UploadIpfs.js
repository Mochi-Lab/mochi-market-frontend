import { uploadJsonToIpfs, uploadFileToIpfs } from 'utils/ipfs';

const generateURI = async ({ name, description }, image) => {
  return new Promise(async function (resolve, reject) {
    let draw = {
      name,
      image,
      description,
    };
    try {
      const ipfsHash = await uploadJsonToIpfs(draw);

      resolve('https://storage.mochi.market/ipfs/' + ipfsHash);
    } catch (error) {
      console.log(error);
    }
  });
};

export const uploadIPFS = async (values, files) => {
  // post file to IPFS, get the IPFS hash and store it in contract
  return new Promise(async function (resolve, reject) {
    try {
      let formData = new FormData();
      formData.append('file', files[0]);
      const ipfsHash = await uploadFileToIpfs(formData);
      let image = 'https://storage.mochi.market/ipfs/' + ipfsHash;
      resolve(await generateURI(values, image));
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
