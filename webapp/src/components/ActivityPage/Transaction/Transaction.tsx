import React from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { Network } from '@dcl/schemas'
import { TransactionLink, Profile } from 'decentraland-dapps/dist/containers'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import {
  GrantTokenSuccessAction,
  RevokeTokenSuccessAction,
  GRANT_TOKEN_SUCCESS,
  REVOKE_TOKEN_SUCCESS
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { ADD_MANA_PURCHASE_AS_TRANSACTION } from 'decentraland-dapps/dist/modules/gateway/actions'
import { ManaPurchase } from 'decentraland-dapps/dist/modules/gateway/types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { gatewaysNames } from 'decentraland-ui/dist/components/BuyManaWithFiatModal/Network'
import { getNetworkMANADescription } from 'decentraland-ui/dist/lib/network'
import { AssetType } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import { PLACE_BID_SUCCESS, ACCEPT_BID_TRANSACTION_SUBMITTED, CANCEL_BID_SUCCESS } from '../../../modules/bid/actions'
import { BUY_ITEM_CROSS_CHAIN_SUCCESS, BUY_ITEM_SUCCESS, BUY_ITEM_WITH_CARD_SUCCESS } from '../../../modules/item/actions'
import { TRANSFER_NFT_TRANSACTION_SUBMITTED } from '../../../modules/nft/actions'
import { isParcel } from '../../../modules/nft/utils'
import {
  CREATE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  EXECUTE_ORDER_TRANSACTION_SUBMITTED,
  EXECUTE_ORDER_WITH_CARD_SUCCESS
} from '../../../modules/order/actions'
import {
  ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED,
  CLAIM_ASSET_TRANSACTION_SUBMITTED,
  REMOVE_RENTAL_TRANSACTION_SUBMITTED
} from '../../../modules/rental/actions'
import { locations } from '../../../modules/routing/locations'
import { getContractNames } from '../../../modules/vendor'
import { AssetProvider } from '../../AssetProvider'
import { Mana } from '../../Mana'
import { TransactionDetail } from './TransactionDetail'
import { Props } from './Transaction.types'

const Transaction = (props: Props) => {
  const { tx, getContract } = props
  switch (tx.actionType) {
    case GRANT_TOKEN_SUCCESS:
    case REVOKE_TOKEN_SUCCESS: {
      const { authorization } = tx.payload as GrantTokenSuccessAction['payload'] | RevokeTokenSuccessAction['payload']
      const authorized = getContract({
        address: authorization.authorizedAddress
      })
      const contract = getContract({ address: authorization.contractAddress })
      const action = tx.actionType === GRANT_TOKEN_SUCCESS ? t('transaction.action.approved') : t('transaction.action.unapproved')

      if (!authorized || !contract) {
        return null
      }

      return (
        <TransactionDetail
          text={
            <T
              id="transaction.detail.approve_token"
              values={{
                action,
                contract: (
                  <TransactionLink chainId={authorization.chainId} address={authorized.address} txHash="">
                    {authorized.label || authorized.name}
                  </TransactionLink>
                ),
                token: (
                  <TransactionLink chainId={authorization.chainId} address={contract.address} txHash="">
                    {contract.label || contract.name}
                  </TransactionLink>
                )
              }}
            />
          }
          tx={tx}
        />
      )
    }
    case CREATE_ORDER_SUCCESS: {
      const { tokenId, contractAddress, network, name, price } = tx.payload as {
        tokenId: string
        contractAddress: string
        network: Network
        name: string
        price: number
      }
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.create_order"
                  values={{
                    name: <Link to={locations.nft(contractAddress, tokenId)}>{name}</Link>,
                    price: (
                      <Mana showTooltip network={network} inline>
                        {price.toLocaleString()}
                      </Mana>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case CANCEL_ORDER_SUCCESS: {
      const { tokenId, contractAddress, network, name, price } = tx.payload as {
        tokenId: string
        contractAddress: string
        network: Network
        name: string
        price: number
      }
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.cancel_order"
                  values={{
                    name: <Link to={locations.nft(contractAddress, tokenId)}>{name}</Link>,
                    price: (
                      <Mana showTooltip network={network} inline>
                        {price.toLocaleString()}
                      </Mana>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case BUY_ITEM_SUCCESS:
    case BUY_ITEM_CROSS_CHAIN_SUCCESS:
    case EXECUTE_ORDER_TRANSACTION_SUBMITTED:
    case BUY_ITEM_WITH_CARD_SUCCESS:
    case EXECUTE_ORDER_WITH_CARD_SUCCESS: {
      const { tokenId, itemId, contractAddress, network, name, price } = tx.payload as {
        tokenId: string
        itemId: string
        contractAddress: string
        network: Network
        name: string
        price: number
      }

      let assetTokenId: string
      let type: AssetType
      let url: string
      if (itemId) {
        type = AssetType.ITEM
        assetTokenId = itemId
        url = locations.item(contractAddress, assetTokenId)
      } else {
        type = AssetType.NFT
        assetTokenId = tokenId
        url = locations.nft(contractAddress, assetTokenId)
      }

      return (
        <AssetProvider type={type} contractAddress={contractAddress} tokenId={assetTokenId}>
          {asset => (
            <TransactionDetail
              asset={asset}
              text={
                <T
                  id="transaction.detail.execute_order"
                  values={{
                    name: <Link to={url}>{name}</Link>,
                    price: (
                      <Mana showTooltip network={network} inline>
                        {price.toLocaleString()}
                      </Mana>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case TRANSFER_NFT_TRANSACTION_SUBMITTED: {
      const { tokenId, contractAddress, name, address } = tx.payload
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.transfer"
                  values={{
                    name: <Link to={locations.nft(contractAddress as string, tokenId as string)}>{name}</Link>,
                    address: (
                      <Link to={locations.account(address as string)}>
                        <Profile address={address} />
                      </Link>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case PLACE_BID_SUCCESS:
    case ACCEPT_BID_TRANSACTION_SUBMITTED:
    case CANCEL_BID_SUCCESS: {
      const payload = tx.payload as { contractAddress: string; price: number } & ({ tokenId: string } | { itemId: string })
      const { contractAddress, price } = payload

      const tokenId = 'tokenId' in payload ? payload.tokenId : payload.itemId
      const assetType = 'tokenId' in payload ? AssetType.NFT : AssetType.ITEM
      const link = assetType === AssetType.NFT ? locations.nft(contractAddress, tokenId) : locations.item(contractAddress, tokenId)
      const translationKey =
        tx.actionType === PLACE_BID_SUCCESS
          ? 'transaction.detail.place_bid'
          : tx.actionType === ACCEPT_BID_TRANSACTION_SUBMITTED
            ? 'transaction.detail.accept_bid'
            : 'transaction.detail.cancel_bid'

      return (
        <AssetProvider type={assetType} contractAddress={contractAddress} tokenId={tokenId}>
          {asset => (
            <TransactionDetail
              asset={asset}
              text={
                <T
                  id={translationKey}
                  values={{
                    name: <Link to={link}>{asset ? getAssetName(asset) : ''}</Link>,
                    price: (
                      <Mana showTooltip network={asset?.network} inline>
                        {price.toLocaleString()}
                      </Mana>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case CLAIM_ASSET_TRANSACTION_SUBMITTED: {
      const { tokenId, contractAddress, rentalContractAddress, chainId } = tx.payload
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.claim_asset"
                  values={{
                    asset: nft ? (isParcel(nft) ? t('global.the_parcel') : t('global.the_estate')) : '',
                    name: <Link to={locations.manage(contractAddress as string, tokenId as string)}>{nft ? getAssetName(nft) : ''}</Link>,
                    contract: (
                      <TransactionLink chainId={chainId} address={rentalContractAddress} txHash="">
                        {t('transaction.rental.contract')}
                      </TransactionLink>
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case REMOVE_RENTAL_TRANSACTION_SUBMITTED: {
      const { tokenId, contractAddress } = tx.payload
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.remove_rental"
                  values={{
                    name: <Link to={locations.manage(contractAddress as string, tokenId as string)}>{nft ? getAssetName(nft) : ''}</Link>
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case ACCEPT_RENTAL_LISTING_TRANSACTION_SUBMITTED: {
      const { tokenId, contractAddress, pricePerDay, duration } = tx.payload
      return (
        <AssetProvider type={AssetType.NFT} contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.accept_rental"
                  values={{
                    name: <Link to={locations.manage(contractAddress as string, tokenId as string)}>{nft ? getAssetName(nft) : ''}</Link>,
                    pricePerDay: (
                      <Mana showTooltip network={nft?.network} inline>
                        {/* As this there might be already registered transactions and the price information is new, consider it optional */}
                        {pricePerDay ? ethers.utils.formatEther(pricePerDay as string) : '0'}
                      </Mana>
                    ),
                    duration: <span>{duration}</span>
                  }}
                />
              }
              tx={tx}
            />
          )}
        </AssetProvider>
      )
    }
    case ADD_MANA_PURCHASE_AS_TRANSACTION: {
      const {
        purchase: { network, amount, gateway }
      }: { purchase: ManaPurchase } = tx.payload

      const chainId = getChainIdByNetwork(network)
      const contract = getContract({
        name: getContractNames().MANA,
        network: network as Network.ETHEREUM | Network.MATIC
      })

      const name = getNetworkMANADescription(network)

      return (
        <TransactionDetail
          text={
            <T
              id="transaction.detail.buy_mana"
              values={{
                amount: amount.toLocaleString(),
                name: contract ? (
                  <TransactionLink chainId={chainId} address={contract.address} txHash="">
                    {name}
                  </TransactionLink>
                ) : (
                  name
                ),
                gateway: gatewaysNames[gateway]
              }}
            />
          }
          tx={tx}
        />
      )
    }
    default:
      return null
  }
}

export default React.memo(Transaction)
