import { Button, Form, Input, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { createERC1155Collection } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from 'Components/ConnectWallet';
import SampleERC1155 from 'Contracts/SampleERC1155.json';

import '../index.css';

const NFTinfo = ({ userCollection, web3 }) => {
  const [name, setName] = useState('Loading..');
  const [symbol, setSymbol] = useState('Loading..');
  // get name and symbol
  useEffect(() => {
    const getInfo = async () => {
      let erc1155Instance = await new web3.eth.Contract(
        SampleERC1155.abi,
        userCollection.contractAddress
      );
      let name = await erc1155Instance.methods.name().call();
      let symbol = await erc1155Instance.methods.symbol().call();
      setName(name);
      setSymbol(symbol);
    };

    getInfo();
  });

  return (
    <>
      <strong className='textmode'>{name}</strong>
      <p className='textmode'>{symbol}</p>
    </>
  );
};

export default function ERC1155Collections({ collectionId, setCollectionId }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { walletAddress, userCollections, web3 } = useSelector((state) => state);

  const [form] = Form.useForm();

  const onSubmit = useCallback(
    (values) => {
      dispatch(createERC1155Collection(values));
    },
    [dispatch]
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    form.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='choose'>
        <div className={'box input-mode-bc'} onClick={showModal}>
          <strong className='textmode'>Create</strong>
          <p className='textmode'>ERC-1155</p>
        </div>

        {!!userCollections ? (
          userCollections.map((userCollection) =>
            userCollection.isERC1155 ? (
              <div
                key={userCollection.index}
                className={`${
                  collectionId === userCollection.index ? 'active' : ''
                } box input-mode-bc`}
                onClick={() => setCollectionId(userCollection.index)}
              >
                <NFTinfo userCollection={userCollection} web3={web3} />
              </div>
            ) : (
              <div key={userCollection.index}></div>
            )
          )
        ) : (
          <></>
        )}

        <div
          className={`${!collectionId ? 'active' : ''} box input-mode-bc`}
          onClick={() => setCollectionId(false)}
        >
          <strong className='textmode'>Mochi</strong>
          <p className='textmode'>MOC</p>
        </div>
      </div>

      <Modal
        title={
          <p className='textmode' style={{ margin: 0 }}>
            Collection
          </p>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          walletAddress
            ? [
                <Button key='cancel' shape='round' size='large' onClick={() => handleCancel()}>
                  Cancel
                </Button>,
                <Button
                  key='sell'
                  type='primary'
                  shape='round'
                  size='large'
                  onClick={() => handleOk()}
                >
                  Submit
                </Button>,
              ]
            : []
        }
      >
        {walletAddress ? (
          <Form onFinish={onSubmit} form={form} layout='vertical'>
            <Form.Item
              label='Display name'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Enter token name',
                },
              ]}
            >
              <Input
                className='input-name-nft input-mode-bc'
                placeholder='Enter token name'
                size='large'
              />
            </Form.Item>
            <Form.Item
              label='Symbol'
              name='symbol'
              rules={[
                {
                  required: true,
                  message: 'Enter token symbol',
                },
              ]}
            >
              <Input
                className='input-name-nft input-mode-bc'
                placeholder='Enter token symbol'
                size='large'
              />
            </Form.Item>
          </Form>
        ) : (
          <div className='center'>
            <div onClick={() => handleCancel()}>
              <ConnectWallet />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
