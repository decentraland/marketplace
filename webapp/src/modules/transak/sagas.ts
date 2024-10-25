import { ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { ChainId, Network, Rarity, Trade } from '@dcl/schemas'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
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
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { getWallet } from '../wallet/selectors'
import { OPEN_TRANSAK, OpenTransakAction } from './actions'
import { encodeTokenId } from './utils'

export function* transakSaga() {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)
}

function* handleOpenTransak(action: OpenTransakAction) {
  const { asset, order } = action.payload
  const transakConfig: TransakConfig = {
    marketplaceServerURL: config.get('MARKETPLACE_SERVER_URL'),
    apiBaseUrl: config.get('MARKETPLACE_SERVER_URL'),
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV'),
    pollingDelay: +config.get('TRANSAK_POLLING_DELAY'),
    pusher: {
      appKey: config.get('TRANSAK_PUSHER_APP_KEY'),
      appCluster: config.get('TRANSAK_PUSHER_APP_CLUSTER')
    }
  }

  const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
  if (!wallet) {
    return
  }

  const tradeId = isNFT(asset) ? order?.tradeId : asset.tradeId
  let calldata: string = ''
  let contractId
  const TRANSAK_MULTICALL_CONTRACT = '0xCB9bD5aCD627e8FcCf9EB8d4ba72AEb1Cd8Ff5EF'
  const MarketplaceV3ContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
    [Network.MATIC]: {
      [ChainId.MATIC_AMOY]: '670660ed2bbeb54123b28728',
      [ChainId.MATIC_MAINNET]: 'XXX'
    },
    [Network.ETHEREUM]: {
      [ChainId.ETHEREUM_MAINNET]: 'XXX',
      [ChainId.ETHEREUM_SEPOLIA]: '671a23e92bbeb54123b3b692'
    }
  }
  if (tradeId && wallet?.address) {
    contractId = MarketplaceV3ContractIds[asset.network]?.[asset.chainId]
    if (!contractId) {
      throw new Error(`Marketplace contract not found for network ${asset.network} and chainId ${asset.chainId}`)
      return
    }
    const tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
    const trade: Trade = yield call([tradeService, 'fetchTrade'], tradeId)
    const { abi } = getContract(ContractName.OffChainMarketplace, asset.chainId)
    const MarketplaveV3Interface = new ethers.utils.Interface(abi)
    calldata = MarketplaveV3Interface.encodeFunctionData('accept', [[getOnChainTrade(trade, TRANSAK_MULTICALL_CONTRACT)]])
  } else if (order && isNFT(asset)) {
    contractId = '670e86dd2bbeb54123b3a2a3' // MarketplaceV2 contractId
    const contractName = getContractName(order.marketplaceAddress)
    const contract = getContract(contractName, order.chainId)
    const MarketplaceV2Interface = new ethers.utils.Interface(contract.abi)
    calldata = MarketplaceV2Interface.encodeFunctionData('executeOrder', [[asset.contractAddress, asset.tokenId, order.price]])
  } else if (!isNFT(asset)) {
    contractId = '670e8b512bbeb54123b3a2b4' // CollectionStore contractId
    const contract = getContract(ContractName.CollectionStore, asset.chainId)
    const CollectionStoreInterface = new ethers.utils.Interface(contract.abi)
    calldata = CollectionStoreInterface.encodeFunctionData('buy', [
      [[asset.contractAddress, [asset.itemId], [asset.price], [TRANSAK_MULTICALL_CONTRACT]]]
    ])
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
        price: [+ethers.utils.formatEther((isNFT(asset) ? order?.price : asset.price) || 0)],
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
}
