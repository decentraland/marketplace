import React from 'react'
import { Link } from 'react-router-dom'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { TransactionLink, Profile } from 'decentraland-dapps/dist/containers'
import {
  GrantTokenSuccessAction,
  RevokeTokenSuccessAction,
  GRANT_TOKEN_SUCCESS,
  REVOKE_TOKEN_SUCCESS
} from 'decentraland-dapps/dist/modules/authorization/actions'

import { getAssetName } from '../../../modules/asset/utils'
import {
  CREATE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  EXECUTE_ORDER_SUCCESS
} from '../../../modules/order/actions'
import { BUY_ITEM_SUCCESS } from '../../../modules/item/actions'
import { TRANSFER_NFT_SUCCESS } from '../../../modules/nft/actions'
import {
  PLACE_BID_SUCCESS,
  ACCEPT_BID_SUCCESS,
  CANCEL_BID_SUCCESS
} from '../../../modules/bid/actions'
import { locations } from '../../../modules/routing/locations'
import { CLAIM_LAND_TRANSACTION_SUBMITTED } from '../../../modules/rental/actions'
import { getContract } from '../../../modules/contract/utils'
import { AssetType } from '../../../modules/asset/types'
import { AssetProvider } from '../../AssetProvider'
import { Mana } from '../../Mana'
import { TransactionDetail } from './TransactionDetail'
import { Props } from './Transaction.types'

const Transaction = (props: Props) => {
  const { tx } = props
  switch (tx.actionType) {
    case GRANT_TOKEN_SUCCESS:
    case REVOKE_TOKEN_SUCCESS: {
      const { authorization } = tx.payload as
        | GrantTokenSuccessAction['payload']
        | RevokeTokenSuccessAction['payload']
      const authorized = getContract({
        address: authorization.authorizedAddress
      })
      const contract = getContract({ address: authorization.contractAddress })
      const action =
        tx.actionType === GRANT_TOKEN_SUCCESS
          ? t('transaction.action.approved')
          : t('transaction.action.unapproved')
      return (
        <TransactionDetail
          text={
            <T
              id="transaction.detail.approve_token"
              values={{
                action,
                contract: (
                  <TransactionLink
                    chainId={authorization.chainId}
                    address={authorized.address}
                    txHash=""
                  >
                    {authorized.label || authorized.name}
                  </TransactionLink>
                ),
                token: (
                  <TransactionLink
                    chainId={authorization.chainId}
                    address={contract.address}
                    txHash=""
                  >
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
      const { tokenId, contractAddress, network, name, price } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.create_order"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    price: (
                      <Mana network={network} inline>
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
      const { tokenId, contractAddress, network, name, price } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.cancel_order"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    price: (
                      <Mana network={network} inline>
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
    case EXECUTE_ORDER_SUCCESS: {
      const {
        tokenId,
        itemId,
        contractAddress,
        network,
        name,
        price
      } = tx.payload

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
        <AssetProvider
          type={type}
          contractAddress={contractAddress}
          tokenId={assetTokenId}
        >
          {asset => (
            <TransactionDetail
              asset={asset}
              text={
                <T
                  id="transaction.detail.execute_order"
                  values={{
                    name: <Link to={url}>{name}</Link>,
                    price: (
                      <Mana network={network} inline>
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
    case TRANSFER_NFT_SUCCESS: {
      const { tokenId, contractAddress, name, address } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.transfer"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    address: (
                      <Link to={locations.account(address)}>
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
    case PLACE_BID_SUCCESS: {
      const { tokenId, contractAddress, price } = tx.payload

      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.place_bid"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {nft ? getAssetName(nft) : ''}
                      </Link>
                    ),
                    price: (
                      <Mana network={nft?.network} inline>
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
    case ACCEPT_BID_SUCCESS: {
      const { tokenId, contractAddress, price } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.accept_bid"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {nft ? getAssetName(nft) : ''}
                      </Link>
                    ),
                    price: (
                      <Mana inline network={nft?.network}>
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
    case CANCEL_BID_SUCCESS: {
      const { tokenId, contractAddress, price } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.cancel_bid"
                  values={{
                    name: (
                      <Link to={locations.nft(contractAddress, tokenId)}>
                        {nft ? getAssetName(nft) : ''}
                      </Link>
                    ),
                    price: (
                      <Mana inline network={nft?.network}>
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
    case CLAIM_LAND_TRANSACTION_SUBMITTED: {
      const {
        tokenId,
        contractAddress,
        rentalContractAddress,
        chainId
      } = tx.payload
      return (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={contractAddress}
          tokenId={tokenId}
        >
          {nft => (
            <TransactionDetail
              asset={nft}
              text={
                <T
                  id="transaction.detail.claim_land"
                  values={{
                    name: (
                      <Link to={locations.manage(contractAddress, tokenId)}>
                        {nft ? getAssetName(nft) : ''}
                      </Link>
                    ),
                    contract: (
                      <TransactionLink
                        chainId={chainId}
                        address={rentalContractAddress}
                        txHash=""
                      >
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
    default:
      return null
  }
}

export default React.memo(Transaction)
