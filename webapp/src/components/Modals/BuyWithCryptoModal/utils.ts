import { ChainId, Network, Order } from '@dcl/schemas'
import {
  ChainData,
  Token
} from 'decentraland-transactions/dist/crossChain/types'
import {
  ContractName,
  getContract,
  getContractName
} from 'decentraland-transactions'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Env } from '@dcl/ui-env'
import { Asset } from '../../../modules/asset/types'
import { config } from '../../../config'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { BigNumber, ethers } from 'ethers'
import { isNFT } from '../../../modules/asset/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

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

function truncateToDecimals(num: number, dec = 2) {
  const calcDec = Math.pow(10, dec)
  return Math.trunc(num * calcDec) / calcDec
}

export function formatPrice(price: string | number, token: Token): number {
  // Determine the number of decimals based on the USD price
  let decimalsToShow: number

  // Show more decimals for smaller fractions of higher-value tokens like Ethereum
  if (token.usdPrice && token.usdPrice <= 1.5) {
    decimalsToShow = 4 // Show 4 decimals for tokens with prices less than 1 USD
  } else {
    decimalsToShow = 2 // Show 2 decimals for other tokens or higher-value fractions
  }

  // Format the price using toFixed to round and limit the number of decimals
  const formattedPrice = truncateToDecimals(
    typeof price === 'string' ? Number(price) : price,
    decimalsToShow
  )

  return formattedPrice
}

// this are the default chains for the buy with crypto modal since we support buying with MANA on both chains
// for L1 and L2 NFTs respectively
export const DEFAULT_CHAINS = [
  {
    chainId: ChainId.MATIC_MAINNET.toString(),
    networkName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      icon:
        'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/matic.svg'
    }
  },
  {
    chainId: ChainId.ETHEREUM_MAINNET.toString(),
    networkName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      icon:
        'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg'
    }
  }
] as ChainData[]

export const TESTNET_DEFAULT_CHAINS = [
  {
    chainId: ChainId.MATIC_MUMBAI.toString(),
    networkName: 'Polygon Mumbai',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      icon:
        'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/matic.svg'
    }
  },
  {
    chainId: ChainId.ETHEREUM_SEPOLIA.toString(),
    networkName: 'Ethereum Sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      icon:
        'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg'
    }
  }
] as ChainData[]

export const getDefaultChains = () => {
  if (config.is(Env.DEVELOPMENT)) {
    return TESTNET_DEFAULT_CHAINS
  }
  return DEFAULT_CHAINS
}

export const estimateTransactionGas = async (
  selectedChain: ChainId,
  wallet: Wallet,
  asset: Asset,
  order?: Order
) => {
  const networkProvider = await getNetworkProvider(selectedChain)
  const provider = new ethers.providers.Web3Provider(networkProvider)

  let estimation: BigNumber | undefined
  if (order && isNFT(asset)) {
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    const c = new ethers.Contract(contract.address, contract.abi, provider)
    estimation = await c.estimateGas.executeOrder(
      asset.contractAddress,
      asset.tokenId,
      order.price,
      { from: wallet.address }
    )
  } else if (!isNFT(asset)) {
    const contract = getContract(ContractName.CollectionStore, asset.chainId)
    const c = new ethers.Contract(contract.address, contract.abi, provider)
    console.log('c: ', c)
    estimation = await c.estimateGas.buy(
      [
        [asset.contractAddress, [asset.itemId], [asset.price], [wallet.address]]
      ],
      { from: wallet.address }
    )
  }
  return estimation
}
