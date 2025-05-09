import { ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { ChainId, Network, Rarity, Trade } from '@dcl/schemas'
import { CreditsService } from 'decentraland-dapps/dist/lib/credits'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { getCredits } from 'decentraland-dapps/dist/modules/credits/selectors'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { Transak } from 'decentraland-dapps/dist/modules/gateway/transak'
import { TransakConfig } from 'decentraland-dapps/dist/modules/gateway/types'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { ContractName, getContract, getContractName } from 'decentraland-transactions'
import { config } from '../../config'
import { API_SIGNER } from '../../lib/api'
import { getOnChainTrade } from '../../utils/trades'
import { getAssetImage, isNFT } from '../asset/utils'
import { getIsCreditsEnabled } from '../features/selectors'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { getWallet } from '../wallet/selectors'
import { OPEN_TRANSAK, OpenTransakAction, openTransakFailure } from './actions'
import { encodeTokenId } from './utils'

export function* transakSaga() {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)
}

const MarketplaceV3ContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '670660ed2bbeb54123b28728',
    [ChainId.MATIC_MAINNET]: '6717e6cd2fb1688e111c1a80'
  },
  [Network.ETHEREUM]: {
    [ChainId.ETHEREUM_MAINNET]: '672100492fb1688e111c2bd4',
    [ChainId.ETHEREUM_SEPOLIA]: '671a23e92bbeb54123b3b692'
  }
}
const CreditsManagerContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '67dd4ceda7e28cc91ce4c391',
    [ChainId.MATIC_MAINNET]: ''
  }
}
const MarketplaceV2ContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '670e86dd2bbeb54123b3a2a3',
    [ChainId.MATIC_MAINNET]: '6717e6dac00223b9cc8e51cd'
  },
  [Network.ETHEREUM]: {
    [ChainId.ETHEREUM_MAINNET]: '672100572fb1688e111c2bdb',
    [ChainId.ETHEREUM_SEPOLIA]: '671f9815945ac8890fbae4c6'
  }
}
const TransakMulticallContracts: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '0xCB9bD5aCD627e8FcCf9EB8d4ba72AEb1Cd8Ff5EF',
    [ChainId.MATIC_MAINNET]: '0x4A598B7eC77b1562AD0dF7dc64a162695cE4c78A'
  },
  [Network.ETHEREUM]: {
    [ChainId.ETHEREUM_MAINNET]: '0xab88cd272863b197b48762ea283f24a13f6586dd',
    [ChainId.ETHEREUM_SEPOLIA]: '0xD84aC4716A082B1F7eCDe9301aA91A7c4B62ECd7'
  }
}

