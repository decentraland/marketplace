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
import { NFTCategory } from '@dcl/schemas'
import { ContractName } from 'decentraland-transactions'
import { locations } from '../../../modules/routing/locations'
import { useFingerprint } from '../../../modules/nft/hooks'
import { getContractNames } from '../../../modules/vendor'
import { getContract } from '../../../modules/contract/utils'
import { AssetAction } from '../../AssetAction'
import { AuthorizationModal } from '../../AuthorizationModal'
import { PriceTooLow } from '../PriceTooLow'
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
    isOwner,
    hasInsufficientMANA,
    hasLowPrice,
    onExecuteOrder
  } = props

  const [fingerprint, isFingerprintLoading] = useFingerprint(nft)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handleExecuteOrder = useCallback(() => {
    onExecuteOrder(order!, nft, fingerprint)
  }, [order, nft, fingerprint, onExecuteOrder])

  const authorization: Authorization = useMemo(() => {
    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: nft.network
    })

    // If the vendor is a partner we might need to use a different contract for authorizedAddress. See PR #680
    return {
      address: wallet.address,
      authorizedAddress: order!.marketplaceAddress,
      contractAddress: mana.address,
      contractName: ContractName.MANAToken,
      chainId: nft.chainId,
      type: AuthorizationType.ALLOWANCE
    }
  }, [wallet, nft, order])

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
      {hasLowPrice ? (
        <PriceTooLow chainId={nft.chainId} network={nft.network} />
      ) : null}
      <div className="buttons">
        <Button as={Link} to={locations.nft(nft.contractAddress, nft.tokenId)}>
          {t('global.cancel')}
        </Button>
        {!hasLowPrice ? (
          <ChainButton
            primary
            disabled={isDisabled || isLoading}
            onClick={handleSubmit}
            loading={isLoading}
            chainId={nft.chainId}
          >
            {t('buy_page.buy')}
          </ChainButton>
        ) : null}
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
