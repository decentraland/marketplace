import { expectSaga } from 'redux-saga-test-plan'
import { push } from 'connected-react-router'
import { Network } from '@dcl/schemas'
import { setPurchase } from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  Purchase,
  PurchaseStatus
} from 'decentraland-dapps/dist/modules/gateway/types'
import { TradeType } from 'decentraland-dapps/dist/modules/gateway/transak/types'
import { NetworkGatewayType } from 'decentraland-ui'
import { locations } from '../routing/locations'
import { assetSaga } from './sagas'
import { AssetType } from './types'

const mockContractAddress = 'a-contract-address'
const mockTokenId = 'aTokenId'
const mockTradeType = TradeType.PRIMARY

const mockNFTPurchase: Purchase = {
  address: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
  id: 'mock-id',
  network: Network.MATIC,
  timestamp: 1535398843748,
  status: PurchaseStatus.PENDING,
  gateway: NetworkGatewayType.TRANSAK,
  txHash: null,
  amount: 1,
  nft: {
    contractAddress: mockContractAddress,
    tokenId: mockTokenId,
    tradeType: mockTradeType
  }
}

describe('when handling the set purchase action', () => {
  describe('when an NFT has been purchased', () => {
    it('should dispatch a push to the history with the location of the buy status page', () => {
      return expectSaga(assetSaga)
        .put(
          push(
            locations.buyStatusPage(
              AssetType.ITEM,
              mockContractAddress,
              mockTokenId
            )
          )
        )
        .dispatch(setPurchase(mockNFTPurchase))
        .run({ silenceTimeout: true })
    })
  })
})
