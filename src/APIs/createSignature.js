const createSignature = async (web3, address, nonce) => {
  let signature = await web3.eth.personal.sign(
    web3.utils.fromUtf8('Log in with ' + nonce),
    address
  );
  return signature;
};

export default createSignature;
