import { PeerSwapApi, Configuration } from 'peerswap-sdk';

const config = new Configuration({
  basePath: 'http://localhost:9000',
});

export const peerswap = new PeerSwapApi(config);
