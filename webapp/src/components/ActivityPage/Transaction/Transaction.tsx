import React from 'react'
import { Props } from './Transaction.types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { EtherscanLink } from 'decentraland-dapps/dist/containers'
import {
  APPROVE_TOKEN_SUCCESS,
  ALLOW_TOKEN_SUCCESS
} from '../../../modules/authorization/actions'
import { TransactionDetail } from './TransactionDetail'
import { contractSymbols } from '../../../modules/contract/utils'
import './Transaction.css'
import {
  CREATE_ORDER_SUCCESS,
  CANCEL_ORDER_SUCCESS,
  EXECUTE_ORDER_SUCCESS
} from '../../../modules/order/actions'
import { NFTProvider } from '../../NFTProvider'
import { Mana, Popup } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { Link } from 'react-router-dom'
import { TRANSFER_NFT_SUCCESS } from '../../../modules/nft/actions'
import { shortenAddress } from '../../../modules/wallet/utils'

const Transaction = (props: Props) => {
  const { tx } = props
  switch (tx.actionType) {
    case ALLOW_TOKEN_SUCCESS: {
      const { isAllowed, contractAddress, tokenContractAddress } = tx.payload
      return (
        <TransactionDetail
          text={
            <T
              id="transaction.detail.approve_token"
              values={{
                action: isAllowed
                  ? t('transaction.action.approved')
                  : t('transaction.action.not_approved'),
                contract: (
                  <EtherscanLink address={contractAddress} txHash="">
                    {contractSymbols[contractAddress]}
                  </EtherscanLink>
                ),
                token: (
                  <EtherscanLink address={tokenContractAddress} txHash="">
                    {contractSymbols[tokenContractAddress]}
                  </EtherscanLink>
                )
              }}
            />
          }
          tx={tx}
        />
      )
    }
    case APPROVE_TOKEN_SUCCESS: {
      const { isApproved, contractAddress, tokenContractAddress } = tx.payload
      return (
        <TransactionDetail
          text={
            <T
              id="transaction.detail.approve_token"
              values={{
                action: isApproved
                  ? t('transaction.action.approved')
                  : t('transaction.action.not_approved'),
                contract: (
                  <EtherscanLink address={contractAddress} txHash="">
                    {contractSymbols[contractAddress]}
                  </EtherscanLink>
                ),
                token: (
                  <EtherscanLink address={tokenContractAddress} txHash="">
                    {contractSymbols[tokenContractAddress]}
                  </EtherscanLink>
                )
              }}
            />
          }
          tx={tx}
        />
      )
    }
    case CREATE_ORDER_SUCCESS: {
      const { tokenId, contractAddress, name, price } = tx.payload
      return (
        <NFTProvider contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              nft={nft}
              text={
                <T
                  id="transaction.detail.create_order"
                  values={{
                    name: (
                      <Link to={locations.ntf(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    price: <Mana inline>{price.toLocaleString()}</Mana>
                  }}
                />
              }
              tx={tx}
            />
          )}
        </NFTProvider>
      )
    }
    case CANCEL_ORDER_SUCCESS: {
      const { tokenId, contractAddress, name, price } = tx.payload
      return (
        <NFTProvider contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              nft={nft}
              text={
                <T
                  id="transaction.detail.cancel_order"
                  values={{
                    name: (
                      <Link to={locations.ntf(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    price: <Mana inline>{price.toLocaleString()}</Mana>
                  }}
                />
              }
              tx={tx}
            />
          )}
        </NFTProvider>
      )
    }
    case EXECUTE_ORDER_SUCCESS: {
      const { tokenId, contractAddress, name, price } = tx.payload
      return (
        <NFTProvider contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              nft={nft}
              text={
                <T
                  id="transaction.detail.execute_order"
                  values={{
                    name: (
                      <Link to={locations.ntf(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    price: <Mana inline>{price.toLocaleString()}</Mana>
                  }}
                />
              }
              tx={tx}
            />
          )}
        </NFTProvider>
      )
    }
    case TRANSFER_NFT_SUCCESS: {
      const { tokenId, contractAddress, name, address } = tx.payload
      return (
        <NFTProvider contractAddress={contractAddress} tokenId={tokenId}>
          {nft => (
            <TransactionDetail
              nft={nft}
              text={
                <T
                  id="transaction.detail.transfer"
                  values={{
                    name: (
                      <Link to={locations.ntf(contractAddress, tokenId)}>
                        {name}
                      </Link>
                    ),
                    address: (
                      <Popup
                        content={address}
                        position="top center"
                        on="hover"
                        trigger={
                          <Link to={locations.account(address.toLowerCase())}>
                            {shortenAddress(address)}
                          </Link>
                        }
                      />
                    )
                  }}
                />
              }
              tx={tx}
            />
          )}
        </NFTProvider>
      )
    }
    default:
      return null
  }
}

export default React.memo(Transaction)
