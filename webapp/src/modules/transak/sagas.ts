import { ethers } from 'ethers'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Network, Trade } from '@dcl/schemas'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Transak } from 'decentraland-dapps/dist/modules/gateway/transak'
import { TransakConfig } from 'decentraland-dapps/dist/modules/gateway/types'
import { closeAllModals } from 'decentraland-dapps/dist/modules/modal/actions'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { ContractName, getContract } from 'decentraland-transactions'
import { config } from '../../config'
import { API_SIGNER } from '../../lib/api'
import { getOnChainTrade } from '../../utils/trades'
import { getAssetImage, isNFT } from '../asset/utils'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { getWallet } from '../wallet/selectors'
import { OPEN_TRANSAK, OpenTransakAction } from './actions'

export function* transakSaga() {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)
}

function* handleOpenTransak(action: OpenTransakAction) {
  const { asset, order } = action.payload
  const transakConfig: TransakConfig = {
    apiBaseUrl: config.get('TRANSAK_API_URL'),
    key: config.get('TRANSAK_KEY'),
    env: config.get('TRANSAK_ENV'),
    pollingDelay: +config.get('TRANSAK_POLLING_DELAY'),
    pusher: {
      appKey: config.get('TRANSAK_PUSHER_APP_KEY'),
      appCluster: config.get('TRANSAK_PUSHER_APP_CLUSTER')
    }
  }

  const wallet = (yield select(getWallet)) as ReturnType<typeof getWallet>
  console.log('wallet: ', wallet)

  const tradeId = isNFT(asset) ? order?.tradeId : asset.tradeId
  console.log('tradeId: ', tradeId)
  if (tradeId && wallet?.address) {
    const tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
    const trade: Trade = yield call([tradeService, 'fetchTrade'], tradeId)
    console.log('trade: ', trade)
    // const tokenId = isNFT(asset) ? asset.tokenId : asset.itemId
    const { abi } = getContract(ContractName.OffChainMarketplace, asset.chainId)
    const MarketplaveV3Interface = new ethers.utils.Interface(abi)
    const customizationOptions = {
      calldata: MarketplaveV3Interface.encodeFunctionData('accept', [[getOnChainTrade(trade, wallet.address)]]),
      // cryptoCurrencyCode: 'TRNSK',
      cryptoCurrencyCode: 'MANA',
      // contractAddress: asset.contractAddress,
      // tokenId,
      // tradeType: isNFT(asset) ? TradeType.SECONDARY : TradeType.PRIMARY,
      // productsAvailed: ProductsAvailed.BUY,
      isNFT: true,
      estimatedGasLimit: 70_000,
      widgetWidth: isMobile() ? undefined : '450px', // To avoid fixing the width of the widget in mobile
      contractId: '66fff5412bbeb54123ab4b8f',
      nftData: [
        {
          imageURL: getAssetImage(asset),
          nftName: asset.name,
          collectionAddress: asset.contractAddress,
          tokenID: [isNFT(asset) ? asset.tokenId : asset.itemId],
          price: [+ethers.utils.formatEther((isNFT(asset) ? order?.price : asset.price) || 0)],
          quantity: 1,
          nftType: 'ERC721'
        }
      ]
    }
    const address: string | undefined = (yield select(getAddress)) as ReturnType<typeof getAddress>

    yield put(closeAllModals())
    if (address) {
      console.log('customizationOptions: ', customizationOptions)
      new Transak(transakConfig, customizationOptions).openWidget(address, Network.MATIC)
    }
  }
}
