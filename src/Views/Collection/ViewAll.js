import { Col, Input, Layout, Row, Select, Modal, Button, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import { getTokensPayment } from 'utils/getContractAddress';
import './index.scss';
import 'Components/NFTsFilterBrowse/index.scss';
import { SearchOutlined } from '@ant-design/icons';
import IconLoading from 'Components/IconLoading';
import FilterCollection from 'Components/FilterCollection';
import Editor from '@monaco-editor/react';
import { getCollectionByAddress, getNonce } from 'APIs/Collections/Gets';
import { updateAttributesFilter } from 'APIs/Collections/Puts';
import createSignature from 'APIs/createSignature';
import { verifySignature } from 'APIs/Collections/Post';
import { showNotification } from 'store/actions';
import { debounce } from 'lodash';

const { Option } = Select;

export default function ViewAll({
  infoCollection,
  nftsOnSale,
  setViewAll,
  viewAll,
  loadingNFTs,
  refreshingNFTs,
  setObjectFilter,
  objectFilter,
  activeKeysCollapse,
  setActiveKeysCollapse,
  getInfoCollection,
  fetchExplore,
  isEndOfOrderList,
  loadingScroll,
  filterChange,
  setNftsOnSale,
  setSkip,
  tokenPayment,
  setTokenPayment,
  typeSort,
  setTypeSort,
  strSearch,
  setStrSearch,
}) {
  const dispatch = useDispatch();

  const { walletAddress, chainId, web3, infoAdmins } = useSelector((state) => state);
  const { addressToken } = useParams();
  let checkInfoExist = !!infoCollection && !!infoCollection.attributesFilter;

  const [showFilter, setShowFilter] = useState(true);
  const [modalEditFilter, setModalEditFilter] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [valueEditFilter, setValueEditFilter] = useState(
    checkInfoExist ? infoCollection.attributesFilter : []
  );
  const [defaultValue, setDefaultValue] = useState(
    checkInfoExist ? JSON.stringify(infoCollection.attributesFilter, null, '\t') : ''
  );
  const [checkValidator, setCheckValidator] = useState([]);
  const [darkMode, setDarkMode] = useState();
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    let mode = document.querySelector('html').getAttribute('data-theme');
    mode === 'dark' ? setDarkMode(true) : setDarkMode(false);
  }, [modalEditFilter]);

  useEffect(() => {
    if (checkInfoExist) {
      setDefaultValue(JSON.stringify(infoCollection.attributesFilter, null, '\t'));
    }
  }, [checkInfoExist, infoCollection]);

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId, setTokenPayment]);

  const handleOk = async () => {
    if (valueEditFilter.length > 0) {
      setLoadingUpdate(true);
      const resNonce = await getNonce(walletAddress, addressToken, chainId);
      const signature = await createSignature(web3, walletAddress, resNonce.nonce);
      const verify = await verifySignature(chainId, addressToken, walletAddress, signature);
      if (!!verify.status) {
        let resUpdate = await updateAttributesFilter(
          walletAddress,
          signature,
          addressToken,
          chainId,
          valueEditFilter
        );
        if (resUpdate) {
          let resCollections = await getCollectionByAddress(addressToken, chainId);
          await getInfoCollection(resCollections.collection);
          let noti = {};
          noti.type = 'success';
          noti.message = 'Updated Successfully';
          dispatch(showNotification(noti));
          setLoadingUpdate(false);
          setModalEditFilter(false);
        } else {
          let noti = {};
          noti.type = 'error';
          noti.message = 'Update Fail';
          dispatch(showNotification(noti));
          setLoadingUpdate(false);
        }
      } else {
        message.error('Verify failed');
      }
    }
  };
  const handleEditorChange = (e) => {
    if (checkValidator.length <= 0) {
      try {
        if (!e) {
          setValueEditFilter([]);
        } else {
          let valueEnter = JSON.parse(e);
          if (Array.isArray(valueEnter)) {
            setValueEditFilter(valueEnter);
          } else {
            message.error('attributes must be an array');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  function handleEditorValidation(markers) {
    setCheckValidator(markers);
  }

  const checkLoadMore = () => {
    if (!!viewAll) fetchExplore();
  };

  const selectTokenPayment = (_tokenPayment) => {
    setTokenPayment(_tokenPayment);
    setSkip(0);
    setNftsOnSale(null);
  };

  const selectSortType = (_type) => {
    setTypeSort(_type);
    setSkip(0);
    setNftsOnSale(null);
  };

  const searchNFTsCollection = (event, skipDebounce = false) => {
    const text = event.target.value;
    setTextSearch(text);
    if (!skipDebounce) debounceSearchText(text);
    else {
      setSkip(0);
      setNftsOnSale(null);
      setStrSearch(text);
    }
  };
  // eslint-disable-next-line
  const debounceSearchText = useCallback(
    debounce((text) => setStrSearch(text), 500),
    []
  );

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchNFTsCollection(event, true);
    }
  };

  return (
    <div className={`${!!viewAll ? 'display-block-view-all' : 'display-none-view-all'}`}>
      <Layout style={{ minHeight: '100%' }} className='view-all-collection background-mode'>
        <div className='sort-results-collection'>
          <div className='left-sort-results'>
            <div className='input-search-collections search-nft-in-collection-1 mr-0d5rem'>
              <Input
                placeholder='Search collections '
                onChange={searchNFTsCollection}
                onKeyDown={handleKeyDown}
                size='large'
                value={textSearch}
                suffix={<SearchOutlined />}
                className='style-search-input input-mode-bc textmode '
              />
            </div>
            {!!walletAddress &&
              infoAdmins.hasOwnProperty(walletAddress.toString().toLowerCase()) &&
              ((checkInfoExist && infoCollection.attributesFilter.length <= 0) ||
                !infoCollection.attributesFilter) && (
                <div className='btn-edit-filter' onClick={() => setModalEditFilter(true)}>
                  Add Filter
                </div>
              )}
          </div>
          <div className='right-sort-results'>
            <Select
              size='large'
              value={tokenPayment}
              onChange={(value) => selectTokenPayment(value)}
              className='tokenpayment textmode'
            >
              <Option value='0' key='-1' className='text-center'>
                All
              </Option>
              {!!getTokensPayment(chainId)
                ? getTokensPayment(chainId).map((token, i) => {
                    return (
                      <Option value={token.address} key={i} className='option-tokenpayment'>
                        <img className='icon-tokenpayment' src={token.icon} alt={token.symbol} />
                        <span className='symbol-tokenpayment'>{token.symbol}</span>
                      </Option>
                    );
                  })
                : null}
            </Select>
            <Select
              value={typeSort}
              className='textmode select-sort'
              size='large'
              onChange={(value) => selectSortType(value)}
            >
              <Option value=''>Recently listed</Option>
              <Option value='1'>Price asc</Option>
              <Option value='-1'>Price desc</Option>
            </Select>
            <Button
                className='btn-refresh'
                key='update'
                type='primary'
                size='large'
                onClick={() => filterChange()}
                loading={refreshingNFTs}
            >
              Refresh
            </Button>
            <span className='textmode link-view-less' onClick={() => setViewAll(false)}>
              View Less
            </span>
          </div>
        </div>
        <div className='search-nft-in-collection-2'>
          <div className='input-search-collections'>
            <Input
              placeholder='Search collections '
              onChange={searchNFTsCollection}
              size='large'
              value={strSearch}
              suffix={<SearchOutlined />}
              className='style-search-input input-mode-bc textmode'
            />
          </div>
        </div>
        {loadingNFTs || loadingNFTs === null ? (
          <div className='center' style={{ width: '100%', height: '100%' }}>
            <IconLoading />
          </div>
        ) : (
          <>
            {!!showFilter && checkInfoExist && infoCollection.attributesFilter.length > 0 ? (
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 5 }}>
                  <FilterCollection
                    setShowFilter={setShowFilter}
                    setObjectFilter={setObjectFilter}
                    objectFilter={objectFilter}
                    activeKeysCollapse={activeKeysCollapse}
                    setActiveKeysCollapse={setActiveKeysCollapse}
                    attributesFilter={checkInfoExist ? infoCollection.attributesFilter : []}
                    getInfoCollection={getInfoCollection}
                    setModalEditFilter={setModalEditFilter}
                    filterChange={filterChange}
                  />
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 18 }} xxl={{ span: 19 }}>
                  <NFTsCardBrowse
                    tokens={nftsOnSale}
                    tokenPayment={tokenPayment}
                    typeSort={typeSort}
                    strSearchInCollection={strSearch}
                    fetchExplore={checkLoadMore}
                    isEndOfOrderList={isEndOfOrderList}
                    loadingScroll={loadingScroll}
                    collectionName={infoCollection.name}
                  />
                </Col>
              </Row>
            ) : (
              <NFTsCardBrowse
                tokens={nftsOnSale}
                tokenPayment={tokenPayment}
                typeSort={typeSort}
                strSearchInCollection={strSearch}
                fetchExplore={checkLoadMore}
                isEndOfOrderList={isEndOfOrderList}
                loadingScroll={loadingScroll}
                collectionName={infoCollection.name}
              />
            )}
          </>
        )}
      </Layout>

      <Modal
        title={
          <p className='textmode mgb-0' style={{ fontSize: '28px', fontWeight: '900' }}>
            Edit Filter
          </p>
        }
        visible={modalEditFilter}
        footer={[
          <Button
            className='btn-update-profile'
            key='update'
            type='primary'
            shape='round'
            size='large'
            onClick={() => handleOk()}
            loading={loadingUpdate}
          >
            Update
          </Button>,
        ]}
        centered
        onCancel={() => (loadingUpdate ? null : setModalEditFilter(false))}
        width={'90vw'}
        maskClosable={loadingUpdate ? false : true}
      >
        <Editor
          height='70vh'
          defaultLanguage='json'
          onChange={handleEditorChange}
          defaultValue={defaultValue}
          value={defaultValue}
          onValidate={handleEditorValidation}
          theme={!!darkMode ? 'vs-dark' : 'light'}
        />
      </Modal>
    </div>
  );
}
