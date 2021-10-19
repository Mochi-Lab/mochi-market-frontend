import { Modal, Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';

export const UpdateNFTDetail = ({ token, setToken }) => {
  const [loading, setLoading] = useState(false);
  const { chainId, tokenId, tokenURI, collectionAddress } = token;
  const updateNFTDetail = async () => {
    try {
      setLoading(true);
      // Kryptomon
      if (collectionAddress === '0xc33d69a337b796a9f0f7588169cd874c3987bde9') {
        const metadata = (await axios.get(tokenURI)).data;
        if (metadata['status'] === 'not_found') {
          Modal.warning({
            title: 'Your Egg has not been activated',
            content: (
              <span>
                Please activate your egg at
                <a href='https://kryptomon.co/' target='_blank' rel='noreferrer'>
                  kryptomon.co
                </a>
              </span>
            ),
            centered: true,
            maskClosable: true,
          });
          return setLoading(false);
        }
      }
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/nft/updateNft`, {
        chainId,
        tokenId,
        address: collectionAddress,
      });
      const updatedDetail = result.data;
      setToken({
        ...updatedDetail,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error(`${err.message}`);
    }
  };
  return (
    <>
      <Button
        style={{
          borderRadius: '1rem',
          borderColor: 'transparent',
          color: 'white',
          background: '#ff0086',
        }}
        onClick={updateNFTDetail}
        disabled={loading}
      >
        <span>{loading ? 'Updating Metadata ...' : 'Update NFT Metadata'}</span>
      </Button>
    </>
  );
};
