// Update the import path if the file is located elsewhere, for example:
import { ChainId } from './rental/extendedChainId'
// Or, if the file does not exist, create 'extendedChainId.ts' in the same directory with the following content:

// Remove the local declaration of ChainId since it's imported from './chains/extendedChainId'
  
export async function getCurrentNetwork() {
  if (window.ethereum) {
    const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' })
    return parseInt(chainId, 16)
  }
  return undefined
}

// Allowed networks
export const SUPPORTED_NETWORKS = [
  ChainId.POLYGON,            // 137
  ChainId.MATIC_MUMBAI,       // 80001
  ChainId.ETHEREUM_SEPOLIA    // 11155111
]
