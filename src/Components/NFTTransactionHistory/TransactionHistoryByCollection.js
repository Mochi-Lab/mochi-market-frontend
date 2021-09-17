import React, { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { getSymbol } from 'utils/getContractAddress';
import { Link } from 'react-router-dom';
import { getSellOrderHistoryByNft } from 'APIs/SellOrder/Gets';
import { Address2UserName } from "./TransactionHistoryByNft"

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
    title: 'Item',
    dataIndex: 'item',
    align: 'center',
    render: ({itemName, chainId, collectionAddress, tokenId}) => <Link target="_blank" to={`/token/${chainId}/${collectionAddress}/${tokenId}/null`}>{itemName}</Link>
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
        item: {
          itemName: order.name,
          chainId: order.chainId,
          collectionAddress: order.collectionAddress,
          tokenId: order.tokenId,
        }
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

const __TransactionHistoryByCollection = ({ chainId, collectionAddress, tokenId }) => {

  const [state, setState] = useState({
    data: null,
  });

  useEffect(() => {
    (async () => {
      let result = await getSellOrderHistoryByNft(chainId, collectionAddress, false);
      const orderList = result
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

const TransactionHistoryByCollection = React.memo(__TransactionHistoryByCollection);

export { TransactionHistoryByCollection }
