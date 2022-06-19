import {Toaster} from "react-hot-toast";
import updater from "./updater";
import useWeb3 from "./hooks/useWeb3";
import {useConnection} from "./states/connection";

function App() {
  //example to use useWeb3() hook
  const {isActive, activate, deActivate} = useWeb3()
  const {connection} = useConnection()
  return (
    <div>
      <h3>A Template to connect multi blockchains wallets check current network, save connection state to redux,..</h3>
      <div>
        <button onClick={isActive ? deActivate : activate}>
          {isActive ? 'Log out wallet' : 'Connect wallet'}
        </button>
      </div>
      <div>
        wallet address: {connection.address}
      </div>
      <Toaster/>
    </div>
  )
}

export default updater(App)
