import imgNotFound from 'Assets/notfound.png';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { getDetailNFT } from 'APIs/NFT/Get';

export default async function helperGetNFTDetails(chainId, addressToken, id, setToken) {
  if (!!chainId && !!addressToken && !!id) {
    try {
      let nft = await getDetailNFT(chainId, addressToken, id);
      let nameCollection = (await store.dispatch(getCollection(addressToken, null))).collection
        .name;
      nft['nameCollection'] = nameCollection;
      setToken(nft);
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
