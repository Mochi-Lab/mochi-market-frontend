import { useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import { useDispatch } from 'react-redux';
import { registerNft, acceptNft } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { useSelector } from 'react-redux';
import imgBanner from 'Assets/images/img-banner-submit-nft.png';
import './index.css';

const { Option } = Select;

export default function SubmitNFT() {
  const { walletAddress, adminAddress } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [isERC1155, setIsERC1155] = useState(false);
  const [content, setContent] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [acceptContractAddress, setAcceptContractAddress] = useState('');
  const dispatch = useDispatch();

  function handleChange(value) {
    setIsERC1155(value);
  }

  const register = async () => {
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

      <div className='steps-content'>
        <div className='area-submit-nft-user'>
          <h1 className='get-listed'>List your NFT on Mochi Marketplace</h1>
          <p className='select-network'>
            Select the NFT type and input the contract address bellow.
          </p>
          <div className='wrap-input-submit'>
            <Select
              size='large'
              className='input-mode-bc select-type-nft-submit'
              defaultValue={false}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value={false}>ERC721</Option>
              <Option value={true}>ERC1155</Option>
            </Select>
            <Input
              className='input-address input-mode-bc'
              size='large'
              placeholder='Enter your contract address'
              onChange={(event) => setContractAddress(event.target.value)}
            />
          </div>
          <Button
            type='primary'
            onClick={() => register()}
            shape='round'
            size='large'
            className='btn-submit-nft'
          >
            Submit
          </Button>
        </div>
        {!!adminAddress && walletAddress === adminAddress ? (
          <div className='area-accpet'>
            <p className='get-listed'>Accept NFT Address</p>
            <div>
              <Input
                className='input-address input-mode-bc input-accept'
                size='large'
                placeholder='Enter contract address'
                onChange={(event) => setAcceptContractAddress(event.target.value)}
              />
            </div>

            <Button
              type='primary'
              onClick={() => accept()}
              shape='round'
              size='large'
              className='btn-submit-nft'
            >
              Accept
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className='img-banner-submit-nft'>
        <img src={imgBanner} alt='banner-submit' />
      </div>
    </div>
  );
}
