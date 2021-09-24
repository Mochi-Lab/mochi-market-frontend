import { Col, Input, Layout, Row, Select, Modal, Button, message, Tooltip, Space } from 'antd';
import {useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NFTsCardBrowse from 'Components/NFTsCardBrowse';
import { getTokensPayment } from 'utils/getContractAddress';
import './index.scss';
import 'Components/NFTsFilterBrowse/index.scss';
import { SearchOutlined, HistoryOutlined, CloseCircleOutlined } from '@ant-design/icons';
import IconLoading from 'Components/IconLoading';
import FilterCollection from 'Components/FilterCollection';
import Editor from '@monaco-editor/react';
import { getCollectionByAddress, getNonce } from 'APIs/Collections/Gets';
import { updateAttributesFilter } from 'APIs/Collections/Puts';
import createSignature from 'APIs/createSignature';
import { verifySignature } from 'APIs/Collections/Post';
import { showNotification } from 'store/actions';
import {TransactionHistoryByCollection} from "../../Components/NFTTransactionHistory/TransactionHistoryByCollection";
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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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
  const [textSearchInputValue, setTextSearchInputValue] = useState('');

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
    if (valueEditFilter.length > 0 || Array.isArray(valueEditFilter)) {
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
          setShowHistoryModal(false);
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

  const selectTokenPayment = useCallback(async (_tokenPayment) => {
    setTokenPayment(_tokenPayment);
    if(!(_tokenPayment==='0' && typeSort!=='')) {
      setSkip(0);
      setNftsOnSale(null);
    }
  }, [setTokenPayment, typeSort, setNftsOnSale, setSkip]);

  const selectSortType = useCallback((_type) => {
    setTypeSort(_type);
    if(!(tokenPayment==='0' && _type!=='')) {
      setSkip(0);
      setNftsOnSale(null);
    }
  }, [setTypeSort, tokenPayment, setNftsOnSale, setSkip]);

  const searchNFTsCollection = useCallback( async (event) => {
    if (event.key !== 'Enter') {
      const text = event.target.value;
      setTextSearchInputValue(text);
      setStrSearch(text);
      return
    }
    filterChange()
  }, [setStrSearch, filterChange]);

  return (
    <div className={`${!!viewAll ? 'display-block-view-all' : 'display-none-view-all'}`}>
      <Layout style={{ minHeight: '100%' }} className='view-all-collection background-mode'>
        <div className='sort-results-collection'>
          <div className='left-sort-results'>
            <div className='input-search-collections search-nft-in-collection-1 mr-0d5rem'>
              <Input
                placeholder='Search collection'
                onChange={searchNFTsCollection}
                onKeyUp={searchNFTsCollection}
                size='large'
                value={textSearchInputValue}
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
            <Tooltip
                visible={tokenPayment==='0' && typeSort!==''}
                placement='top'
                title={`To sort by price select token currency below ▼`}
            >
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
            </Tooltip>

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

            <Space size="small">
            <Button
              className='btn-refresh'
              key='update'
              type='primary'
              size='large'
              onClick={filterChange}
              loading={refreshingNFTs}
            >
              Refresh
            </Button>

            {/*<Button*/}
            {/*    className='btn-history'*/}
            {/*    size='large'*/}
            {/*    key='update'*/}
            {/*    onClick={() => setShowHistoryModal(true)}*/}
            {/*>*/}
            {/*  <HistoryOutlined /> Recently Sold*/}
            {/*</Button>*/}
            </Space>

            <span className='textmode link-view-less' onClick={() => setViewAll(false)}>
              View Less
            </span>
          </div>
        </div>
        <div className='search-nft-in-collection-2'>
          <div className='input-search-collections'>
            <Input
              placeholder='Search collection'
              size='large'
              onChange={searchNFTsCollection}
              onKeyUp={searchNFTsCollection}
              value={strSearch}
              suffix={<SearchOutlined />}
              className='style-search-input input-mode-bc textmode'
            />
          </div>
        </div>
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
                  {loadingNFTs || loadingNFTs === null ? (
                    <div className='center' style={{ width: '100%', height: '100%' }}>
                      <IconLoading />
                    </div>
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
                </Col>
              </Row>
            ) : (
              <>
                {loadingNFTs || loadingNFTs === null ? (
                    <div className='center' style={{ width: '100%', height: '100%' }}>
                      <IconLoading />
                    </div>
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
          </>
      </Layout>

      <Modal title={`Recently sold items in ${infoCollection.name}`}
             footer={null}
             className={"textmode"}
             width={"90%"}
             visible={showHistoryModal}
             destroyOnClose={true}
             closable={true}
             onCancel={() => setShowHistoryModal(false)}
      >
        <TransactionHistoryByCollection chainId={chainId} collectionAddress={addressToken} />
        <div style={{ textAlign: "center", margin: "1rem"}}>

          <Button
              className='btn-refresh'
              key='update'
              type='primary'
              size='large'
              onClick={() => setShowHistoryModal(false)}
          >
            <CloseCircleOutlined />
            Close
          </Button>

        </div>
      </Modal>

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
