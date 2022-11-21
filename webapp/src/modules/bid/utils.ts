import { ethers } from 'ethers'
import { Bid } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { isErrorWithMessage } from '../../lib/error'

export async function isInsufficientMANA(bid: Bid) {
  try {
    const provider = await getNetworkProvider(bid.chainId)
    const contract = getContract(ContractName.MANAToken, bid.chainId)
    const mana = new ethers.Contract(
      contract.address,
      contract.abi,
      new ethers.providers.Web3Provider(provider)
    )
    const balanceRaw = await mana.balanceOf(bid.bidder)
    const balance = parseFloat(ethers.utils.formatEther(balanceRaw))
    const price = parseFloat(ethers.utils.formatEther(bid.price))

    return balance < price
  } catch (error) {
    console.warn(
      isErrorWithMessage(error) ? error.message : t('global.unknown_error')
    )
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
