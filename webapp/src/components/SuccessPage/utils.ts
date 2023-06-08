import { ChainId } from '@dcl/schemas'
import { Log } from '@ethersproject/providers'
import { ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, ethers } from 'ethers'

export function getIssuedIdFromLogs(chainId: ChainId, logs?: Log[]): BigNumber | null {
  if (!logs) return null

  const contract = getContract(ContractName.ERC721CollectionV2, chainId)
  const collectionInterface = new ethers.utils.Interface(contract.abi)
  for (const log of logs) {
    try {
      const parsedLog = collectionInterface.parseLog(log)
      if (parsedLog.name === 'Issue') {
        return parsedLog.args._issuedId
      }
    } catch (e) {
      // Ignore log
    }
  }
  return null
}
