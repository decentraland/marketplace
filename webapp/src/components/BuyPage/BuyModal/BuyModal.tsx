import React, { useState, useCallback } from 'react'
import { Header, Mana, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTAction } from '../../NFTAction'
import { formatMANA } from '../../../lib/mana'
import { getNFTName } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { NFTCategory } from '../../../modules/nft/types'
import { Props } from './BuyModal.types'
import { contractAddresses } from '../../../modules/contract/utils'
import { AuthorizationType } from '../../AuthorizationModal/AuthorizationModal.types'
import { AuthorizationModal } from '../../AuthorizationModal'
import { hasAuthorization } from '../../../modules/authorization/utils'
import { useFingerprint } from '../../../modules/nft/hooks'

const BuyPage = (props: Props) => {
  const {
    nft,
    order,
    authorizations,
    onNavigate,
    onExecuteOrder,
    isOwner,
    notEnoughMana
  } = props

  const name = getNFTName(nft)

  const [fingerprint, isLoading] = useFingerprint(nft)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handleExecuteOrder = useCallback(
    () => onExecuteOrder(order!, nft, fingerprint),
    [order, nft, fingerprint, onExecuteOrder]
  )

  const handleSubmit = useCallback(() => {
    if (
      hasAuthorization(
        authorizations,
        contractAddresses.Marketplace,
        contractAddresses.MANAToken,
        AuthorizationType.ALLOWANCE
      )
    ) {
      handleExecuteOrder()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [authorizations, handleExecuteOrder, setShowAuthorizationModal])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  let subtitle = null
  if (!order) {
    subtitle = (
      <T id={'buy_page.not_for_sale'} values={{ name: <b>{name}</b> }} />
    )
  } else if (
    !fingerprint &&
    order.category === NFTCategory.ESTATE &&
    !isLoading
  ) {
    subtitle = <T id={'buy_page.no_fingerprint'} />
  } else if (isOwner) {
    subtitle = <T id={'buy_page.is_owner'} values={{ name: <b>{name}</b> }} />
  } else if (notEnoughMana) {
    subtitle = (
      <T id={'buy_page.not_enough_mana'} values={{ name: <b>{name}</b> }} />
    )
  } else {
    subtitle = (
      <T
        id={'buy_page.subtitle'}
        values={{
          name: <b className="primary-text">{name}</b>,
          amount: <Mana inline>{formatMANA(order.price)}</Mana>
        }}
      />
    )
  }

  const isDisabled =
    !order ||
    isOwner ||
    notEnoughMana ||
    (!fingerprint && order.category === NFTCategory.ESTATE)

  return (
    <NFTAction nft={nft}>
      <Header size="large">
        {t('buy_page.title', { category: t(`global.${nft.category}`) })}
      </Header>
      <div className={isDisabled ? 'subtitle error' : 'subtitle'}>
        {subtitle}
      </div>
      <div className="buttons">
        <Button
          onClick={() =>
            onNavigate(locations.ntf(nft.contractAddress, nft.tokenId))
          }
        >
          {t('global.cancel')}
        </Button>
        <Button primary disabled={isDisabled} onClick={handleSubmit}>
          {t('buy_page.buy')}
        </Button>
      </div>
      <AuthorizationModal
        open={showAuthorizationModal}
        contractAddress={contractAddresses.Marketplace}
        tokenAddress={contractAddresses.MANAToken}
        type={AuthorizationType.ALLOWANCE}
        onProceed={handleExecuteOrder}
        onCancel={handleClose}
      />
    </NFTAction>
  )
}

export default React.memo(BuyPage)
