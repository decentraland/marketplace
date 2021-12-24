import { Contract, providers, utils } from 'ethers'
import { Bid } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { ContractName, getContract } from 'decentraland-transactions'

export async function isInsufficientMANA(bid: Bid) {
  try {
    const provider = await getNetworkProvider(bid.chainId)
    const contract = getContract(ContractName.MANAToken, bid.chainId)
    const mana = new Contract(
      contract.address,
      contract.abi,
      new providers.Web3Provider(provider)
    )
    const balanceRaw = await mana.balanceOf(bid.bidder)
    const balance = parseFloat(utils.formatEther(balanceRaw))
    const price = parseFloat(utils.formatEther(bid.price))

    return balance < price
  } catch (error) {
    console.warn(error.message)
  }
  return false
}

export function checkFingerprint(bid: Bid, fingerprint: string | undefined) {
  if (fingerprint && bid.fingerprint) {
    return fingerprint === bid.fingerprint
  }
  return true
}

export function toBidObject(bids: Bid[]) {
  return bids.reduce((obj, bid) => {
    obj[bid.id] = bid
    return obj
  }, {} as Record<string, Bid>)
}
