import { AutoComplete, Input } from 'antd';
// import _ from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setStrSearch } from 'store/actions';
import { getAllCollections } from 'APIs/Collections/Gets';
import './index.scss';

const BannerSearchBox = ({ inputSearch, setSkip, setNftsOnSale }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const { strSearch, chainId, verifiedContracts } = useSelector((state) => state);
  const [focused, setFocused] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [contractFiltered, setContractFiltered] = useState([]);
  const [textSearch, setTextSearch] = useState('');

  const onKeyDown = (event) => {
    if (location.pathname !== '/browse' || event.key !== 'Enter') return;
    setSkip(0);
    setNftsOnSale(null);
    dispatch(setStrSearch(event.target.value));
  };

  const onFocus = (event, text) => {
    setFocused(true);
    if (location.pathname !== '/') return setContractFiltered([]);
    const _text = text === undefined ? textSearch : text;
    const collections = contractList
      .map((c) => {
        return {
          value: c.address,
          label: c.name,
        };
      })
      .filter((c) => verifiedContracts.includes(c.value))
      // #TODO replace with fuzzy search
      .filter((c) => -1 !== c.label.toLowerCase().indexOf(_text.toLowerCase()));
    setContractFiltered(collections);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const onSearch = (text) => {
    setTextSearch(text);
    onFocus(null, text);
  };

  const onSelect = (addressToken) => {
    history.push(`/collection/${chainId}/${addressToken}`);
  };

  useEffect(() => {
    (async () => {
      if (location.pathname !== '/' || contractList.length > 0) return;
      const collections = await getAllCollections(chainId);
      setContractList(collections);
    })();
  }, [chainId, location, contractList]);

  useEffect(() => {
    return () => {
      dispatch(setStrSearch(''));
    };
  }, [dispatch]);

  return (
    <div className={'home-collection-search-container' + (focused ? ' active' : '')}>
      <AutoComplete
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={onSelect}
        onSearch={onSearch}
        className='search-input home-search home-collection-search'
        options={contractFiltered}
        onKeyDown={onKeyDown}
      >
        <Input.Search ref={inputSearch} size='large' placeholder='Search' value={strSearch} />
      </AutoComplete>
    </div>
  );
};

export default BannerSearchBox;
