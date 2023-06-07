import { ChainId } from '@dcl/schemas'
import { Log } from '@ethersproject/providers'
import { ContractName, getContract } from 'decentraland-transactions'
import { BigNumber, ethers } from 'ethers'
import { LogDescription } from 'ethers/lib/utils'

export function getIssuedIdFromLogs(chainId: ChainId, logs?: Log[]): BigNumber | null {
  if (!logs) return null

  const contract = getContract(ContractName.ERC721CollectionV2, chainId)
  const collectionInterface = new ethers.utils.Interface(contract.abi)
  const parsedLogs: LogDescription[] = logs
    .map(log => {
      try {
        return collectionInterface.parseLog(log)
      } catch (e) {
        // Ignore log
        return null
      }
    })
    .filter(Boolean) as LogDescription[]

  const issueEventLog = parsedLogs.find(log => log.name === 'Issue')
  return issueEventLog ? issueEventLog.args._issuedId : null
}
