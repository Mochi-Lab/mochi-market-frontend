const IPFS = require('ipfs-http-client');

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const uploadToIpfs = async (data) => {
  for await (const results of ipfs.add(data)) {
    return results.path;
  }
};
