import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Select, message, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { registerNft, acceptNft, getCollection } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import IconLoading from 'Components/IconLoading';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { uploadIPFS } from 'Views/Profile/UpdateIPFS';
import { uploadCollection } from 'APIs/Collections/Post';
import { connectWeb3Modal } from 'Connections/web3Modal';
import imgBanner from 'Assets/images/img-banner-submit-nft.png';
import logoIcon from 'Assets/logo-mochi.png';
import './index.scss';
import store from 'store';

const { Option } = Select;

export default function SubmitNFT() {
  const { walletAddress, adminAddress, chainId, nftList, web3 } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [isERC1155, setIsERC1155] = useState(false);
  const [content, setContent] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [acceptContractAddress, setAcceptContractAddress] = useState('');
  const [files, setFiles] = useState([]);
  const [submitsPending, setSubmitsPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleChange(value) {
    setIsERC1155(value);
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const register = async () => {
    if (!!walletAddress) {
      if (files.length > 0) {
        if (files[0].size <= 4000000) {
          setContent('Submit NFTs');
          setVisible(true);
          let resultRegister = await dispatch(registerNft(contractAddress, isERC1155));
          setVisible(false);
          if (!!resultRegister) {
            // upload image
            setContent('Upload Logo');
            setVisible(true);
            let logo = await uploadIPFS(files);
            setVisible(false);

            let newCollection = {
              logo: !!logo.image ? logo.image : '',
              hashLogo: !!logo.ipfsHash ? logo.ipfsHash : '',
            };
            await uploadCollection(chainId, contractAddress, walletAddress, newCollection);
            // reset form and file
          } else {
            return;
          }

          setFiles([]);
        } else message.warn('You can only upload up to 4MB');
      } else message.warn('Please upload logo');
    } else connectWeb3Modal();
  };

  const accept = async (addressAccept) => {
    if (!!walletAddress) {
      setContent('Accept NFT');
      setVisible(true);
      await dispatch(acceptNft(addressAccept));
      setVisible(false);
    } else connectWeb3Modal();
  };

  const getSubmitsPending = useCallback(async () => {
    setLoading(true);
    let allNFTAddress = await nftList.methods.getAllNFTAddress().call();
    let acceptedNFTs = await nftList.methods.getAcceptedNFTs().call();
    var submitsPending = allNFTAddress
      .filter(function (e) {
        return acceptedNFTs.indexOf(e) < 0;
      })
      .reverse();

    let collections = [];
    for (let i = 0; i < submitsPending.length; i++) {
      const nftAddress = submitsPending[i];
      const res = await web3.eth.getCode(nftAddress);
      if (res !== '0x') {
        let collection = (await store.dispatch(getCollection(nftAddress, null))).collection;
        collections.push(collection);
      }
    }
    setSubmitsPending(collections);
    setLoading(false);
  }, [nftList, web3]);

  useEffect(() => {
    if (!!nftList) {
      getSubmitsPending();
    }
  }, [getSubmitsPending, nftList]);

  return (
    <div className='create-page'>
      <LoadingModal title={content} visible={visible} />

      <div className='steps-content'>
        <div className='area-submit-nft-user'>
          <h1 className='get-listed'>List your NFT on Mochi Marketplace</h1>
          <p className='select-network'>
            Select the NFT type and input the contract address bellow.
          </p>
          <div className='wrap-box-submit'>
            <div
              className='drag-box'
              {...getRootProps({ className: 'dropzone-collection-submit' })}
            >
              <input {...getInputProps()} />
              {!!files[0] ? (
                <div className='preview'>
                  <img
                    src={files[0].preview}
                    alt='priview'
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '1rem',
                    }}
                  />
                </div>
              ) : (
                <p
                  className='textmode'
                  style={{ textAlign: 'center', marginBottom: 0, fontSize: '12.9px' }}
                >
                  {'Upload logo'}
                  <img src={logoIcon} alt='logo-icon' width='32px' height='32px' />
                </p>
              )}
            </div>
            <div className='wrap-input-and-button-submit'>
              <div className='wrap-input-submit'>
                <Select
                  size='large'
                  className='input-mode-bc select-type-nft-submit'
                  defaultValue={false}
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
          </div>
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
              onClick={() => accept(acceptContractAddress)}
              shape='round'
              size='large'
              className='btn-submit-nft'
            >
              Accept
            </Button>

            {!!loading ? (
              <IconLoading />
            ) : (
              <Row className='list-not-accept' justify='center'>
                {submitsPending.map((collection, index) => (
                  <Col className='item-accept' key={index} span={24}>
                    <div className='logo-collection-accept'>
                      <img src={collection.logo} alt='logo-collection' />
                    </div>
                    <div className='address-button-accept'>
                      <div className='address-accept'>{collection.addressToken}</div>
                      <div className='button-accept'>
                        <Button onClick={() => accept(collection.addressToken)}>accept</Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
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
