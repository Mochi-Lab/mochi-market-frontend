import { useState, createRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from 'store/actions';
import { Button, Modal, Form, Input, message } from 'antd';
import { checkUsernameExists, getNonce } from 'APIs/Users/Gets';
import { checkUrl } from 'utils/helper';
import { verifySignature, updateProfile } from 'APIs/Users/Posts';
import { uploadIPFS, updateIPFS } from './UpdateIPFS';
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
import './index.scss';

const { TextArea } = Input;

export default function Edit({ visible, setvisibleEitdProfile, infoUser, getInfoUser }) {
  const [form] = Form.useForm();
  const avatarRef = createRef();
  const coverRef = createRef();

  const dispatch = useDispatch();

  const [avatarImg, setAvatarImg] = useState([]);
  const [coverImg, setCoverImg] = useState([]);
  const [checkAvatar, setCheckAvatar] = useState(true);
  const [userInfoNew, setUserInfoNew] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { walletAddress, web3 } = useSelector((state) => state);

  useEffect(() => {
    if (!!infoUser.address) {
      form.setFieldsValue(infoUser);
    } else {
      form.resetFields();
      setAvatarImg([]);
      setCoverImg([]);
    }
  }, [infoUser, form]);

  const handleOk = async () => {
    let checkAvatar = !!infoUser.avatar || avatarImg.length > 0;
    if (!checkAvatar) setCheckAvatar(false);
    else setCheckAvatar(true);
    const values = await form.validateFields();
    if (!!values && !!checkAvatar) {
      try {
        setLoadingUpdate(true);
        const resNonce = await getNonce(walletAddress);
        const signature = await createSignature(web3, walletAddress, resNonce.nonce);
        const verify = await verifySignature(walletAddress, signature);
        if (!!verify.status) {
          let user = userInfoNew;
          user.address = walletAddress;
          user.signature = signature;
          // Update avatar or upload new
          let resAvatar;
          if (avatarImg.length > 0) {
            if (!!infoUser.hashAvatar) {
              resAvatar = await updateIPFS(avatarImg, infoUser.hashAvatar);
            } else {
              resAvatar = await uploadIPFS(avatarImg);
            }
            if (!!resAvatar.image) {
              user.avatar = resAvatar.image;
              user.hashAvatar = resAvatar.ipfsHash;
            } else {
              let noti = {};
              noti.type = 'error';
              noti.message = 'Update Avatar Fail';
              dispatch(showNotification(noti));
              setLoadingUpdate(false);
              return;
            }
          }

          // Update background or upload new
          let resCover;
          if (coverImg.length > 0) {
            if (!!infoUser.hashCover) {
              resCover = await updateIPFS(coverImg, infoUser.hashCover);
            } else {
              resCover = await uploadIPFS(coverImg);
            }
            if (!!resCover.image) {
              user.cover = resCover.image;
              user.hashCover = resCover.ipfsHash;
            } else {
              let noti = {};
              noti.type = 'error';
              noti.message = 'Update Background Fail';
              dispatch(showNotification(noti));
              setLoadingUpdate(false);
              return;
            }
          }
          let resUpdate = await updateProfile(user);
          if (resUpdate) {
            await getInfoUser();
            let noti = {};
            noti.type = 'success';
            noti.message = 'Updated Successfully';
            dispatch(showNotification(noti));
            setvisibleEitdProfile(false);
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

  const checkUserName = async (_, username) => {
    if (!username) {
      return Promise.reject(new Error('Please enter username'));
    } else {
      if (!!infoUser.username && username === infoUser.username) {
        return Promise.resolve();
      } else {
        const res = await checkUsernameExists(username);
        if (!res.msg) {
          if (!!res.status) return Promise.reject(new Error('Username already exists'));
          else {
            setUserInfoNew({ ...userInfoNew, username: username });
            return Promise.resolve();
          }
        } else {
          return Promise.reject(new Error('Server error'));
        }
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
          Edit your Profile
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
      onCancel={() => (loadingUpdate ? null : setvisibleEitdProfile(false))}
      width={600}
      maskClosable={loadingUpdate ? false : true}
    >
      <Form form={form} layout='vertical'>
        <div className='form-input-profile'>
          <div className='grap-box'>
            <div className='row-item'>
              <div className='wrap-item-upload'>
                <Dropzone
                  ref={avatarRef}
                  accept='image/*'
                  onDrop={(acceptedFiles) => {
                    setAvatarImg(
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
                        {...getRootProps({ className: 'upload-img upload-avatar', name: 'avatar' })}
                      >
                        <input {...getInputProps()} />
                        {!!avatarImg[0] || !!infoUser.avatar ? (
                          <div className='preview'>
                            <img
                              src={!!avatarImg[0] ? avatarImg[0].preview : infoUser.avatar}
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
                            <div className='title-upload textmode required'>Upload avatar</div>
                            {!checkAvatar ? (
                              <div className='ant-form-item-explain ant-form-item-explain-error'>
                                <div role='alert'>Please upload avatar</div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </Dropzone>
                <Dropzone
                  ref={coverRef}
                  accept='image/*'
                  onDrop={(acceptedFiles) => {
                    setCoverImg(
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
                        {...getRootProps({ className: 'upload-img upload-cover' })}
                      >
                        <input {...getInputProps()} />
                        {!!coverImg[0] || !!infoUser.cover ? (
                          <div className='preview'>
                            <img
                              src={!!coverImg[0] ? coverImg[0].preview : infoUser.cover}
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
                          <div className='title-upload textmode'>Upload cover</div>
                        )}
                      </div>
                    );
                  }}
                </Dropzone>
              </div>
            </div>
            <div className='row-item'>
              <div className='input-item'>
                <div className='label-input-item textmode required'>Username</div>
                <Form.Item required name={['username']} rules={[{ validator: checkUserName }]}>
                  <Input className='input textmode' size='large' />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='input-item'>
                <div className='label-input-item textmode required'>Email</div>
                <Form.Item
                  required
                  name={['email']}
                  rules={[
                    {
                      pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                      message: 'Email invalidate',
                    },
                    { required: true, message: 'Please enter email' },
                  ]}
                >
                  <Input
                    className='input textmode'
                    size='large'
                    onChange={(e) => {
                      if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(e.target.value))
                        setUserInfoNew({ ...userInfoNew, email: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='row-item'>
              <div className='input-item'>
                <div className='label-input-item textmode required'>Bio</div>
                <Form.Item
                  required
                  name={['bio']}
                  rules={[{ required: true, message: 'Please enter bio' }]}
                >
                  <TextArea
                    className='textmode'
                    size='large'
                    onChange={(e) => {
                      setUserInfoNew({ ...userInfoNew, bio: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, twitter: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, telegram: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, discord: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, youtube: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, facebook: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, instagram: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, github: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, medium: e.target.value });
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
                        setUserInfoNew({ ...userInfoNew, tiktok: e.target.value });
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
