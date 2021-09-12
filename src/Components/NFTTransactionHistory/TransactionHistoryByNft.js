import React, { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { getSymbol } from 'utils/getContractAddress';
import { Link } from 'react-router-dom';
import { getProfileByAddress } from 'APIs/Users/Gets';
import { getSellOrderHistoryByNft } from 'APIs/SellOrder/Gets';

export const Address2UserName = React.memo(({address, chainId}) => {
  const [username, setUsername] = useState(getShortAddress(address))
  const getEllipsisUserName = text => text.length > 16 ? `${text.substr(0, 16)}...` : text;
  useEffect(() => {
    (async () => {
      const {user} = await getProfileByAddress(address);
      if(user !== null) setUsername(`@${getEllipsisUserName(user.username)}`);
    })();
  }, [chainId, address])
  return <Link target="_blank" to={`/profile/${chainId}/${address.toLowerCase()}`}>{username}</Link>
})

export const getShortAddress = (address) => address.substr(0, 4) + '..' + address.slice(-2);

const columnDefs = [
  {
    title: 'Time',
    dataIndex: 'time',
    align: 'center',
    render: (t) => (
      <span title={moment.unix(t).format('DD MMM YYYY HH:mm:ss')}>
        {moment.unix(t).format('DD MMM YYYY HH:mm')}
      </span>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    align: 'center',
    render: (p) => (
      <span>{p.price} {getSymbol(Number(p.chainId))[p.token]}</span>
    )
  },
  {
    title: 'Buyer',
    dataIndex: 'buyer',
    align: 'center',
    render: params => <Address2UserName address={params.address} chainId={params.chainId}/>
  },
  {
    title: 'Seller',
    dataIndex: 'seller',
    align: 'center',
    render: params => <Address2UserName address={params.address} chainId={params.chainId}/>
  },
];

const createDataSource = (data) => {
  const transactionList = [];
  data.forEach((order) => {
    order.buyers.forEach((buyer, index) => {
      const transaction = {
        buyer: {
          address: buyer,
          chainId: order.chainId,
        },
        time: order.buyTimes[index],
        seller: {
          address: order.seller,
          chainId: order.chainId,
        },
        price: {
          price: order.price,
          token: order.token,
          chainId: order.chainId,
        },
      };
      transactionList.push(transaction)
    });
  });
  return transactionList
          .sort((x, y) => (x.time > y.time ? -1 : x.time < y.time ? 1 : 0))
          .map((transaction, index) => ({
            key: index,
            ...transaction,
          }));
};

const __TransactionHistoryByNft = ({ chainId, collectionAddress, tokenId }) => {

  const [state, setState] = useState({
    data: null,
  });

  useEffect(() => {
    (async () => {
      let result = await getSellOrderHistoryByNft(chainId, collectionAddress, tokenId);
      const orderList = result.filter(
        (order) => order.buyers.length > 0
      );
      setState((state) => ({
        ...state,
        data: createDataSource(orderList),
      }));
    })();
  }, [chainId, collectionAddress, tokenId]);

  return (
    <>
      <Table
        columns={columnDefs}
        dataSource={state.data}
        loading={state.data === null}
        pagination={false}
        size='small'
      />
    </>
  );

};

const TransactionHistoryByNft = React.memo(__TransactionHistoryByNft);

export { TransactionHistoryByNft }
