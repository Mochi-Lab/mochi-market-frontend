
const VALUE_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const approveERC20 = async (web3, chainId, ERC20, getContractAddress, walletAddress, presaleInstance, store, setStatusActivity) => {
    let activity = {
        key: `transfer-${Date.now()}`,
        status: 'pending',
        title: 'Approve',
        duration: 0,
        txHash: null,
    };
    var contractAddress = getContractAddress(chainId);
    let instanceTokenBuy = new web3.eth.Contract(ERC20.abi, contractAddress.TokenBuy);
    try {
        await store.dispatch(setStatusActivity(activity));
        await instanceTokenBuy.methods
            .approve(presaleInstance._address, VALUE_MAX)
            .send({ from: walletAddress })
            .on('receipt', (receipt) => {
                store.dispatch(setStatusActivity({ ...activity, status: 'success', duration: 15000 }));
            });
        return true;
    } catch (error) {
        await store.dispatch(setStatusActivity({ ...activity, status: 'close' }));
        return false;
    }
};
export const getAllowanceERC20 = async (instanceTokenBuy, walletAddress, instancePresale) => {
    return !!instanceTokenBuy ?
        await instanceTokenBuy.methods.allowance(walletAddress, instancePresale._address).call() : null;
};
export const getBalanceOfERC20 = async (instanceTokenBuy, walletAddress) => {
    return !!instanceTokenBuy ?
        await instanceTokenBuy.methods.balanceOf(walletAddress).call() : 0;
};
export const getPriceNFT = async (instancePresale, instanceTokenBuy) => {
    return !!instancePresale ?
        await instancePresale.methods.price(instanceTokenBuy._address).call() : 0;
};
export const getSaleAmount = async (instancePresale) => {
    return !!instancePresale ?
        await instancePresale.methods.saleAmount().call() : 0;
};
export const getSoldAmount = async (instancePresale) => {
    return !!instancePresale ?
        await instancePresale.methods.soldAmount().call() : 0;
};
export const checkBought = async (instancePresale, walletAddress) => {
    return !!instancePresale ?
        await instancePresale.methods.bought(walletAddress).call() : false;
};
export const getTimeStart = async (web3, instancePresale) => {
    if (!!instancePresale) {
        let blockStart = parseInt(await instancePresale.methods.startBlock().call());
        let blockCurrent = await web3.eth.getBlockNumber()
        return blockCurrent > blockStart ? (await web3.eth.getBlock(blockStart)).timestamp : null
    }
    return null;
};
export const buyPresale = async (web3, chainId, PreSaleCombo, getContractAddress, walletAddress, tokenBuyInstance, store, setStatusActivity) => {
    let activity = {
        key: `transfer-${Date.now()}`,
        status: 'pending',
        title: 'Buying',
        duration: 0,
        txHash: null,
    };
    var contractAddress = getContractAddress(chainId);
    let instancePresale = new web3.eth.Contract(PreSaleCombo, contractAddress.PreSaleCombo);
    try {
        await store.dispatch(setStatusActivity(activity));
        await instancePresale.methods
            .buy(tokenBuyInstance._address)
            .send({ from: walletAddress })
            .on('receipt', (receipt) => {
                store.dispatch(setStatusActivity({ ...activity, status: 'success', duration: 15000 }));
            });
        return true;
    } catch (error) {
        await store.dispatch(setStatusActivity({ ...activity, status: 'close' }));
        return false;
    }
};
export const fetchWhiteList = async (whitelistInstance) => {
    return !!whitelistInstance ?
        (await whitelistInstance.methods.getArrayWhitelist().call()).map((e, i) => {
            return { key: `${e}_${i}`, address: e };
        }) : [];
};

export const checkIsWhitelisted = async (whitelistInstance, walletAddress) => {
    return !!whitelistInstance ?
        await whitelistInstance.methods.isWhitelisted(walletAddress).call() : false;
};