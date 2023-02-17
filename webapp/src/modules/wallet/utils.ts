import { ethers } from 'ethers'
import { Provider } from 'decentraland-dapps/dist/modules/wallet/types'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { config } from '../../config'

export const TRANSACTIONS_API_URL = config.get('TRANSACTIONS_API_URL')

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

export async function getEth(): Promise<ethers.providers.Web3Provider> {
  const provider: Provider | null = await getConnectedProvider()

  if (!provider) {
    throw new Error('Could not get a valid connected Wallet')
  }

  return new ethers.providers.Web3Provider(provider)
}

// TODO: remove after fixing the following issue https://app.zenhub.com/workspaces/dapps-5ffc44ecec9f8500140e173c/issues/gh/decentraland/dapps-issues/45
function removeScientificNotationForSmallNumbers(number: number): string {
  // fix the amount of decimals to the exponent of the scientific notation when the number is too low
  return number.toFixed(parseInt(number.toString().split('-')[1]))
}

export function formatBalance(balance: number) {
  return balance.toString().includes('-')
    ? removeScientificNotationForSmallNumbers(balance)
    : balance.toString()
}
