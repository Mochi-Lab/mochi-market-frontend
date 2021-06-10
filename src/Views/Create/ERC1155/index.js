import { Form, Input, Button, Row, message } from 'antd';
import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import ERC1155Collections from './Collections';
import ConnectWallet from 'Components/ConnectWallet';
import { uploadIPFS } from '../UploadIpfs';
import BackButton from 'Components/BackButton';
import { generateERC1155NFT } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { Link } from 'react-router-dom';

import '../index.css';

const { TextArea } = Input;

export default function CreateERC1155() {
  const { walletAddress } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [collectionId, setCollectionId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const profile = useRef(null);

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

  const routeProfile = () => {
    profile.current.click();
  };

  const onFinish = async (values) => {
    if (files.length > 0) {
      setVisible();
      // upload image
      setIsLoading(true);
      let tokenUri = await uploadIPFS(values, files);
      setIsLoading(false);

      // mint token
      setVisible(true);
      dispatch(generateERC1155NFT(collectionId, values.id, values.amount, tokenUri, routeProfile));
      setVisible(false);

      // reset form and file
      setFiles([]);
      form.resetFields();
    } else message.warn('Did you forget to upload an Image ?');
  };

  return (
    <div className='center create-pt'>
      {isLoading ? <LoadingModal title={'Upload Image'} visible={true} /> : <></>}
      <div className='my-collection'>
        <LoadingModal title={'Create NFT'} visible={visible} />
        <BackButton />

        <h2 className='textmode'>Creating multiple NFTs</h2>

        <div>
          <div>
            <Link to={`/profile/${walletAddress}`} ref={profile} />
            <h3 className='text-upload-image textmode'>Upload Image</h3>
            <div className='drag-box-search'>
              <div className='drag-box' {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {!!files[0] ? (
                  <img
                    src={files[0].preview}
                    alt='priview'
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <p className='textmode' style={{ textAlign: 'center' }}>
                    {'Drag and Drop your image here. Max size 4MB'}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className='input-area'>
            <div>
              <h3 className='text-upload-image textmode'>Choose collection</h3>
              <ERC1155Collections collectionId={collectionId} setCollectionId={setCollectionId} />
            </div>
            <Form onFinish={onFinish} form={form} layout='vertical'>
              <Form.Item
                label={<h3 className='text-upload-image textmode'>Name</h3>}
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input name of NFT!',
                  },
                ]}
              >
                <Input
                  className='input-name-nft input-mode-bc'
                  placeholder='Name of NFT'
                  size='large'
                />
              </Form.Item>
              {collectionId !== -1 ? (
                <Form.Item
                  label='Id'
                  name='id'
                  rules={[
                    {
                      required: true,
                      message: 'Please input id!',
                    },
                  ]}
                >
                  <Input className='input-name-nft input-mode-bc' placeholder='Id' size='large' />
                </Form.Item>
              ) : (
                <></>
              )}
              <Form.Item
                label={<h3 className='text-upload-image textmode'>Amount</h3>}
                name='amount'
                rules={[
                  {
                    required: true,
                    message: 'Please input number of NFT!',
                  },
                ]}
              >
                <Input
                  className='input-name-nft input-mode-bc'
                  placeholder='Number of NFT'
                  size='large'
                />
              </Form.Item>
              <Form.Item
                name='description'
                label={<h3 className='text-upload-image textmode'>Description</h3>}
              >
                <TextArea
                  className='input-name-nft input-mode-bc'
                  autoSize={{ minRows: 6 }}
                  placeholder='Description'
                  size='large'
                />
              </Form.Item>
              <Form.Item>
                <Row justify='end'>
                  {walletAddress ? (
                    <Button type='primary' htmlType='submit' shape='round' size='large'>
                      Create Item
                    </Button>
                  ) : (
                    <ConnectWallet />
                  )}
                </Row>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
