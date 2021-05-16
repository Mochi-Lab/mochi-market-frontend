import { Form, Input, Button, Row, message, Radio } from 'antd';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import LoadingModal from 'Components/LoadingModal';
import Collections from './Collections';
import ConnectWallet from 'Components/ConnectWallet';
import BackButton from 'Components/BackButton';
import { uploadSia } from './UploadSia';
import { uploadIPFS } from './UploadIpfs';
import './index.css';

const { TextArea } = Input;

export default function CreateERC721() {
  const { walletAddress } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [storage, setStorage] = useState(0);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);

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

  const handleStorageChange = (e) => {
    setStorage(e.target.value);
  };

  const onFinish = (values) => {
    if (files.length > 0) {
      if (storage === 0)
        uploadIPFS(values, form, files, setFiles, setIsLoading, isCreateNew, setVisible);
      else uploadSia(values, form, files, setFiles, setIsLoading, isCreateNew);
    } else message.warn('Did you forget upload an Image ?');
  };

  return (
    <div className='center create-pt'>
      {isLoading ? <LoadingModal title={'Upload Image'} visible={true} /> : <></>}
      <div className='my-collection'>
        <LoadingModal title={'Create NFT'} visible={visible} />
        <BackButton />
        <h2 className='textmode'>Creating single NFT</h2>

        <div>
          <div>
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
                  <p className='textmode'>{'Drag and Drop your image here'}</p>
                )}
              </div>
            </div>
            <h3 className='text-upload-image textmode'>Select Storage</h3>
            <Radio.Group value={storage} onChange={handleStorageChange}>
              <Radio.Button value={0}>IPFS</Radio.Button>
              <Radio.Button value={1}>Sia</Radio.Button>
            </Radio.Group>
          </div>
          <div className='input-area'>
            <div>
              <h3 className='text-upload-image textmode'>Choose collection</h3>
              <Collections isCreateNew={isCreateNew} setIsCreateNew={setIsCreateNew} />
            </div>
            <Form onFinish={onFinish} form={form} layout='vertical'>
              <Form.Item
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input name of NFT!',
                  },
                ]}
              >
                <h3 className='text-upload-image textmode'>Name</h3>
                <Input
                  className='input-name-nft input-mode-bc'
                  placeholder='Name of NFT'
                  size='large'
                />
              </Form.Item>
              <Form.Item name='description'>
                <h3 className='text-upload-image textmode'>Description</h3>
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
