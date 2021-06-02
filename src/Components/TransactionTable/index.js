import { Table, Layout, Checkbox, Divider } from 'antd';
import {
  FileDoneOutlined,
  ShopOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { getWeb3List } from 'utils/getWeb3List';

const { Content } = Layout;

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Created', 'List', 'Sale', 'Cancel', 'Transfer'];
const defaultCheckedList = ['Created', 'List', 'Sale', 'Cancel', 'Transfer'];
// const NullAddress = '0x0000000000000000000000000000000000000000';

export default function TransactionTable() {
  const dispatch = useDispatch();
  const { web3, sellOrderList, erc721Instances, walletAddress, chainId, market } = useSelector(
    (state) => state
  );
  const [txns /* , setTxns */] = useState([]);
  const [filterTxns, setFilterTxns] = useState([]);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const firstUpdate = useRef(true);
  useEffect(() => {
    // const fetchTxns = async () => {
    //   var getERC721Txn = (instance) => {
    //     return new Promise(async (resolve) => {
    //       let txn = [];
    //       await instance.events.Transfer(
    //         {
    //           filter: { to: walletAddress },
    //           fromBlock: 0,
    //         },
    //         function (error, event) {
    //           event.key = event.id;
    //           event.event = event.returnValues.from === NullAddress ? 'Created' : 'Transfer';
    //           if (event.returnValues.from !== market._address) {
    //             setTxns((txns) => [...txns, event]);
    //           }
    //         }
    //       );
    //       // Transfer sent
    //       await instance.events.Transfer(
    //         {
    //           filter: { from: walletAddress },
    //           fromBlock: 0,
    //         },
    //         function (error, event) {
    //           event.key = event.id;
    //           event.event = 'Transfer';
    //           if (event.returnValues.to !== market._address) {
    //             setTxns((txns) => [...txns, event]);
    //           }
    //         }
    //       );
    //       resolve(txn);
    //     });
    //   };
    //   if (!!erc721Instances)
    //     await Promise.all([
    //       erc721Instances.map(async (instance) => {
    //         return await getERC721Txn(instance);
    //       }),
    //       // List to market
    //       await sellOrderList.events.SellOrderAdded(
    //         {
    //           filter: { seller: walletAddress },
    //           fromBlock: 0,
    //         },
    //         function (error, event) {
    //           event.key = event.id;
    //           event.event = 'List';
    //           setTxns((txns) => [...txns, event]);
    //         }
    //       ),
    //       // Cancel order
    //       await sellOrderList.events.SellOrderDeactive(
    //         {
    //           filter: { seller: walletAddress },
    //           fromBlock: 0,
    //         },
    //         function (error, event) {
    //           event.key = event.id;
    //           event.event = 'Cancel';
    //           setTxns((txns) => [...txns, event]);
    //         }
    //       ),
    //       // Order successfully
    //       await sellOrderList.events.SellOrderCompleted(
    //         {
    //           filter: { seller: walletAddress },
    //           fromBlock: 0,
    //         },
    //         function (error, event) {
    //           event.key = event.id;
    //           event.event = 'Sale';
    //           setTxns((txns) => [...txns, event]);
    //         }
    //       ),
    //     ]);
    // };
    // if (walletAddress && erc721Instances && sellOrderList) fetchTxns();
  }, [dispatch, walletAddress, erc721Instances, sellOrderList, market]);

  useEffect(() => {
    if (!firstUpdate.current) {
      let filterTxns = txns.filter((value) => checkedList.includes(value.event));
      setFilterTxns(filterTxns);
      setIsChecked(true);
    } else firstUpdate.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedList]);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event',
      render: (event) => {
        return (
          <h3 className='events-history'>
            {event === 'Created' ? <FileDoneOutlined /> : null}
            {event === 'List' ? <ShopOutlined /> : null}
            {event === 'Cancel' ? <ExclamationCircleOutlined /> : null}
            {event === 'Sale' ? <ShoppingCartOutlined /> : null}
            {event === 'Transfer' ? <SwapOutlined /> : null}
            <span>{event}</span>
          </h3>
        );
      },
      key: 'event',
    },
    {
      title: 'Item.ID',
      dataIndex: 'returnValues',
      render: (value) => <p style={{ margin: 0 }}>{value.tokenId}</p>,
      key: 'returnValues.tokenId',
    },
    {
      title: 'Price',
      dataIndex: 'returnValues',
      render: (value) => {
        if (value && value.price)
          return <p style={{ margin: 0 }}>{web3.utils.fromWei(value.price, 'ether')} BNB</p>;
        else <></>;
      },
      key: 'returnValues.price',
    },
    {
      title: 'From',
      dataIndex: 'returnValues',
      render: (value) => {
        let from = '';
        if (!!value.from) from = value.from.substr(0, 15) + '...';
        if (!!value.owner) from = value.owner.substr(0, 15) + '...';
        if (!!value.seller) from = value.seller.substr(0, 15) + '...';

        return <p style={{ margin: 0 }}>{from}</p>;
      },
      key: 'returnValues.from',
      width: 150,
    },
    {
      title: 'To',
      dataIndex: 'returnValues',
      render: (value) => {
        let to = '';
        if (!!value.to) to = value.to.substr(0, 15) + '...';
        if (!!value.owner) to = value.approved.substr(0, 15) + '...';
        if (!!value.buyer) to = value.buyer.substr(0, 15) + '...';
        return <p style={{ margin: 0 }}>{to}</p>;
      },
      key: 'returnValues.to',
      width: 150,
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.blockNumber - b.blockNumber,
    },
    {
      title: 'View',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: (value) => (
        <a target='_blank' rel='noopener noreferrer' href={getWeb3List(chainId).explorer + value}>
          View
        </a>
      ),
    },
  ];

  return (
    <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }} className='background-mode'>
      <Content
        className='site-layout-background'
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            Check all
          </Checkbox>

          <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
          <Divider />
        </>
        <Table
          columns={columns}
          dataSource={isChecked ? filterTxns : txns}
          pagination={{ size: 'small' }}
          scroll={{ x: '100%' }}
        />
      </Content>
    </Layout>
  );
}
