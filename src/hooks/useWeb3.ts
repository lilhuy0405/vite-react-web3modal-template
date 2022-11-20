import {useConnection} from "../states/connection";
import {useMemo} from "react";
import {SMARTCHAIN_TESTNET_CHAIN_ID, SMARTCHAIN_TESTNET_URL, web3Modal} from "../constants";
import {toast} from "react-hot-toast";
import {ethers} from "ethers";
import {getLocalStorageObject, removeItemFromLocalStorage} from "../utils";

const useWeb3 = () => {
  const {
    connection,
    onSetAddress,
    onClearConnection,
    onSetProvider,
    onSetWeb3Instance
  } = useConnection();
  const isActive = useMemo(() => !!connection.address, [connection.address])

  const switchChain = async (web3Instance: any) => {
    try {
      // this wallet_addEthereumChain request only run if the requested chain is not installed
      await web3Instance.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SMARTCHAIN_TESTNET_CHAIN_ID,
            rpcUrls: [SMARTCHAIN_TESTNET_URL],
            chainName: "Smart Chain - Testnet",
          },
        ],
      });
      // this wallet_switchEthereumChain only run if current chain is not the chain specified
      await web3Instance.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: SMARTCHAIN_TESTNET_CHAIN_ID}], // chainId must be in hexadecimal numbers
      });
      return true
    } catch (err: any) {
      console.log(err)
      return false
    }
  }

  const handleChangeChain = async (chainId: any) => {
    console.log('chain changed: ' + chainId)
    if (chainId !== SMARTCHAIN_TESTNET_CHAIN_ID) {
      toast.error("Net work not support")
    }
   deActivate()
  }

  const handleAccountChain = () => {
    deActivate()
  }
  const activate = async () => {
    //clear cached
    const cachedWalletConnectDeepLink = getLocalStorageObject('WALLETCONNECT_DEEPLINK_CHOICE')
    if (cachedWalletConnectDeepLink) {
      console.log('clear cached deep link')
      removeItemFromLocalStorage('WALLETCONNECT_DEEPLINK_CHOICE')
    }
    try {
      const instance = await web3Modal.connect();
      const isSwitchSuccess = await switchChain(instance)
      if (!isSwitchSuccess) {
        throw new Error('switch chain failed')
      }
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      // await fetchTokens(provider);
      onSetWeb3Instance(instance)
      onSetAddress(address);
      onSetProvider(provider);
      return provider;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  //disconnect from web3 => update connection state and unsubscribe from events
  const deActivate = () => {
    web3Modal.clearCachedProvider();
    window.localStorage.removeItem('walletconnect');
    window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
    onClearConnection();
  }

  return {
    activate,
    isActive,
    deActivate,
    handleAccountChain,
    handleChangeChain
  }
}

export default useWeb3