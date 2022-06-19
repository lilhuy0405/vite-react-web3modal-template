import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {clearConnection, setAddress, setProvider, setWeb3Instance} from "./reducer";
import {AppState} from "../index";
import {ethers} from "ethers";

export const useConnection = () => {
  const connection = useSelector((state: AppState) => state.connection)
  const dispatch = useDispatch()

  const onSetAddress = useCallback((accountAddress: string) => {
    dispatch(setAddress(accountAddress))
  }, [dispatch])

  const onSetProvider = useCallback((provider: ethers.providers.Web3Provider) => {
    dispatch(setProvider(provider))
  }, [dispatch])

  const onSetWeb3Instance = useCallback((instance: any) => {
    dispatch(setWeb3Instance(instance))
  }, [dispatch])


  const onClearConnection = useCallback(() => {
    dispatch(clearConnection(undefined))
  }, [dispatch])



  return {
    onSetAddress,
    connection,
    onClearConnection,
    onSetProvider,
    onSetWeb3Instance
  }
}