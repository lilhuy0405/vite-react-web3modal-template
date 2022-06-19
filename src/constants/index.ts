import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";


export const SMARTCHAIN_TESTNET_CHAIN_ID = '0x61';
export const SMARTCHAIN_TESTNET_CHAIN_ID_DECIMAL = 97;
export const SMARTCHAIN_TESTNET_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: import.meta.env.VITE_INFURA_ID, // required
      rpc: {
        [SMARTCHAIN_TESTNET_CHAIN_ID_DECIMAL]: SMARTCHAIN_TESTNET_URL,
      },
      chainId: SMARTCHAIN_TESTNET_CHAIN_ID_DECIMAL,
    },
    display: {
      name: 'WalletConnect',
    }
  },
  injected: {
    package: null,
    name: 'Injected',
  }
};
export const web3Modal = new Web3Modal({
  providerOptions, // required
  cacheProvider: true,
  disableInjectedProvider: false,
  theme: 'dark'

});
