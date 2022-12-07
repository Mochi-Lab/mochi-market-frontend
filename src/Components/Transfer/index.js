import 'Views/DetailNFT/index.scss';
import { useState } from 'react';
import { Modal, Button, Input, Form, InputNumber, Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { transferNft } from 'store/actions';

export default function Transfer({ token, is1155, available, web3, statusActions }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const { addressToken, id } = useParams();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!!values) {
      await dispatch(transferNft(addressToken, transferTo, id, values.amount, is1155));
      await statusActions();
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (e) => {
    setTransferTo(e.target.value);
  };

  const checkAmount = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Enter amount'));
    } else if (parseInt(value) > parseInt(available)) {
      return Promise.reject(new Error('Not enough amount'));
    } else {
      return Promise.resolve();
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

  return (
    <>
      <div className='gSzfBw'>
        <Button shape='round' size='large' onClick={showModal}>
          Transfer
        </Button>
      </div>
      <Modal
        title={<h3 className='textmode mgb-0'>Transfer</h3>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' shape='round' size='large' onClick={() => handleCancel()}>
            Cancel
          </Button>,
          <Button key='sell' type='primary' shape='round' size='large' onClick={() => handleOk()}>
            Transfer
          </Button>,
        ]}
      >
        <div className='sell-img'>
          <img alt='img-nft' src={token.image} />
          <p className='textmode'>{token.name}</p>
        </div>
        <div className='price-des'>
          <Form form={form} layout='vertical' className='input-transfer'>
            <Row gutter={[5, 10]}>
              <Col xs={{ span: 24 }} md={{ span: is1155 ? 17 : 24 }}>
                <Form.Item
                  name={['address']}
                  rules={[{ validator: checkAddress }]}
                  label='Address Transfer'
                  required
                >
                  <Input
                    size='large'
                    className='search-style'
                    onChange={onChange}
                    placeholder='Transfer to address'
                  />
                </Form.Item>
              </Col>
              {is1155 ? (
                <Col xs={{ span: 24 }} md={{ span: 7 }}>
                  <Form.Item
                    name={['amount']}
                    rules={[{ validator: checkAmount }]}
                    label={
                      <span
                        className='cursor-pointer'
                        onClick={() => form.setFieldsValue({ amount: parseInt(available) })}
                      >
                        Amount: {available}
                      </span>
                    }
                    required
                  >
                    <InputNumber
                      min='1'
                      size='large'
                      className='search-style input-amount-transfer input-sell'
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder='Set amount'
                    />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
}
