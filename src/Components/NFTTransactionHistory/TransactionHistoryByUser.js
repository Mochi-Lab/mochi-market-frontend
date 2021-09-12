import React, { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { getSymbol } from 'utils/getContractAddress';
import { getSellOrderHistoryByUser } from 'APIs/SellOrder/Gets';
import { Address2UserName } from "./TransactionHistoryByNft"
import { Link } from 'react-router-dom';

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
            <span>
                {p.price} {getSymbol(Number(p.chainId))[p.token]}
            </span>
        ),
    },
    {
        title: 'Buyer',
        dataIndex: 'buyer',
        align: 'center',
        render: ({address, chainId}) => <Address2UserName address={address} chainId={chainId} />,
    },
    {
        title: 'Seller',
        dataIndex: 'seller',
        align: 'center',
        render: ({address, chainId}) => <Address2UserName address={address} chainId={chainId} />,
    },
    {
        title: 'Item',
        dataIndex: 'item',
        align: 'center',
        render: ({itemName, chainId, collectionAddress, tokenId}) => <Link target="_blank" to={`/token/${chainId}/${collectionAddress}/${tokenId}/null`}>{itemName}</Link>
    },
    {
        title: 'Collection',
        dataIndex: 'collection',
        align: 'center',
        render: ({ chainId, address, collectionName }) => <Link target="_blank" to={`/collection/${chainId}/${address}`}>{collectionName}</Link>
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
                collection: {
                    collectionName: order.collectionName,
                    address: order.collectionAddress,
                    chainId: order.chainId,
                },
                item: {
                    itemName: order.name,
                    chainId: order.chainId,
                    collectionAddress: order.collectionAddress,
                    tokenId: order.tokenId,
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

const __TransactionHistoryByUser = ({ chainId, userAddress }) => {

    const [state, setState] = useState({
        data: null,
    });

    useEffect(() => {
        (async () => {
            let result = await getSellOrderHistoryByUser(chainId, userAddress);
            const orderList = result.filter(
                (order) => order.buyers.length > 0
            );
            setState((state) => ({
                ...state,
                data: createDataSource(orderList),
            }));
        })();
    }, [chainId, userAddress]);

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

const TransactionHistoryByUser = React.memo(__TransactionHistoryByUser);

export { TransactionHistoryByUser }
