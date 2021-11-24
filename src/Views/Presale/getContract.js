const contractAddress = {
    //BSC Mainnet
    56: {
        PreSaleCombo: '',
        TokenBuy: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        Whitelist: ''
    },
    //BSC Testnet
    97: {
        PreSaleCombo: '0x3a052a5cD548ee0ef4ddcB9263237bd0F244318B',
        TokenBuy: '0x777d20e16c6bc508d5989e81a6c9b5034a32c6dd',
        Whitelist: '0x3eDD68a71d190DE52FD584a8E8534ED51Baa39e5'
    },
};

const tokenPayment = {
    //BSC Mainnet
    56: {
        TokenBuy: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        Symbol: 'BUSD'
    },
    //BSC Testnet
    97: {
        TokenBuy: '0x777d20e16c6bc508d5989e81a6c9b5034a32c6dd',
        Symbol: 'MOMA'
    },
};

export const getContractAddress = (_chainId) => {
    return contractAddress[_chainId];
};

export const getTokenPayment = (_chainId) => {
    return tokenPayment[_chainId];
};