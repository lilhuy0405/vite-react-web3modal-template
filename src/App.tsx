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
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      chainId: 97,
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
  //redux
  const [web3Instance, setWeb3Instance] = useState<any>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [connection, setConnection] = useState<{ address: string, chainId: number }>({address: '', chainId: -1})
  const [event, setEvent] = useState('')

  //hooks
  const switchChain = async (web3Instance: any) => {
    try {
      console.log("Switch Chain")
      // this wallet_addEthereumChain request only run if the requested chain is not installed
      await web3Instance.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: "0x61",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            chainName: "Smart Chain - Testnet",
            // these properties below is optional
            nativeCurrency: {
              name: 'tBNB',
              symbol: 'tBNB', // 2-6 characters long
              decimals: 18
            },
            blockExplorerUrls: ['https://testnet.bscscan.com/']
          },
        ],
      });
      // this wallet_switchEthereumChain only run if current chain is not the chain specified
      await web3Instance.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x61'}], // chainId must be in hexadecimal numbers
      });
      return true
    } catch (err: any) {
      console.log(err)
      return false
    }
  }
  const handleConnect = async () => {
    const instance = await web3Modal.connect();
    const isSwitchSuccess = switchChain(instance);
    if (!isSwitchSuccess) return
    const provider = new ethers.providers.Web3Provider(instance);
    const netWork = await provider.getNetwork();
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWeb3Instance(instance)
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
    if (web3Instance) {
      web3Instance.on('accountsChanged', handleAccountChain)
      web3Instance.on('chainChanged', handleChangeChain)
    }
  }, [web3Instance])


  useEffect(() => {
    console.log('call connect-to-cached-provider useEffect with cached: ' + web3Modal.cachedProvider)
    if (web3Modal.cachedProvider) {
      handleConnect();
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
