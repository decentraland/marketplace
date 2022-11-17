import React, { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { locations } from '../../../modules/routing/locations'
import { AuthorizationModal } from '../../AuthorizationModal'
import { getContractNames } from '../../../modules/vendor'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { AssetAction } from '../../AssetAction'
import { Name } from '../Name'
import { Price } from '../Price'
import { PriceTooLow } from '../PriceTooLow'
import { Props } from './MintItemModal.types'

const MintItemModal = (props: Props) => {
  const {
    item,
    wallet,
    authorizations,
    isLoading,
    isOwner,
    hasInsufficientMANA,
    hasLowPrice,
    getContract,
    onBuyItem
  } = props

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handleExecuteOrder = useCallback(() => onBuyItem(item), [
    onBuyItem,
    item
  ])

  const authorization: Authorization | null = useMemo(() => {
    const contractNames = getContractNames()
    const mana = getContract({
      name: contractNames.MANA,
      network: item.network
    })

    const collectionStore = getContract({
      name: contractNames.COLLECTION_STORE,
      network: item.network
    })

    return mana && collectionStore
      ? {
          address: wallet.address,
          authorizedAddress: collectionStore.address,
          contractAddress: mana.address,
          contractName: ContractName.MANAToken,
          chainId: item.chainId,
          type: AuthorizationType.ALLOWANCE
        }
      : null
  }, [getContract, item.network, item.chainId, wallet.address])

  const handleSubmit = useCallback(() => {
    if (authorization && hasAuthorization(authorizations, authorization)) {
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
    subtitle = (
      <T
        id={'mint_page.not_for_sale'}
        values={{
          name,
          secondary_market_link: (
            <Link
              to={locations.browse({
                section: Section.WEARABLES,
                assetType: AssetType.NFT,
                search: item.name
              })}
            >
              {t('mint_page.secondary_market')}
            </Link>
          )
        }}
      />
    )
  } else if (isOwner) {
    subtitle = <T id={'mint_page.is_owner'} values={{ name }} />
  } else if (hasInsufficientMANA) {
    subtitle = (
      <T
        id={'mint_page.not_enough_mana'}
        values={{
          name,
          amount: <Price network={item.network} price={item.price} />
        }}
      />
    )
  } else {
    subtitle = (
      <T
        id={'mint_page.subtitle'}
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
        {t('mint_page.title', { category: t(`global.${item.category}`) })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      {hasLowPrice ? (
        <PriceTooLow chainId={item.chainId} network={item.network} />
      ) : null}
      <div className="buttons">
        <Button
          as={Link}
          to={locations.item(item.contractAddress, item.itemId)}
        >
          {t('global.cancel')}
        </Button>
        {!hasLowPrice ? (
          <ChainButton
            primary
            disabled={isDisabled || isLoading}
            onClick={handleSubmit}
            loading={isLoading}
            chainId={item.chainId}
          >
            {t('mint_page.action')}
          </ChainButton>
        ) : null}
      </div>
      {authorization ? (
        <AuthorizationModal
          isLoading={isLoading}
          open={showAuthorizationModal}
          authorization={authorization}
          onProceed={handleExecuteOrder}
          onCancel={handleClose}
        />
      ) : null}
    </AssetAction>
  )
}

export default React.memo(MintItemModal)
