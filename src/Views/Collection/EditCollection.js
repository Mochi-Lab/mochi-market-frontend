import { useState, createRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from 'store/actions';
import { Button, Modal, Form, Input, message } from 'antd';
import { getNonce } from 'APIs/Collections/Gets';
import { checkUrl } from 'utils/helper';
import { verifySignature } from 'APIs/Collections/Post';
import { updateCollection } from 'APIs/Collections/Puts';
import { getCollectionByAddress } from 'APIs/Collections/Gets';
import { uploadIPFS, updateIPFS } from 'Views/Profile/UpdateIPFS';
import createSignature from 'APIs/createSignature';
import Dropzone from 'react-dropzone';
import discord from 'Assets/icons/discord-01.svg';
import youtube from 'Assets/icons/youtube.svg';
import facebook from 'Assets/icons/facebook-01.svg';
import instagram from 'Assets/icons/instagram.svg';
import medium from 'Assets/icons/medium-01.svg';
import tiktok from 'Assets/icons/tiktok.svg';
import github from 'Assets/icons/github-01.svg';
import twitter from 'Assets/icons/twitter-01.svg';
import telegram from 'Assets/icons/telegram-01.svg';
import website from 'Assets/icons/website.svg';
import './index.scss';

const { TextArea } = Input;

export default function EditCollection({
  visible,
  setvisibleEitdCollection,
  infoCollection,
  getInfoCollection,
  addressToken,
  chainId,
}) {
  const [form] = Form.useForm();
  const logoRef = createRef();

  const dispatch = useDispatch();

  const [logoImg, setLogoImg] = useState([]);
  const [checkLogo, setCheckLogo] = useState(true);
  const [collectionInfoNew, setCollectionInfoNew] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { walletAddress, web3 } = useSelector((state) => state);

  useEffect(() => {
    if (!!infoCollection) {
      form.setFieldsValue(infoCollection);
    } else {
      form.resetFields();
      setLogoImg([]);
    }
  }, [infoCollection, form]);

  const handleOk = async () => {
    let checkLogo = !!infoCollection.logo || logoImg.length > 0;
    if (!checkLogo) setCheckLogo(false);
    else setCheckLogo(true);
    const values = await form.validateFields();
    if (!!values && !!checkLogo) {
      try {
        setLoadingUpdate(true);
        const resNonce = await getNonce(walletAddress, addressToken, chainId);
        const signature = await createSignature(web3, walletAddress, resNonce.nonce);
        const verify = await verifySignature(chainId, addressToken, walletAddress, signature);
        if (!!verify.status) {
          let collection = collectionInfoNew;
          collection.addressSubmit = walletAddress;
          collection.signature = signature;
          // Update avatar or upload new
          let resAvatar;
          if (logoImg.length > 0) {
            if (!!infoCollection.hashAvatar) {
              resAvatar = await updateIPFS(logoImg, infoCollection.hashAvatar);
            } else {
              resAvatar = await uploadIPFS(logoImg);
            }
            if (!!resAvatar.image) {
              collection.logo = resAvatar.image;
              collection.hashLogo = resAvatar.ipfsHash;
            } else {
              let noti = {};
              noti.type = 'error';
              noti.message = 'Update Logo Fail';
              dispatch(showNotification(noti));
              setLoadingUpdate(false);
              return;
            }
          }

          let resUpdate = await updateCollection(
            walletAddress,
            signature,
            addressToken,
            chainId,
            collection
          );
          if (resUpdate) {
            let resCollections = await getCollectionByAddress(addressToken, chainId);
            await getInfoCollection(resCollections.collection);
            let noti = {};
            noti.type = 'success';
            noti.message = 'Updated Successfully';
            dispatch(showNotification(noti));
            setvisibleEitdCollection(false);
          } else {
            let noti = {};
            noti.type = 'error';
            noti.message = 'Update Fail';
            dispatch(showNotification(noti));
          }
        } else {
          message.error('Verify failed');
        }
        setLoadingUpdate(false);
      } catch (error) {
        setLoadingUpdate(false);
      }
    }
  };

  const validateUrl = async (_, url) => {
    if (!url) {
      return Promise.resolve();
    } else {
      if (checkUrl(url)) return Promise.resolve();
      else return Promise.reject(new Error('URL invalidate'));
    }
  };

  return (
    <Modal
      title={
        <p className='textmode mgb-0' style={{ fontSize: '28px', fontWeight: '900' }}>
          Edit Collection
        </p>
      }
      visible={visible}
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
      onCancel={() => (loadingUpdate ? null : setvisibleEitdCollection(false))}
      width={600}
      maskClosable={loadingUpdate ? false : true}
    >
      <Form form={form} layout='vertical'>
        <div className='form-input-profile'>
          <div className='grap-box'>
            <div className='row-item'>
              <div className='wrap-item-upload'>
                <Dropzone
                  ref={logoRef}
                  accept='image/*'
                  onDrop={(acceptedFiles) => {
                    setLogoImg(
                      acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      )
                    );
                  }}
                  multiple={true}
                >
                  {({ getRootProps, getInputProps }) => {
                    return (
                      <div
                        className='drag-box'
                        {...getRootProps({
                          className: 'upload-img upload-avatar logo-collection-edit',
                          name: 'logo',
                        })}
                      >
                        <input {...getInputProps()} />
                        {!!logoImg[0] || !!infoCollection.logo ? (
                          <div className='preview'>
                            <img
                              src={!!logoImg[0] ? logoImg[0].preview : infoCollection.logo}
                              alt='priview'
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '1rem',
                              }}
                            />
                          </div>
                        ) : (
                          <div className='row-column margin-0-auto'>
                            <div className='title-upload textmode required'>Upload logo</div>
                            {!checkLogo ? (
                              <div className='ant-form-item-explain ant-form-item-explain-error'>
                                <div role='alert'>Please upload logo</div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Dropzone>
              </div>
            </div>
            <div className='row-item'>
              <div className='input-item'>
                <div className='label-input-item textmode required'>Display Name </div>
                <Form.Item
                  required
                  name={['name']}
                  rules={[{ required: true, message: 'Please enter name collection' }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      setCollectionInfoNew({ ...collectionInfoNew, name: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='input-item'>
                <div className='label-input-item textmode required'>Description</div>
                <Form.Item
                  required
                  name={['description']}
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <TextArea
                    className='textmode'
                    size='large'
                    onChange={(e) => {
                      setCollectionInfoNew({ ...collectionInfoNew, description: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={website} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Website</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['website']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, website: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={twitter} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Twitter</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['twitter']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, twitter: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={telegram} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Telegram</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['telegram']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, telegram: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={discord} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Discord</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['discord']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, discord: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={youtube} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>YouTube</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['youtube']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, youtube: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={facebook} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Facebook</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['facebook']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, facebook: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={instagram} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Instagram</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['instagram']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, instagram: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={github} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Github</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['github']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, github: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={medium} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Medium</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['medium']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, medium: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='row-input-optional'>
                <div className='title-input-optional'>
                  <div className='label-input'>
                    <div className='icon'>
                      <img src={tiktok} alt='icon-title' width='24px' height='24px' />
                    </div>
                    <div className='title textmode'>Titok</div>
                  </div>
                </div>
                <Form.Item
                  className='input-optional'
                  name={['tiktok']}
                  rules={[{ validator: validateUrl }]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (checkUrl(e.target.value) || !e.target.value)
                        setCollectionInfoNew({ ...collectionInfoNew, tiktok: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
