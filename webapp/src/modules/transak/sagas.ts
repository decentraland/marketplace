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
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { TradeService } from 'decentraland-dapps/dist/modules/trades/TradeService'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ContractName, getContract, getContractName } from 'decentraland-transactions'
import { config } from '../../config'
import { API_SIGNER } from '../../lib/api'
import { getOnChainTrade } from '../../utils/trades'
import { getAssetImage, isNFT } from '../asset/utils'
import { getIsCreditsEnabled } from '../features/selectors'
import { getOpenTransakFailureToast } from '../toast/toasts'
import { resolveCheckoutPriceInMana } from '../trade/checkoutPrice'
import { MARKETPLACE_SERVER_URL } from '../vendor/decentraland'
import { getWallet } from '../wallet/selectors'
import { OPEN_TRANSAK, OpenTransakAction, openTransakFailure } from './actions'
import { getTransakContractId, encodeTokenId } from './utils'

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

export function* transakSaga(getIdentity: () => AuthIdentity | undefined) {
  yield takeEvery(OPEN_TRANSAK, handleOpenTransak)

  function* handleOpenTransak(action: OpenTransakAction) {
    const { asset, order, useCredits } = action.payload
    const transakConfig: TransakConfig = {
      apiBaseUrl: config.get('MARKETPLACE_SERVER_URL'),
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
        // Off-chain marketplace. The trade is read first because which marketplace version this listing was
        // signed against decides the Transak registration and the ABI — but only on the direct route; the
        // credits route goes through the CreditsManager and needs neither.
        const tradeService = new TradeService(API_SIGNER, MARKETPLACE_SERVER_URL, () => undefined)
        const trade: Trade = yield call([tradeService, 'fetchTrade'], tradeId)

        // if credits are enabled and useCredits is true, we need to use credits
        if (useCredits && credits) {
          contractId = getTransakContractId({ kind: 'trade', network: asset.network, chainId: asset.chainId, useCredits: true })
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
          // Native call to the marketplace: Transak executes `accept` on the contract itself, so it needs a
          // registration for THIS version. The credits route above does not — the CreditsManager is the
          // registered contract there, and it resolves the marketplace from the trade on chain.
          const marketplaceName = getContractName(trade.contract)
          contractId = getTransakContractId({
            kind: 'trade',
            network: asset.network,
            chainId: asset.chainId,
            marketplaceAddress: trade.contract
          })
          if (!contractId) {
            // Fail closed. Executing against another version's registration would send `accept` to a contract
            // the signature does not authorise, so the purchase reverts after the buyer has already paid.
            throw new Error(`${marketplaceName} is not registered with Transak on chainId ${asset.chainId}`)
          }
          const { abi } = getContract(marketplaceName, asset.chainId)
          const marketplaceInterface = new ethers.utils.Interface(abi)
          calldata = marketplaceInterface.encodeFunctionData('accept', [[getOnChainTrade(trade, transakMulticallContract)]])
        }
      } else if (order && isNFT(asset)) {
        // Legacy Marketplace
        contractId = getTransakContractId({ kind: 'order', network: asset.network, chainId: asset.chainId })
        if (!contractId) {
          throw new Error(`Marketplace contract not found for network ${asset.network} and chainId ${asset.chainId}`)
        }
        const contractName = getContractName(order.marketplaceAddress)
        const contract = getContract(contractName, order.chainId)

        if (useCredits && credits) {
          contractId = getTransakContractId({ kind: 'order', network: asset.network, chainId: asset.chainId, useCredits: true })
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
          contractId = getTransakContractId({ kind: 'order', network: asset.network, chainId: asset.chainId, useCredits: true })
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
          contractId = getTransakContractId({ kind: 'mint', network: asset.network, chainId: asset.chainId })
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

      // The widget is quoted in MANA, and the listing's own amount only is on most listings: a USD-pegged
      // trade carries USD wei, which would quote the buyer a price in the wrong unit. Credits are MANA
      // denominated too, so they are subtracted from the converted figure rather than from the raw one.
      const listedPrice = (isNFT(asset) ? order?.price : asset.price) || '0'
      const { manaWei } = (yield call(resolveCheckoutPriceInMana, listedPrice, asset.chainId, tradeId)) as Awaited<
        ReturnType<typeof resolveCheckoutPriceInMana>
      >
      if (manaWei === null) {
        throw new Error('Could not resolve the price of this listing in MANA')
      }

      let price: string | undefined
      if (useCredits && credits) {
        const remaining = BigInt(manaWei) - BigInt(credits.totalCredits)
        price = (remaining > 0n ? remaining : 0n).toString()
      } else {
        price = manaWei
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
        const transak = new Transak(transakConfig, getIdentity())
        yield call([transak, 'openWidget'], { ...customizationOptions, walletAddress: address, network: Network.MATIC })
      }
    } catch (error) {
      // Tell the buyer. OPEN_TRANSAK_FAILURE has no reducer or handler, so on its own it is a dead end —
      // the widget just never opens.
      yield put(showToast(getOpenTransakFailureToast()))
      yield put(openTransakFailure(error instanceof Error ? error.message : 'Unknown error'))
    }
  }
}
