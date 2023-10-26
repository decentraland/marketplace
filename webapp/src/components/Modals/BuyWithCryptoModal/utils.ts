import { ChainId } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'

export const getShouldUseMetaTx = (
  asset: Asset,
  selectedChain: ChainId,
  selectedTokenAddress: string,
  destinyChainMANA: string
) => {
  return (
    asset.chainId === ChainId.MATIC_MAINNET &&
    selectedChain === ChainId.MATIC_MAINNET &&
    selectedTokenAddress.toLowerCase() === destinyChainMANA.toLowerCase()
  )
}
