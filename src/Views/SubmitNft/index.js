import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { registerNft, acceptNft } from 'store/actions';
import { useSelector } from 'react-redux';
import './index.css';

export default function SubmitNFT() {
  const { walletAddress, adminAddress } = useSelector((state) => state);
  const [contractAddress, setContractAddress] = useState('');
  const [acceptContractAddress, setAcceptContractAddress] = useState('');
  const dispatch = useDispatch();
  const register = async ({ isERC1155 }) => {
    if (!!walletAddress) {
      await dispatch(registerNft(contractAddress, isERC1155));
    } else message.warn('Please login before submit');
  };

  const accept = async () => {
    if (!!walletAddress) {
      await dispatch(acceptNft(acceptContractAddress));
    } else message.warn('Please login before submit');
  };

  return (
    <div className='create-page'>
      <div className='steps-content '>
        <div>
          <p className='get-listed'>Enter your contract address</p>
          <p className='select-network'>What is the address of your ERC721 ?</p>
          <div>
            <Input
              className='input-address input-mode-bc'
              size='large'
              placeholder='Enter your ERC721 contract address'
              onChange={(event) => setContractAddress(event.target.value)}
            />
          </div>

          <Button
            type='primary'
            onClick={() => register({ isERC1155: false })}
            shape='round'
            size='large'
          >
            Submit
          </Button>
        </div>
        {walletAddress === adminAddress ? (
          <div>
            <p className='get-listed'>Accept NFT Address</p>
            <div>
              <Input
                className='input-address input-mode-bc'
                size='large'
                placeholder='Enter HRC721 contract address'
                onChange={(event) => setAcceptContractAddress(event.target.value)}
              />
            </div>

            <Button type='primary' onClick={() => accept()} shape='round' size='large'>
              Accept
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
