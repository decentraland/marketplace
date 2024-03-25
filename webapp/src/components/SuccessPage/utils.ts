import { Log } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'

export function getTokenIdFromLogs(chainId: ChainId, logs?: Log[]): BigNumber | null {
  if (!logs) return null

  const contract = getContract(ContractName.ERC721CollectionV2, chainId)
  const collectionInterface = new ethers.utils.Interface(contract.abi)
  for (const log of logs) {
    try {
      const parsedLog = collectionInterface.parseLog(log)
      if (parsedLog.name === 'Issue') {
        return parsedLog.args._tokenId as BigNumber
      }
    } catch (e) {
      // Ignore log
    }
  }
  return null
}
