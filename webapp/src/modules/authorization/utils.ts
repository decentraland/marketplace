import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { toBN } from 'web3x-es/utils'
import { ERC20 } from '../../contracts/ERC20'
import { ERC721 } from '../../contracts/ERC721'
import { tokenContracts, nftContracts } from '../contract/utils'
import { Privileges, AuthorizationDefinition } from './types'

export async function getAuthorizations(
  definition: AuthorizationDefinition,
  contractCall: (address: string) => Promise<boolean>
) {
  const result: Privileges = {}

  for (const contractAddress in definition) {
    const tokenContractAddresses = definition[contractAddress]

    for (const tokenContractAddress of tokenContractAddresses) {
      const callResult = await contractCall(tokenContractAddress)

      result[contractAddress] = {
        ...result[contractAddress],
        [tokenContractAddress]: callResult
      }
    }
  }
  return result
}

export async function callAllowance(eth: Eth, address: string) {
  const contract = new ERC20(eth, getAddress(address))
  const result = await contract.methods
    .allowance(Address.fromString(address), contract.address!)
    .call()
  return parseInt(result, 10)
}

export async function callIsApprovedForAll(eth: Eth, address: string) {
  const contract = new ERC721(eth, getAddress(address))
  return contract.methods
    .isApprovedForAll(Address.fromString(address), contract.address!)
    .call()
}

export function getTokenAmountToApprove() {
  return toBN(2).pow(toBN(180))
}

function getAddress(address: string) {
  const contractDefinition = nftContracts[address] || tokenContracts[address]
  if (!contractDefinition) {
    throw new Error(`Invalid address "${address}" for authorization contract`)
  }
  return Address.fromString(contractDefinition.address)
}
