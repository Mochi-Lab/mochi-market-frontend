import { useSelector } from 'react-redux';
import NFTsFilter from 'Components/NFTsFilter';

export default function Browse() {
  const { convertErc721Tokens, isLoadingErc721 } = useSelector((state) => state);
  return (
    <div className='container' style={{ width: '100%', height: '100%' }}>
      <NFTsFilter erc721Tokens={convertErc721Tokens} isLoadingErc721={isLoadingErc721} />
    </div>
  );
}
