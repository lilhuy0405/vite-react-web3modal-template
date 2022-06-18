import {useEffect, useState} from 'react'
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {toast, Toaster} from "react-hot-toast";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "14b979bc481c4c71bc2116ac116e2675", // required
      rpc: {
        97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
        56: 'https://bsc-dataseed.binance.org/'
      },
      chainId: 97,
      network: 'binance'
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
const web3Modal = new Web3Modal({
  providerOptions, // required
  cacheProvider: true,
  disableInjectedProvider: false,


});

function App() {
  const [web3Instance, setWeb3Instance] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [connection, setConnection] = useState<{address: string, chainId: number}>({address: '', chainId: -1})
  const [event, setEvent] = useState('')
  const handleConnect = async () => {
    const instance = await web3Modal.connect();
    setWeb3Instance(instance)
    const provider = new ethers.providers.Web3Provider(instance);
    const netWork = await provider.getNetwork();
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setConnection({
      chainId: netWork.chainId,
      address
    })
    setProvider(provider);
  }

  const handleChangeChain = () => {
    console.log('chain changed')
    setEvent('net work changed')
    toast.success('network changed')
  }

  const handleAccountChain = () => {
    console.log('account changed')
    setEvent('account changed')
    toast.success('account changed')
  }
  //subcribe for events use effect should in updater.tsx
  useEffect(() => {
    console.log('subscribe to EIP-1193 events with web3Instance: ' + web3Instance)
    if(web3Instance) {
      web3Instance.on('accountsChanged', handleAccountChain)
      web3Instance.on('chainChanged', handleChangeChain)
    }
  }, [web3Instance])


  useEffect(() => {
    console.log('call connect-to-cached-provider useEffect with cached: ' + web3Modal.cachedProvider)
    if (web3Modal.cachedProvider) {
      handleConnect()
    }
  }, [web3Modal.cachedProvider])

  return (
    <div className="App">
      <button onClick={handleConnect}>Open modal</button>
      <div>
        connected to network id: {connection.chainId} with account: {connection.address}
      </div>
      <div>
        events trigger: {event}
      </div>
      <Toaster/>
    </div>
  )
}

export default App
