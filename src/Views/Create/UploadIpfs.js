import store from 'store/index';
import { generateNFT } from 'store/actions';
import { uploadToIpfs } from 'utils/ipfs';

const generateURI = async (
  { name, description },
  image,
  form,
  setFiles,
  setIsLoading,
  isCreateNew,
  setVisible
) => {
  let draw = {
    name,
    image,
    description,
  };
  draw = JSON.stringify(draw);
  try {
    const ipfsHash = await uploadToIpfs(draw);

    setIsLoading(false);
    let tokenUri = 'https://gateway.ipfs.io/ipfs/' + ipfsHash;
    setVisible(true);
    await store.dispatch(generateNFT(isCreateNew, tokenUri));
    setVisible(false);
    // reset input
    setFiles([]);
    form.resetFields();
  } catch (error) {
    setIsLoading(false);
    setVisible(false);
    // reset input
    setFiles([]);
    form.resetFields();
    console.log(error);
  }
};

export const uploadIPFS = async (
  values,
  form,
  files,
  setFiles,
  setIsLoading,
  isCreateNew,
  setVisible
) => {
  setIsLoading(true);
  // post file to IPFS, get the IPFS hash and store it in contract
  try {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(files[0]); // convert file to array for buffer
    reader.onloadend = async () => {
      const ipfsHash = await uploadToIpfs(reader.result);
      let image = 'https://gateway.ipfs.io/ipfs/' + ipfsHash;
      await generateURI(values, image, form, setFiles, setIsLoading, isCreateNew, setVisible);
    };
  } catch (error) {
    console.error(error);
  }
};
