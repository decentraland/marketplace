import React, { useState, useCallback, useMemo } from 'react'
import { Header, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { Network, NFTCategory } from '@dcl/schemas'
import { ContractName } from 'decentraland-transactions'
import { locations } from '../../../modules/routing/locations'
import { isPartner } from '../../../modules/vendor/utils'
import { useFingerprint, useComputedPrice } from '../../../modules/nft/hooks'
import { getContractNames } from '../../../modules/vendor'
import { getContract } from '../../../modules/contract/utils'
import { AssetAction } from '../../AssetAction'
import { AuthorizationModal } from '../../AuthorizationModal'
import { Name } from '../Name'
import { Price } from '../Price'
import { Props } from './BuyNFTModal.types'

const BuyNFTModal = (props: Props) => {
  const {
    nft,
    order,
    wallet,
    authorizations,
    isLoading,
    onExecuteOrder,
    isOwner,
    hasInsufficientMANA
  } = props

  const [fingerprint, isFingerprintLoading] = useFingerprint(nft)
  const [
    computedPrice,
    percentageIncrease,
    isAboveMaxPercentage
  ] = useComputedPrice(nft, order)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
  const [wantsToProceed, setWantsToProceed] = useState(false)

  const handleExecuteOrder = useCallback(() => {
    onExecuteOrder(order!, nft, fingerprint)
  }, [order, nft, fingerprint, onExecuteOrder])

  const authorization: Authorization = useMemo(() => {
    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: nft.network
    })

    return {
      address: wallet.address,
      authorizedAddress: isPartner(nft.vendor)
        ? getContract({
            name: contractNames.MARKETPLACE_ADAPTER,
            network: Network.ETHEREUM
          }).address
        : order!.marketplaceAddress,
      contractAddress: mana.address,
      contractName: ContractName.MANAToken,
      chainId: nft.chainId,
      type: AuthorizationType.ALLOWANCE
    }
  }, [wallet, nft, order])

  const handleToggleWantsToProceed = useCallback(() => {
    setWantsToProceed(!wantsToProceed)
  }, [setWantsToProceed, wantsToProceed])

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

  const isDisabled =
    !order ||
    isOwner ||
    hasInsufficientMANA ||
    (!fingerprint && nft.category === NFTCategory.ESTATE)

  const name = <Name asset={nft} />

  let subtitle = null
  if (!order) {
    subtitle = <T id={'buy_page.not_for_sale'} values={{ name }} />
  } else if (
    !fingerprint &&
    nft.category === NFTCategory.ESTATE &&
    !isFingerprintLoading
  ) {
    subtitle = <T id={'buy_page.no_fingerprint'} />
  } else if (isOwner) {
    subtitle = <T id={'buy_page.is_owner'} values={{ name }} />
  } else if (hasInsufficientMANA) {
    subtitle = (
      <T
        id={'buy_page.not_enough_mana'}
        values={{
          name,
          amount: <Price network={nft.network} price={order.price} />
        }}
      />
    )
  } else if (isPartner(nft.vendor) && computedPrice) {
    subtitle = (
      <>
        <T
          id={'buy_page.subtitle'}
          values={{
            name,
            amount: <Price network={nft.network} price={order.price} />
          }}
        />
        {isAboveMaxPercentage ? (
          <div className="error">
            {t('buy_page.price_too_high', {
              category: t(`global.${nft.category}`),
              percentageIncrease
            })}
            <br />
            {t('buy_page.please_wait')}
          </div>
        ) : percentageIncrease > 0 ? (
          <div>
            <T
              id="buy_page.actual_price"
              values={{
                computedPrice: (
                  <Price network={nft.network} price={computedPrice} />
                )
              }}
            />
          </div>
        ) : null}
      </>
    )
  } else {
    subtitle = (
      <T
        id={'buy_page.subtitle'}
        values={{
          name,
          amount: <Price network={nft.network} price={order.price} />
        }}
      />
    )
  }

  return (
    <AssetAction asset={nft}>
      <Header size="large">
        {t('buy_page.title', { category: t(`global.${nft.category}`) })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      <div className="buttons">
        <Button as={Link} to={locations.nft(nft.contractAddress, nft.tokenId)}>
          {t('global.cancel')}
        </Button>

        {isDisabled ||
        !isAboveMaxPercentage ||
        (isAboveMaxPercentage && wantsToProceed) ? (
          <ChainButton
            primary
            disabled={isDisabled || isLoading}
            onClick={handleSubmit}
            loading={isLoading}
            chainId={nft.chainId}
          >
            {t('buy_page.buy')}
          </ChainButton>
        ) : (
          <Button
            primary
            onClick={handleToggleWantsToProceed}
            loading={isLoading}
          >
            {t('buy_page.proceed_anyways')}
          </Button>
        )}
      </div>
      <AuthorizationModal
        open={showAuthorizationModal}
        authorization={authorization}
        onProceed={handleExecuteOrder}
        onCancel={handleClose}
      />
    </AssetAction>
  )
}

export default React.memo(BuyNFTModal)
