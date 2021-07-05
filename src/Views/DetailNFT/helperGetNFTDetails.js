import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import ERC721 from 'Contracts/ERC721.json';
import axios from 'axios';
import imgNotFound from 'Assets/notfound.png';
import { getCollection } from 'store/actions';
import store from 'store/index';

export default async function helperGetNFTDetails(
  web3,
  nftList,
  addressToken,
  id,
  erc1155Tokens,
  setAvailable,
  setToken
) {
  if (web3 && nftList) {
    let is1155 = await nftList.methods.isERC1155(addressToken).call();
    let tokenURI;
    let nameCollection = (await store.dispatch(getCollection(addressToken, null))).collection.name;
    if (is1155) {
      const erc1155Instances = await new web3.eth.Contract(sampleAbiERC1155.abi, addressToken);
      tokenURI = await erc1155Instances.methods.uri(id).call();
      if (!!erc1155Tokens) {
        for (let i = 0; i < erc1155Tokens.length; i++) {
          const token = erc1155Tokens[i];
          if (
            token.addressToken.toLowerCase() === addressToken.toLowerCase() &&
            parseInt(token.index) === parseInt(id)
          ) {
            setAvailable(token.value);
            break;
          }
        }
      }
    } else {
      const erc721Instances = await new web3.eth.Contract(ERC721.abi, addressToken);
      tokenURI = await erc721Instances.methods.tokenURI(id).call();
    }
    // get token info
    try {
      let req = await axios.get(tokenURI);
      const data = req.data;
      setToken({
        name: !!data.name ? data.name : 'Unnamed',
        description: !!data.description ? data.description : '',
        image: !!data.image ? data.image : imgNotFound,
        nameCollection,
        attributes: !!data.attributes ? data.attributes : [],
      });
    } catch (error) {
      setToken({
        name: 'Unnamed',
        description: '',
        image: imgNotFound,
        nameCollection: 'Unnamed',
        attributes: [],
      });
    }
  }
}
