import sampleAbiERC1155 from 'Contracts/SampleERC1155.json';
import ERC721 from 'Contracts/ERC721.json';
import axios from 'axios';
import imgNotFound from 'Assets/notfound.png';

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
    let collections;
    if (is1155) {
      const erc1155Instances = await new web3.eth.Contract(sampleAbiERC1155.abi, addressToken);
      tokenURI = await erc1155Instances.methods.uri(id).call();
      try {
        collections = await erc1155Instances.methods.name().call();
      } catch (error) {
        collections = null;
      }
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
      collections = await erc721Instances.methods.name().call();
    }
    // get token info
    try {
      let req = await axios.get(tokenURI);
      const data = req.data;
      setToken({
        name: !!data.name ? data.name : 'Unnamed',
        description: !!data.description ? data.description : '',
        image: !!data.image ? data.image : imgNotFound,
        collections: !collections ? (!!data.name ? data.name : 'Unnamed') : collections,
        attributes: !!data.attributes ? data.attributes : [],
      });
    } catch (error) {
      setToken({
        name: 'Unnamed',
        description: '',
        image: imgNotFound,
        attributes: [],
      });
    }
  }
}
