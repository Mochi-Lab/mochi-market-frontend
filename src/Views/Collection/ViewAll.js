import { Col, Input, Layout, Row, Select, Modal, Button, message } from 'antd';
import { useEffect, useState } from 'react';
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

const { Option } = Select;

export default function ViewAll({
  infoCollection,
  collectionOnSale,
  setViewAll,
  viewAll,
  loadingNFTs,
  setObjectFilter,
  objectFilter,
  activeKeysCollapse,
  setActiveKeysCollapse,
  getInfoCollection,
}) {
  const dispatch = useDispatch();

  const { walletAddress, chainId, web3 } = useSelector((state) => state);
  const { addressToken } = useParams();

  const [tokenPayment, setTokenPayment] = useState('0');
  const [typeSort, setTypeSort] = useState('recentlyListed');
  const [strSearch, setStrSearch] = useState();
  const [showFilter, setShowFilter] = useState(true);
  const [modalEditFilter, setModalEditFilter] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [valueEditFilter, setValueEditFilter] = useState(
    !!infoCollection.attributesFilter ? infoCollection.attributesFilter : []
  );
  const [defaultValue, setDefaultValue] = useState(
    !!infoCollection.attributesFilter
      ? JSON.stringify(infoCollection.attributesFilter, null, '\t')
      : ''
  );
  const [checkValidator, setCheckValidator] = useState([]);
  const [darkMode, setDarkMode] = useState();

  useEffect(() => {
    let mode = document.querySelector('html').getAttribute('data-theme');
    mode === 'dark' ? setDarkMode(true) : setDarkMode(false);
  }, [modalEditFilter]);

  useEffect(() => {
    if (!!infoCollection.attributesFilter) {
      setDefaultValue(JSON.stringify(infoCollection.attributesFilter, null, '\t'));
    }
  }, [infoCollection.attributesFilter]);

  useEffect(() => {
    if (!!chainId) {
      setTokenPayment('0');
    }
  }, [chainId]);

  const _setFilterCount = (count) => {};

  const searchNFTsCollection = (e) => {
    const { value } = e.target;
    if (!!value) {
      setStrSearch(value);
    } else {
      setStrSearch('');
    }
  };

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

  return (
    <div className={`${!!viewAll ? 'display-block-view-all' : 'display-none-view-all'}`}>
      <Layout style={{ minHeight: '100%' }} className='view-all-collection background-mode'>
        <div className='sort-results-collection'>
          <div className='left-sort-results'>
            <div className='input-search-collections search-nft-in-collection-1 mr-0d5rem'>
              <Input
                placeholder='Search collections '
                onChange={searchNFTsCollection}
                size='large'
                value={strSearch}
                suffix={<SearchOutlined />}
                className='style-search-input input-mode-bc textmode '
              />
            </div>
            {!infoCollection.attributesFilter && (
              <div className='btn-edit-filter' onClick={() => setModalEditFilter(true)}>
                Add Filter
              </div>
            )}
          </div>
          <div className='right-sort-results'>
            <Select
              size='large'
              value={tokenPayment}
              onChange={(value) => setTokenPayment(value)}
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
              onChange={(value) => setTypeSort(value)}
            >
              <Option value='recentlyListed'>Recently listed</Option>
              <Option value='latestCreated'>Latest created</Option>
              <Option value='priceAsc'>Price asc</Option>
              <Option value='priceDesc'>Price desc</Option>
            </Select>
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
            {!!showFilter &&
            !!infoCollection.attributesFilter &&
            infoCollection.attributesFilter.length > 0 ? (
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 5 }}>
                  <FilterCollection
                    setShowFilter={setShowFilter}
                    setObjectFilter={setObjectFilter}
                    objectFilter={objectFilter}
                    activeKeysCollapse={activeKeysCollapse}
                    setActiveKeysCollapse={setActiveKeysCollapse}
                    attributesFilter={
                      !!infoCollection.attributesFilter ? infoCollection.attributesFilter : []
                    }
                    getInfoCollection={getInfoCollection}
                    setModalEditFilter={setModalEditFilter}
                  />
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 18 }} xxl={{ span: 19 }}>
                  <NFTsCardBrowse
                    tokens={collectionOnSale()}
                    tokenPayment={tokenPayment}
                    typeSort={typeSort}
                    filterCountCallback={_setFilterCount}
                    strSearchInCollection={strSearch}
                  />
                </Col>
              </Row>
            ) : (
              <NFTsCardBrowse
                tokens={collectionOnSale()}
                tokenPayment={tokenPayment}
                typeSort={typeSort}
                filterCountCallback={_setFilterCount}
                strSearchInCollection={strSearch}
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
