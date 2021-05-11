import { uploadToIpfs } from 'utils/ipfs';

const generateURI = async ({ name, description }, image, setFiles) => {
  let draw = {
    name,
    image,
    description,
  };
  draw = JSON.stringify(draw);
  try {
    const ipfsHash = await uploadToIpfs(draw);

    return 'https://gateway.ipfs.io/ipfs/' + ipfsHash;
  } catch (error) {
    console.log(error);
  }
};

export const uploadIPFS = async (values, files, setFiles) => {
  // post file to IPFS, get the IPFS hash and store it in contract
  return new Promise(function (resolve, reject) {
    try {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(files[0]); // convert file to array for buffer
      reader.onloadend = async () => {
        const ipfsHash = await uploadToIpfs(reader.result);
        let image = 'https://gateway.ipfs.io/ipfs/' + ipfsHash;
        resolve(await generateURI(values, image, setFiles));
      };
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
