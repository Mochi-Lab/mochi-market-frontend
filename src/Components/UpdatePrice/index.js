import 'Views/DetailNFT/index.scss';
import { Button, InputNumber, Modal, Form, Input, Select, Col, Row } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updatePrice } from 'store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getTokensPayment } from 'utils/getContractAddress';

import '../Sell/index.scss';

const { Option } = Select;

export default function UpdatePrice({ orderDetail, token, is1155, statusActions }) {
  const dispatch = useDispatch();
  const [currentPrice, setCurrentPrice] = useState(!!orderDetail ? orderDetail.price : undefined);
  const { web3, chainId } = useSelector((state) => state);

  const { sellID } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tokenPayment, setTokenPayment] = useState();

  const [form] = Form.useForm();
  useEffect(() => {
    if (!!chainId) {
      setTokenPayment(getTokensPayment(chainId)[0].address);
    }
  }, [chainId]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = useCallback(async () => {
    const values = await form.validateFields();
    if (!!values && parseFloat(values.price) > 0) {
      const success = await dispatch(
        updatePrice(sellID, web3.utils.toWei(values.price.toString(), 'ether'))
      );
      await statusActions();
      setIsModalVisible(false);
      if (success) setCurrentPrice(values.price);
    }
  }, [dispatch, web3.utils, sellID, form, statusActions]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='gSzfBw'>
        <Button type='primary' shape='round' size='large' onClick={showModal}>
          Update Price
        </Button>
      </div>

      <Modal
        title={<h3 className='textmode mgb-0'>Update Price</h3>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' shape='round' size='large' onClick={() => handleCancel()}>
            Cancel
          </Button>,
          <Button key='sell' type='primary' shape='round' size='large' onClick={() => handleOk()}>
            Update
          </Button>,
        ]}
      >
        <div className='sell-img'>
          <img alt='img-nft' src={token.image} />
          <p className='textmode'>{token.name}</p>
        </div>
        <div className='price-des'>
          <p className='textmode'>Price</p>

          <p className='textmode'>Will be on sale until you transfer this item or cancel it.</p>
        </div>
        <Form
          form={form}
          className='input-sell'
          layout='vertical'
          initialValues={{
            price: !!orderDetail ? orderDetail.price : 0,
            amount: !!orderDetail ? orderDetail.amount : 0,
          }}
        >
          <Row gutter={[5, 10]}>
            <Col xs={{ span: 24 }} md={{ span: is1155 ? 17 : 24 }}>
              <div className='ant-col ant-form-item-label'>
                <label htmlFor='price' className='ant-form-item-required' title='Price'>
                  Price
                </label>
              </div>
              <Input.Group compact label='Price'>
                <Select
                  size='large'
                  value={orderDetail ? orderDetail.token : tokenPayment}
                  onChange={(value) => setTokenPayment(value)}
                  disabled
                >
                  {!!getTokensPayment(chainId)
                    ? getTokensPayment(chainId).map((token, i) => {
                        return (
                          <Option value={token.address} key={i}>
                            <img
                              className='icon-tokenpayment'
                              src={token.icon}
                              alt={token.symbol}
                            />
                          </Option>
                        );
                      })
                    : null}
                </Select>
                <Form.Item
                  name={['price']}
                  rules={[
                    { required: true, message: 'Enter price' },
                    () => ({
                      validator(_, value) {
                        if (value !== currentPrice) return Promise.resolve();
                        return Promise.reject(new Error('Price is not changed'));
                      },
                    }),
                  ]}
                  className='input-price'
                >
                  <InputNumber
                    min='0.1'
                    size='large'
                    className='search-style'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder='Set Price'
                  />
                </Form.Item>
              </Input.Group>
            </Col>
            {is1155 ? (
              <Col xs={{ span: 24 }} md={{ span: 7 }}>
                <Input.Group>
                  <Form.Item
                    required
                    name={['amount']}
                    label='Amount'
                    className='input-amount-sell'
                  >
                    <InputNumber
                      min='1'
                      size='large'
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder='Amount'
                      disabled
                    />
                  </Form.Item>
                </Input.Group>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
}
