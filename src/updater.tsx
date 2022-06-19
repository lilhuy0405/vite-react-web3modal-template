import {useConnection} from "./states/connection";
import useWeb3 from "./hooks/useWeb3";
import {useEffect} from "react";
import {web3Modal} from "./constants";

//an HOC for sync state
const updater = (WrappedComponent: any) => function (props: any) {
  const {connection} = useConnection()
  const {activate, handleChangeChain, handleAccountChain} = useWeb3()
  const web3Instance = connection.web3Instance
  const walletAddress = connection.address
  //subscribe for events
  useEffect(() => {
    //avoid to subscribe duplicate events
    if (!web3Instance) return
    if (web3Instance._events.accountsChanged && web3Instance._events.accountsChanged.length > 0) return;
    console.log('subscribe for account chain')
    web3Instance.on('accountsChanged', handleAccountChain)
  }, [web3Instance])

  useEffect(() => {
    //avoid to subscribe duplicate events
    if (!web3Instance) return
    if (web3Instance._events.chainChanged && web3Instance._events.chainChanged.length > 0) return;
    console.log('call subscribe for chain changed')
    web3Instance.on('chainChanged', handleChangeChain)
  }, [web3Instance])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      activate();
    }
  }, [web3Modal.cachedProvider])

  return <WrappedComponent {...props} />;
}
export default updater