import { useCallback, useEffect, useState } from 'react';
import { message, List, Avatar, Spin, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { registerNft, acceptNft, getCollection } from 'store/actions';
import LoadingModal from 'Components/LoadingModal';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { uploadIPFS } from 'Views/Profile/UpdateIPFS';
import { uploadCollection } from 'APIs/Collections/Post';
import { connectWeb3Modal } from 'Connections/web3Modal';
import _ from 'lodash';
import classNames from 'classnames';
import { NFT_AVATAR_MAX_FILE_SIZE } from 'Constants'
import './index.scss';
import store from 'store';


export default function SubmitNFT() {
  const { walletAddress, adminAddress, chainId, nftList, web3 } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [acceptContractAddress, setAcceptContractAddress] = useState('');
  const [files, setFiles] = useState(null);
  const [submitsPending, setSubmitsPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabs = ["ERC 721", "ERC 1155", "Approver"];
  const [activeTab, setActiveTab] = useState(tabs[0])
  const dispatch = useDispatch();

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (selectedFiles) => {
      const instance = _.head(selectedFiles)
      const preview = URL.createObjectURL(instance)
      setFiles({
        instance,
        preview,
      });
    },
    multiple: false,
  });

  const register = async () => {
    if(!walletAddress) return connectWeb3Modal();
    if (files === null) return message.warn('Please upload logo');
    if (files.instance.size > NFT_AVATAR_MAX_FILE_SIZE) return message.warn('You can only upload up to 4MB');

    setContent('Submit NFTs');
    setVisible(true);
    let resultRegister = await dispatch(registerNft(contractAddress, activeTab === "ERC 1155"));
    setVisible(false);
    if (!resultRegister) return;
    // upload image
    setContent('Upload Logo');
    setVisible(true);
    let logo = await uploadIPFS(files.instance);
    setVisible(false);
    let newCollection = {
      logo: !!logo.image ? logo.image : '',
      hashLogo: !!logo.ipfsHash ? logo.ipfsHash : '',
    };
    await uploadCollection(chainId, contractAddress, walletAddress, newCollection);
    // reset form and file
    setFiles(null);
  };

  const accept = async () => {
    if (!walletAddress) return connectWeb3Modal();
    setContent('Accept NFT');
    setVisible(true);
    await dispatch(acceptNft(acceptContractAddress));
    setVisible(false);
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

  const onActiveTabChange = (selectedTab) => {
    setActiveTab(selectedTab)
  }

  const walletIsApprover = !!adminAddress && walletAddress === adminAddress
  const activeTabIsApprover = activeTab === "Approver";

  return (<>
    <LoadingModal title={content} visible={visible} />
    <div className="submit-nft-overlay">
      <div className="submit-nft-container">
        <div className="submit-nft-header">
          <div className="submit-nft-tab-container">
            {
              _.map(tabs, (tab) => {
                return (
                  <div key={tab} onClick={() => { onActiveTabChange(tab) }} className={
                    classNames(
                      'tab',
                      {
                        active: activeTab === tab,
                        hidden: tab === "Approver" && !walletIsApprover
                      }
                    )
                  }>{tab}</div>
                )
              })
            }
          </div>
        </div>
        <div className="submit-nft-body">
          {
            !activeTabIsApprover && (<>
              <div className='avatar-picker-container'>
                <div {...getRootProps({ className: 'avatar-picker' })}>
                  <input {...getInputProps()} />
                  <Tooltip placement="bottom" title="Avatar">
                  {
                    files
                    ? (
                      <img className="avatar" src={files.preview} alt="avatar"/>
                    )
                    : (
                      <div className="avatar">
                        📷
                      </div>
                    )
                  }
                  </Tooltip>
                </div>
              </div>
              <div className="contract-address-input">
                <input type="text" className="contract-address" placeholder="Contract Address" value={contractAddress} onChange={(event) => setContractAddress(event.target.value)}/>
              </div>
            </>)
          }
          {
            activeTabIsApprover && (<>
              <div className="approve-pending-container">
                <div className="contract-address-input">
                  <input type="text" className="contract-address" placeholder="Search by Contract Address" value={acceptContractAddress} onChange={(event) => setAcceptContractAddress(event.target.value)} />
                </div>
                <div className="approve-pending-list">
                  <List
                    dataSource={submitsPending}
                    renderItem={item => (
                      <List.Item
                        className={classNames({selected: item.addressToken === acceptContractAddress})}
                        key={item.addressToken}
                        onClick={() => setAcceptContractAddress(item.addressToken)}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar src={item.logo} />
                          }
                          title={item.name}
                          description={item.addressToken}
                        />
                      </List.Item>
                    )}
                  >
                    {loading && (
                      <div className="approve-pending-list-spinner">
                        <Spin />
                      </div>
                    )}
                  </List>
                </div>
              </div>
            </>)
          }
        </div>
        <div className="submit-nft-footer">
          {
            !activeTabIsApprover && (<>
              <button className="submit-button" onClick={register} disabled={!web3.utils.isAddress(contractAddress)}>Submit</button>
            </>)
          }
          {
            activeTabIsApprover && (<>
              <button className="submit-button" onClick={accept} disabled={!web3.utils.isAddress(acceptContractAddress)}>Approve</button>
            </>)
          }
        </div>
      </div>
    </div>
  </>)
}
