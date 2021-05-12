import { Form, Input, Button, Row, message } from 'antd';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import LoadingModal from 'Components/LoadingModal';
import ERC721Collections from './Collections';
import ConnectWallet from 'Components/ConnectWallet';
import BackButton from 'Components/BackButton';
import { uploadIPFS } from '../UploadIpfs';
import '../index.css';
import { generateERC721NFT } from 'store/actions';

const { TextArea } = Input;

export default function CreateERC721() {
  const { walletAddress } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [collectionId, setCollectionId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

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

  const onFinish = async (values) => {
    if (files.length > 0) {
      setVisible();
      // upload image
      setIsLoading(true);
      let tokenUri = await uploadIPFS(values, files);
      setIsLoading(false);

      // mint token
      setVisible(true);
      await dispatch(generateERC721NFT(collectionId, tokenUri));
      setVisible(false);

      // reset form and file
      setFiles([]);
      form.resetFields();
    } else message.warn('Did you forget upload an Image ?');
  };

  return (
    <div className='center create-pt'>
      {isLoading ? <LoadingModal title={'Upload Image'} visible={true} /> : <></>}
      <div className='my-collection'>
        <LoadingModal title={'Create NFT'} visible={visible} />
        <BackButton />
        <h2 className='textmode'>You can create NFT for your own !!!</h2>

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
          </div>
          <div className='input-area'>
            <div>
              <h3 className='text-upload-image textmode'>Choose collection</h3>
              <ERC721Collections collectionId={collectionId} setCollectionId={setCollectionId} />
            </div>
            <Form onFinish={onFinish} form={form} layout='vertical'>
              <Form.Item
                label='Name'
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
                  placeholder='Name of Nft'
                  size='large'
                />
              </Form.Item>
              <Form.Item label='Description' name='description'>
                <TextArea
                  className='input-name-nft input-mode-bc'
                  autoSize={{ minRows: 6 }}
                  placeholder='Description'
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
