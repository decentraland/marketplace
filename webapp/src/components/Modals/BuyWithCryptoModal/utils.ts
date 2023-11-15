import { ChainId, Network } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Asset } from '../../../modules/asset/types'
import { ChainData, Token } from '../../../lib/xchain'

export const getShouldUseMetaTx = (
  asset: Asset,
  selectedChain: ChainId,
  selectedTokenAddress: string,
  destinyChainMANA: string,
  connectedNetwork: Network
) => {
  return (
    getNetwork(asset.chainId) === Network.MATIC &&
    getNetwork(selectedChain) === Network.MATIC &&
    selectedTokenAddress.toLowerCase() === destinyChainMANA.toLowerCase() &&
    connectedNetwork === Network.ETHEREUM // only trigger meta tx if connected to Ethereum
  )
}

export function isToken(opt: Token | ChainData): opt is Token {
  return (opt as Token).decimals !== undefined
}

export function isChainData(opt: Token | ChainData): opt is ChainData {
  return (opt as ChainData).axelarChainName !== undefined
}

export function getMANAToken(chainId: ChainId) {
  const MANAContract = getContract(ContractName.MANAToken, chainId)
  return {
    type: 'evm' as Token['type'],
    chainId: chainId.toString(),
    address: MANAContract.address,
    name: MANAContract.name,
    symbol: 'MANA',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
    coingeckoId: '', // not necessary
    subGraphId: '', // won't be used since we'll send the metatx or transaction directly
    subGraphOnly: false,
    volatility: 0, // won't be used since we'll send the metatx or transaction directly
    usdPrice: 0 // not necessary
  }
}
