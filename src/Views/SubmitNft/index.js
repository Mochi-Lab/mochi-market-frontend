import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { registerNft, acceptNft } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { useSelector } from 'react-redux';
import './index.css';

export default function SubmitNFT() {
  const { walletAddress, adminAddress } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [acceptContractAddress, setAcceptContractAddress] = useState('');
  const dispatch = useDispatch();
  const register = async ({ isERC1155 }) => {
    if (!!walletAddress) {
      setContent('Submit NFTs');
      setVisible(true);
      await dispatch(registerNft(contractAddress, isERC1155));
      setVisible(false);
    } else message.warn('Please login before submit');
  };

  const accept = async () => {
    if (!!walletAddress) {
      setContent('Accept NFT');
      setVisible(true);
      await dispatch(acceptNft(acceptContractAddress));
      setVisible(false);
    } else message.warn('Please login before submit');
  };

  return (
    <div className='create-page'>
      <LoadingModal title={content} visible={visible} />
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
        {!!adminAddress && walletAddress === adminAddress ? (
          <div>
            <p className='get-listed'>Accept NFT Address</p>
            <div>
              <Input
                className='input-address input-mode-bc'
                size='large'
                placeholder='Enter ERC721 contract address'
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
