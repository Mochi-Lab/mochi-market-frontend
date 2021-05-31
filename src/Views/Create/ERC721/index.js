import { Form, Input, message, Breadcrumb } from 'antd';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import LoadingModal from 'Components/LoadingModal';
import ERC721Collections from './Collections';
import ConnectWallet from 'Components/ConnectWallet';
import { uploadIPFS } from '../UploadIpfs';
import '../index.css';
import { generateERC721NFT } from 'store/actions';
import { Link } from 'react-router-dom';

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
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/'>Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to='/create'>Create</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to='/create/erc721'>Single</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <h2 className='textmode'>Create single collectibe</h2>
        <p className='title-function'>Item Details</p>
        <p className='title-note'>Drag of chose your file to upload</p>

        <div>
          <div className='input-area'>
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
                <Input
                  addonBefore='Item Name : '
                  className='input-name-nft input-mode-bc'
                  placeholder='Name of NFT'
                  size='large'
                />
              </Form.Item>
              <Form.Item className='description' name='description' label='Description : '>
                <TextArea
                  className='input-name-nft input-mode-bc content-description'
                  autoSize={{ minRows: 6 }}
                  placeholder='Description'
                  size='large'
                />
              </Form.Item>
            </Form>
            <div>
              <h3 className='text-upload-image textmode'>Choose collection</h3>
              <ERC721Collections collectionId={collectionId} setCollectionId={setCollectionId} />
            </div>
          </div>
          <div className='area-upload'>
            <div className='drag-box-search'>
              <div className='drag-box' {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {!!files[0] ? (
                  <div className='preview'>
                    <p className='preview-title'>Preview</p>
                    <img
                      src={files[0].preview}
                      alt='priview'
                      style={{ width: '90%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <p className='textmode'>{'Drag and Drop your image here'}</p>
                )}
              </div>
              <div className='btn-721'>
                {walletAddress ? (
                  <button type='submit' className='btn-create-item' onClick={onFinish}>
                    Create Item
                  </button>
                ) : (
                  <ConnectWallet />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
