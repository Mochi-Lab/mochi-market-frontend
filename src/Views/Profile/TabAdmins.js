import { useCallback, useEffect, useState } from 'react';
import { Button, Input, message, Table, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdmins, showNotification } from 'store/actions';
import store from 'store/index';
import { getNonce } from 'APIs/Users/Gets';
import createSignature from 'APIs/createSignature';
import { verifySignature } from 'APIs/Users/Posts';
import { changeRole } from 'APIs/Users/Puts';

export default function TabAdmins() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { infoAdmins, chainId, walletAddress, web3 } = useSelector((state) => state);

  const [loading, setLoading] = useState({ key: '', status: false });
  const [addAdmin, setAddAdmin] = useState(false);
  const [addressAdd, setAddressAdd] = useState();

  let columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div>
          {address.slice(0, 7)}...{address.slice(address.length - 7, address.length)}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      render: (username) => <div key={username}>{!!username ? username : 'Unamed'}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        switch (role) {
          case 0:
            return <div>Administrator</div>;
          case 1:
            return <div>Admin</div>;

          default:
            return <div>Admin</div>;
        }
      },
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'action',
      render: (admin) => {
        if (
          admin.role === 1 &&
          !!walletAddress &&
          !!infoAdmins[walletAddress.toString().toLowerCase()] &&
          infoAdmins[walletAddress.toString().toLowerCase()].role === 0
        ) {
          return (
            <div className='delete-admin'>
              <Button
                type='primary'
                danger
                shape='round'
                onClick={() => handleChangeRole(admin.address, 2, 'Delete', admin.address)}
                loading={
                  loading.key.toLowerCase() === admin.address.toLowerCase() && !!loading.status
                }
              >
                Delete
              </Button>
            </div>
          );
        }
      },
    },
  ];

  const fetchAdmins = useCallback(async () => {
    await store.dispatch(getAllAdmins());
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins, chainId, walletAddress]);

  const handleChangeRole = async (addressUpdate, role, msg, keyLoading) => {
    try {
      setLoading({ key: keyLoading, status: true });
      const resNonce = await getNonce(walletAddress);
      const signature = await createSignature(web3, walletAddress, resNonce.nonce);
      const verify = await verifySignature(walletAddress, signature);
      if (!!verify.status) {
        let resUpdate = await changeRole(walletAddress, signature, addressUpdate, role);
        if (resUpdate) {
          await dispatch(getAllAdmins());
          let noti = {};
          noti.type = 'success';
          noti.message = `${msg} Successfully`;
          dispatch(showNotification(noti));
          setLoading({ key: '', status: false });
          return true;
        } else {
          let noti = {};
          noti.type = 'error';
          noti.message = `${msg} Fail`;
          dispatch(showNotification(noti));
          setLoading({ key: '', status: false });
          return false;
        }
      } else {
        message.error('Verify failed');
        setLoading({ key: '', status: false });
        return false;
      }
    } catch (error) {
      setLoading({ key: '', status: false });
      return false;
    }
  };

  const checkAddress = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Enter address'));
    } else if (!web3.utils.isAddress(value)) {
      return Promise.reject(new Error('Address incorrect format'));
    } else {
      return Promise.resolve();
    }
  };

  const handleAddAdmin = async () => {
    const values = await form.validateFields();
    if (!!values) {
      let res = await handleChangeRole(addressAdd, 1, 'Add', 'addAdmin');
      if (!!res) {
        setAddAdmin(false);
        setAddressAdd('');
        form.setFieldsValue({ address: '' });
      }
    }
  };

  return (
    <div className='tab-manger-admins'>
      {!!infoAdmins[walletAddress.toString().toLowerCase()] &&
        infoAdmins[walletAddress.toString().toLowerCase()].role === 0 && (
          <div className='box-add-admin'>
            <div className='btn-add'>
              {addAdmin ? (
                <div className='is-add-admin'>
                  <div className='box-btn'>
                    <Button shape='round' onClick={() => setAddAdmin(false)} className='mr-0d5rem'>
                      Cancel
                    </Button>
                    <Button
                      type='primary'
                      shape='round'
                      className='mr-0d5rem'
                      loading={loading.key === 'addAdmin' && !!loading.status}
                      onClick={() => handleAddAdmin()}
                    >
                      Add
                    </Button>
                  </div>
                  <div className='input-add'>
                    <Form form={form}>
                      <Form.Item name={['address']} rules={[{ validator: checkAddress }]} required>
                        <Input
                          className='input-add-address textmode'
                          value={addressAdd}
                          onChange={(e) => setAddressAdd(e.target.value)}
                        />
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : (
                <Button type='primary' shape='round' onClick={() => setAddAdmin(true)}>
                  Add Admin
                </Button>
              )}
            </div>
          </div>
        )}
      <div className='list-item-admin'>
        <Table
          dataSource={Object.values(infoAdmins).map((admin) => {
            admin['key'] = admin.address;
            return admin;
          })}
          columns={columns}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
}
