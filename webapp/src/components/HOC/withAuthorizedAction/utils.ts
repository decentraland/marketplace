import { Provider } from "@ethersproject/providers"
import { ethers } from "ethers"

export function getERC20ContractInstance(
  contractAddress: string,
  provider: Provider
) {
  return new ethers.Contract(
    contractAddress,
    [
      'function allowance(address owner, address spender) view returns (uint256)'
    ],
    provider
  )
}

export function getERC721ContractInstance(
  contractAddress: string,
  provider: Provider
) {
  return new ethers.Contract(
    contractAddress,
    [
      'function isApprovedForAll(address owner, address operator) view returns (bool)'
    ],
    provider
  )
}
