import { Card, Col, Popover, Row } from 'antd';
import { getDetailNFT } from 'APIs/NFT/Get';
import tick from 'Assets/icons/tick-green.svg';
import imgNotFound from 'Assets/notfound.png';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { getSymbol } from 'utils/getContractAddress';
import { handleChildClick, objToString } from 'utils/helper';

export const useNFTDetail = (token, chainId) => {
    const [detailNFT, setDetailNFT] = useState(null);
    useEffect(() => {
        (async () => {
            if (!token) return setDetailNFT({ name: '', description: '', image: imgNotFound });
            try {
                let nft = await getDetailNFT(chainId, token.collectionAddress, token.tokenId);
                if (!nft.name || nft.name === 'Unnamed') nft.name = 'ID: ' + token.tokenId;
                token.nameCollection = (
                    await store.dispatch(getCollection(nft.collectionAddress, null))
                ).collection.name;
                setDetailNFT(nft);
            } catch (error) {
                setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
            }
        })();
    }, [token, chainId]);
    return detailNFT;
}

export const NFTCardLoader = ({className = ''}) => {
    return (
        <Card
            className={classNames('card-nft', 'card-nft-content-loader', className)}
            cover={
                <div className='wrap-cover'>
                    <div className='NFTResource-Wrapper'>
                        <img
                            className='display-resource-nft'
                            src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                            alt=''
                        />
                    </div>
                </div>
            }
        >
            <Row justify='space-between'>
                <Col className='footer-card-left'>
                    <div className='name-collection'>&nbsp;</div>
                    <div className='name-nft'>&nbsp;</div>
                </Col>
            </Row>
        </Card>
    )
}

export const NFTCard = ({
    chainId,
    token,
    detailNFT,
    collectionName,
    verifiedContracts,
    className = '',
    enableCollectionLink = true,
    footerNode = null,
}) => {
    const _collectionName = collectionName || (detailNFT && detailNFT.nameCollection) || (token && token.nameCollection) || '';
    return (
        <Link
            to={`/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${token.sellId || null}`}
            target='_blank'
        >
            <Card
                hoverable
                cover={
                    <div className='wrap-cover'>
                        <div
                            className='blurred-background'
                            style={{
                                backgroundImage: `url(${token.image || detailNFT.image})`,
                            }}
                        />
                        <div className='NFTResource-Wrapper'>
                            <img
                                alt={`img-nft-${token.tokenId}`}
                                src={token.image || detailNFT.image}
                                className='display-resource-nft'
                            />
                        </div>
                    </div>
                }
                className={classNames('card-nft', className)}
            >
                {!!token.attributes && token.attributes.length > 0 && (
                    <Popover
                        onClick={handleChildClick}
                        placement='bottomLeft'
                        content={token.attributes.map((attr, i) => (
                            <div key={i} onClick={handleChildClick}>
                                <strong>{attr.trait_type}</strong>:&nbsp;
                                {!!attr.display_type &&
                                    attr.display_type.toLowerCase() === 'date' &&
                                    !!moment(attr.value).isValid()
                                    ? moment(
                                        attr.value.toString().length < 13 ? attr.value * 1000 : attr.value
                                    ).format('DD-MM-YYYY')
                                    : typeof attr.value === 'object'
                                        ? objToString(attr.value)
                                        : attr.value}
                            </div>
                        ))}
                    >
                        <div className='attribs-nft' onClick={handleChildClick}>
                            Stats
                        </div>
                    </Popover>
                )}
                {!!token.price && (
                    <div className='price-nft textmode'>
                        <span>{token.price}</span> <b>{getSymbol(chainId)[token.token]}</b>
                    </div>
                )}
                <Row justify='space-between'>
                    {
                        footerNode || (
                            <Col className='footer-card-left'>
                                <div className='name-collection'>
                                    {
                                        enableCollectionLink
                                            ? ( <Link 
                                                    to={`/collection/${chainId}/${token.collectionAddress}`}
                                                    className='link-collection-name'
                                                    tag='span'
                                                >{_collectionName}</Link>
                                            )
                                            : <>{_collectionName}</>
                                    }
                                    {!!token.collectionAddress && verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) && (
                                        <img src={tick} alt='icon-tick' className='icon-tick' />
                                    )}{' '}
                                </div>
                                <div className='name-nft textmode'>
                                    {token.name || detailNFT.name}
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </Card>
        </Link>
    )
}