function* handleOpenTransak(action: OpenTransakAction) {
  const { asset, order, useCredits } = action.payload
  const transakConfig: TransakConfig = {
    apiBaseUrl: config.get('MARKETPLACE_SERVER_URL'),
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV'),
    pollingDelay: +config.get('TRANSAK_POLLING_DELAY'),
    pusher: {
      appKey: config.get('TRANSAK_PUSHER_APP_KEY'),
      appCluster: config.get('TRANSAK_PUSHER_APP_CLUSTER')
    }
  }

  try {
    const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
    if (!wallet) {
      return
    }

    const tradeId = isNFT(asset) ? order?.tradeId : asset.tradeId
    let calldata: string = ''
    let contractId

    const transakMulticallContract = TransakMulticallContracts[asset.network]?.[asset.chainId]
    if (!transakMulticallContract) {
      throw new Error(`Transak multicall contract not found for network ${asset.network} and chainId ${asset.chainId}`)
    }

    let credits: CreditsResponse | null = null
    if (useCredits) {
      const isCreditsEnabled: boolean = yield select(getIsCreditsEnabled)
      if (!isCreditsEnabled) {
        throw new Error('Credits are not enabled')
      }
      credits = yield select(getCredits, wallet?.address || '')
      if (!credits || credits.totalCredits <= 0) {
        throw new Error('No credits available')
      }
    }

    if (tradeId && wallet?.address) {
      // MarketplaceV3
      contractId = MarketplaceV3ContractIds[asset.network]?.[asset.chainId]
      if (!contractId) {
        throw new Error(`Marketplace contract not found for network ${asset.network} and chainId ${asset.chainId}`)
      }
      const tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
      const trade: Trade = yield call([tradeService, 'fetchTrade'], tradeId)
      const { abi } = getContract(ContractName.OffChainMarketplace, asset.chainId)

      // if credits are enabled and useCredits is true, we need to use credits
      if (useCredits && credits) {
        contractId = CreditsManagerContractIds[Network.MATIC][asset.chainId]
        if (!contractId) {
          throw new Error(`Credits manager contract not found for network ${asset.network} and chainId ${asset.chainId}`)
        }
        // prepare credits data
        const contract = getContract(ContractName.CreditsManager, asset.chainId)
        const CreditsManagerInterface = new ethers.utils.Interface(contract.abi)
        const { creditsData, creditsSignatures, externalCall, maxUncreditedValue, maxCreditedValue } =
          new CreditsService().prepareCreditsMarketplace(trade, wallet.address, credits.credits)

        const useCreditsArgs = {
          credits: creditsData,
          creditsSignatures,
          externalCall,
          customExternalCallSignature: '0x', // Empty since we're not using a custom external call
          maxUncreditedValue,
          maxCreditedValue
        }
        // encode useCredits function data
        calldata = CreditsManagerInterface.encodeFunctionData('useCredits', [useCreditsArgs])
      } else {
        // native call to marketplace
        const MarketplaveV3Interface = new ethers.utils.Interface(abi)
        calldata = MarketplaveV3Interface.encodeFunctionData('accept', [[getOnChainTrade(trade, transakMulticallContract)]])
      }
    } else if (order && isNFT(asset)) {
      // Legacy Marketplace
      contractId = MarketplaceV2ContractIds[asset.network]?.[asset.chainId]
      if (!contractId) {
        throw new Error(`Marketplace contract not found for network ${asset.network} and chainId ${asset.chainId}`)
      }
      const contractName = getContractName(order.marketplaceAddress)
      const contract = getContract(contractName, order.chainId)

      if (useCredits && credits) {
        contractId = CreditsManagerContractIds[Network.MATIC][asset.chainId]
        if (!contractId) {
          throw new Error(`Credits manager contract not found for network ${asset.network} and chainId ${asset.chainId}`)
        }
        // prepare credits data
        const contract = getContract(ContractName.CreditsManager, asset.chainId)
        const CreditsManagerInterface = new ethers.utils.Interface(contract.abi)
        const { creditsData, creditsSignatures, externalCall, maxUncreditedValue, maxCreditedValue } =
          new CreditsService().prepareCreditsLegacyMarketplace(asset, order, credits.credits)

        const useCreditsArgs = {
          credits: creditsData,
          creditsSignatures,
          externalCall,
          customExternalCallSignature: '0x', // Empty since we're not using a custom external call
          maxUncreditedValue,
          maxCreditedValue
        }
        // encode useCredits function data
        calldata = CreditsManagerInterface.encodeFunctionData('useCredits', [useCreditsArgs])
      } else {
        const MarketplaceV2Interface = new ethers.utils.Interface(contract.abi)
        calldata = MarketplaceV2Interface.encodeFunctionData('executeOrder', [asset.contractAddress, asset.tokenId, order.price])
      }
    } else if (!isNFT(asset)) {
      // CollectionStore
      if (useCredits && credits) {
        contractId = CreditsManagerContractIds[Network.MATIC][asset.chainId]
        if (!contractId) {
          throw new Error(`Credits manager contract not found for network ${asset.network} and chainId ${asset.chainId}`)
        }
        const contract = getContract(ContractName.CreditsManager, asset.chainId)
        const CreditsManagerInterface = new ethers.utils.Interface(contract.abi)
        const { creditsData, creditsSignatures, externalCall, maxUncreditedValue, maxCreditedValue } =
          new CreditsService().prepareCreditsCollectionStore(asset, wallet.address, credits.credits)
        const useCreditsArgs = {
          credits: creditsData,
          creditsSignatures,
          externalCall,
          customExternalCallSignature: '0x', // Empty since we're not using a custom external call
          maxUncreditedValue,
          maxCreditedValue
        }

        // encode useCredits function data
        calldata = CreditsManagerInterface.encodeFunctionData('useCredits', [useCreditsArgs])
      } else {
        contractId = asset.chainId === ChainId.MATIC_AMOY ? '670e8b512bbeb54123b3a2b4' : '6717e6e62fb1688e111c1a87' // CollectionStore contractId
        const contract = getContract(ContractName.CollectionStore, asset.chainId)
        const CollectionStoreInterface = new ethers.utils.Interface(contract.abi)
        calldata = CollectionStoreInterface.encodeFunctionData('buy', [
          [[asset.contractAddress, [asset.itemId], [asset.price], [transakMulticallContract]]]
        ])
      }
    }

    let tokenId: string = ''
    if (!isNFT(asset)) {
      const raritySupply = Rarity.getMaxSupply(asset.rarity)
      const available = asset.available
      const nextIssueId = raritySupply - available + 1
      tokenId = encodeTokenId(parseInt(asset.itemId), nextIssueId).toString()
    } else {
      tokenId = asset.tokenId
    }

    let price: string | undefined
    if (useCredits && credits) {
      price = (BigInt((isNFT(asset) ? order?.price : asset.price) || 0) - BigInt(credits.totalCredits)).toString()
    } else {
      price = isNFT(asset) ? order?.price : asset.price
    }
    const customizationOptions = {
      calldata,
      cryptoCurrencyCode: 'MANA',
      isNFT: true,
      estimatedGasLimit: 70_000,
      widgetWidth: isMobile() ? undefined : '450px', // To avoid fixing the width of the widget in mobile
      contractId,
      nftData: [
        {
          imageURL: getAssetImage(asset),
          nftName: asset.name,
          collectionAddress: asset.contractAddress,
          tokenID: [`${tokenId}`],
          price: [+ethers.utils.formatEther(price || 0)],
          quantity: 1,
          nftType: 'ERC721'
        }
      ]
    }
    const address: string | undefined = (yield select(getAddress)) as ReturnType<typeof getAddress>

    yield put(closeAllModals())
    if (address) {
      new Transak(transakConfig, customizationOptions).openWidget(address, Network.MATIC)
    }
  } catch (error) {
    yield put(openTransakFailure(error instanceof Error ? error.message : 'Unknown error'))
  }
}
