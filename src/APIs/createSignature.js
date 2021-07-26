const createSignature = async (web3, address, nonce) => {
  try {
    let signature = await web3.eth.personal.sign(
      web3.utils.fromUtf8('Log in with ' + nonce),
      address
    );
    return signature;
  } catch (error) {
    throw new Error('Parameter is not a number!');
  }
};

export default createSignature;
