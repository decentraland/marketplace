import React, { useState, useCallback } from 'react'
import { Header, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { locations } from '../../../modules/routing/locations'
import { AssetAction } from '../../AssetAction'
import { Name } from '../Name'
import { Price } from '../Price'
import { AuthorizationModal } from '../../AuthorizationModal'
import { Props } from './BuyItemModal.types'
import { useMemo } from 'react'
import { getContract } from '../../../modules/contract/utils'
import { getContractNames } from '../../../modules/vendor'
import { Link } from 'react-router-dom'

const BuyItemModal = (props: Props) => {
  const {
    item,
    wallet,
    authorizations,
    isLoading,
    onBuyItem,
    isOwner,
    hasInsufficientMANA
  } = props

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handleExecuteOrder = useCallback(() => onBuyItem(item), [
    onBuyItem,
    item
  ])

  const authorization: Authorization = useMemo(() => {
    const contractNames = getContractNames()
    const mana = getContract({
      name: contractNames.MANA,
      network: item.network
    })

    const collectionStore = getContract({
      name: contractNames.COLLECTION_STORE,
      network: item.network
    })

    return {
      address: wallet.address,
      authorizedAddress: collectionStore.address,
      contractAddress: mana.address,
      contractName: ContractName.MANAToken,
      chainId: item.chainId,
      type: AuthorizationType.ALLOWANCE
    }
  }, [wallet, item])

  const handleSubmit = useCallback(() => {
    if (hasAuthorization(authorizations, authorization)) {
      handleExecuteOrder()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [
    authorizations,
    authorization,
    handleExecuteOrder,
    setShowAuthorizationModal
  ])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const isDisabled = !item.price || isOwner || hasInsufficientMANA

  const name = <Name asset={item} />

  let subtitle = null
  if (!item.isOnSale) {
    subtitle = <T id={'buy_page.not_for_sale'} values={{ name }} />
  } else if (isOwner) {
    subtitle = <T id={'buy_page.is_owner'} values={{ name }} />
  } else if (hasInsufficientMANA) {
    subtitle = (
      <T
        id={'buy_page.not_enough_mana'}
        values={{
          name,
          amount: <Price network={item.network} price={item.price} />
        }}
      />
    )
  } else {
    subtitle = (
      <T
        id={'buy_page.subtitle'}
        values={{
          name,
          amount: <Price network={item.network} price={item.price} />
        }}
      />
    )
  }

  return (
    <AssetAction asset={item}>
      <Header size="large">
        {t('buy_page.title', { category: t(`global.${item.category}`) })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      <div className="buttons">
        <Button
          as={Link}
          to={locations.item(item.contractAddress, item.itemId)}
        >
          {t('global.cancel')}
        </Button>

        <Button
          primary
          disabled={isDisabled || isLoading}
          onClick={handleSubmit}
          loading={isLoading}
        >
          {t('buy_page.buy')}
        </Button>
      </div>
      <AuthorizationModal
        isLoading={isLoading}
        open={showAuthorizationModal}
        authorization={authorization}
        onProceed={handleExecuteOrder}
        onCancel={handleClose}
      />
    </AssetAction>
  )
}

export default React.memo(BuyItemModal)
