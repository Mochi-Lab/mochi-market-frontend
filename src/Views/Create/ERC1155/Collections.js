import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { createERC1155Collection } from 'store/actions';
import ConnectWallet from 'Components/ConnectWallet';
import SampleERC1155 from 'Contracts/SampleERC1155.json';
import { useDropzone } from 'react-dropzone';
import { uploadIPFS } from 'Views/Profile/UpdateIPFS';
import { uploadCollection } from 'APIs/Collections/Post';
import LoadingModal from 'Components/LoadingModal';

import '../index.scss';
import { Link } from 'react-router-dom';

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

export default function ERC1155Collections({ collectionId, setCollectionId, setIsLoading }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [checkFiles, setCheckFiles] = useState(true);
  const [files, setFiles] = useState([]);
  const { walletAddress, userCollections, web3, creativeStudio, chainId } = useSelector(
    (state) => state
  );

  const [form] = Form.useForm();

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const onSubmit = useCallback(
    async (values) => {
      if (files.length > 0) {
        if (files[0].size <= 4000000) {
          // upload image
          setIsLoading(true);
          let logo = await uploadIPFS(files);
          setIsLoading(false);

          // mint token
          setIsDeploying(true);
          await dispatch(createERC1155Collection(values))
            .then(() => {
              setIsDeploying(false);
            })
            .catch((e) => {
              console.log(e);
              setIsDeploying(false);
            });
          let collections = await creativeStudio.methods.getCollectionsByUser(walletAddress).call();
          let newCollection = {
            logo: !!logo.image ? logo.image : '',
            hashLogo: !!logo.ipfsHash ? logo.ipfsHash : '',
            name: values.name,
            symbol: values.symbol,
          };
          await uploadCollection(
            chainId,
            collections[collections.length - 1][1],
            walletAddress,
            newCollection
          );
          // reset form and file
          setFiles([]);
          form.resetFields();
          setIsModalVisible(false);
        } else message.warn('You can only upload up to 4MB');
      } else {
        setCheckFiles(false);
      }
    },
    [dispatch, files, form, setIsLoading, chainId, creativeStudio, walletAddress]
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
      <LoadingModal title={'Deploying Collection'} open={isDeploying} />
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
                <Link
                  to={`/collection/${chainId}/${userCollection.contractAddress}`}
                  className='button-edit-collection'
                >
                  <EditOutlined />
                </Link>
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
          className={`${collectionId === -1 ? 'active' : ''} box input-mode-bc`}
          onClick={() => setCollectionId(-1)}
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
        open={isModalVisible}
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
                  className='btn-create-item'
                  onClick={() => handleOk()}
                >
                  Submit
                </Button>,
              ]
            : []
        }
      >
        {walletAddress ? (
          <Form onFinish={onSubmit} form={form} layout='vertical' className='form-collection-1155'>
            <div className='wrap-box-create-collection'>
              <div className='wrap-box-input'>
                <Form.Item
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
              </div>
              <div className='wrap-columm-logo'>
                <div className='drag-box' {...getRootProps({ className: 'dropzone-collection' })}>
                  <input {...getInputProps()} />
                  {!!files[0] ? (
                    <div className='preview'>
                      <img
                        src={files[0].preview}
                        alt='priview'
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          borderRadius: '1rem',
                        }}
                      />
                    </div>
                  ) : (
                    <p className='textmode' style={{ textAlign: 'center', marginBottom: 0 }}>
                      {'Logo max size 4MB'}
                    </p>
                  )}
                </div>
                <div className='text-center'>
                  {!checkFiles ? (
                    <div className='ant-form-item-explain ant-form-item-explain-error'>
                      <div role='alert'>Upload logo</div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
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
