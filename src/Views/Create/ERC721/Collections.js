import { Button, Form, Input, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { createERC721Collection } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from 'Components/ConnectWallet';
import SampleERC721 from 'Contracts/SampleERC721.json';
import LoadingModal from 'Components/LoadingModal';
import add from '../../../Assets/images/add.jpg';

import '../index.css';

const NFTinfo = ({ userCollection, web3 }) => {
  const [name, setName] = useState('Loading..');
  const [symbol, setSymbol] = useState('Loading..');
  // get name and symbol
  useEffect(() => {
    const getInfo = async () => {
      let erc721Instance = await new web3.eth.Contract(
        SampleERC721.abi,
        userCollection.contractAddress
      );
      let name = await erc721Instance.methods.name().call();
      let symbol = await erc721Instance.methods.symbol().call();
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

export default function ERC721Collections({ collectionId, setCollectionId }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const { walletAddress, userCollections, web3 } = useSelector((state) => state);

  const [form] = Form.useForm();

  const onSubmit = useCallback(
    (values) => {
      setIsDeploying(true);
      dispatch(createERC721Collection(values))
        .then(() => {
          setIsDeploying(false);
        })
        .catch((e) => {
          console.log(e);
          setIsDeploying(false);
        });
    },
    [dispatch]
  );

  const showModal = () => {
    setCollectionId(true);
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
      <LoadingModal title={'Deploying Collection'} visible={isDeploying} />
      <div className='choose'>
        {!!userCollections ? (
          userCollections.map((userCollection) =>
            userCollection.isERC1155 ? (
              <div key={userCollection.index}></div>
            ) : (
              <div
                key={userCollection.index}
                className={`${
                  collectionId === userCollection.index ? 'active' : ''
                } box input-mode-bc`}
                onClick={() => setCollectionId(userCollection.index)}
              >
                <NFTinfo userCollection={userCollection} web3={web3} />
              </div>
            )
          )
        ) : (
          <></>
        )}

        <div
          className={`${collectionId === -1 ? 'active' : ''} box input-mode-bc`}
          onClick={() => setCollectionId(-1)}
        >
          <strong className='textmode'>Mochi</strong>
          <p className='textmode'>MOC</p>
        </div>

        <div className='box input-mode-bc create-erc721' onClick={showModal}>
          <img src={add} alt='create ERC-721' />
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
