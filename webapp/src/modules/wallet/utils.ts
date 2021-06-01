import { TxSend } from 'web3x-es/contract'
import { Address } from 'web3x-es/address'
import { Network } from '@dcl/schemas'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import {
  ContractData,
  sendMetaTransaction as baseSendMetaTransaction
} from 'decentraland-transactions'
import {
  getConnectedProvider,
  getNetworkProvider
} from 'decentraland-dapps/dist/lib/eth'

export const TRANSACTIONS_API_URL = process.env.REACT_APP_TRANSACTIONS_API_URL

export function shortenAddress(address: string) {
  if (address) {
    return address.slice(0, 6) + '...' + address.slice(42 - 5)
  }
}

export function addressEquals(address1?: string, address2?: string) {
  return (
    address1 !== undefined &&
    address2 !== undefined &&
    address1.toLowerCase() === address2.toLowerCase()
  )
}

export function sendTransaction(
  method: TxSend<any>,
  contract: ContractData,
  from: Address
): Promise<string> {
  const { network } = getChainConfiguration(contract.chainId)

  switch (network) {
    case Network.ETHEREUM:
      return method.send({ from }).getTxHash()
    case Network.MATIC: {
      return sendMetaTransaction(method, contract, from)
    }
    default:
      throw new Error(`Undefined network ${network}`)
  }
}

export async function sendMetaTransaction(
  method: TxSend<any>,
  contract: ContractData,
  from: Address
): Promise<string> {
  const provider = await getConnectedProvider()
  if (!provider) {
    throw new Error('Could not get a valid connected Wallet')
  }
  const metaTxProvider = await getNetworkProvider(contract.chainId)
  const txData = getMethodData(method, from)
  return baseSendMetaTransaction(provider, metaTxProvider, txData, contract, {
    serverURL: TRANSACTIONS_API_URL
  })
}

export function getMethodData(method: TxSend<any>, from: Address): string {
  const payload = method.getSendRequestPayload({ from })
  return payload.params[0].data
}
