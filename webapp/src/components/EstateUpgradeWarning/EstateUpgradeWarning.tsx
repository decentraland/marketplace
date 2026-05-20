import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { isEstateListingAffectedByUpgrade } from '../../lib/estateUpgrade'
import { NFT } from '../../modules/nft/types'
import styles from './EstateUpgradeWarning.module.css'

type Variant = 'inline' | 'banner'

type Props = {
  nft: NFT | null | undefined
  variant?: Variant
  className?: string
  // When true, callers are showing this on the lister's own listing — the wording
  // uses "you" instead of "the seller".
  isOwnListing?: boolean
}

const EstateUpgradeWarning = ({ nft, variant = 'banner', className, isOwnListing = false }: Props) => {
  if (!isEstateListingAffectedByUpgrade(nft)) return null

  const messageKey = isOwnListing ? 'estate_upgrade_warning.owner' : 'estate_upgrade_warning.visitor'

  return (
    <div className={classNames(styles.warning, styles[variant], className)} role="alert">
      <Icon name="exclamation triangle" className={styles.icon} />
      <span className={styles.message}>{t(messageKey)}</span>
    </div>
  )
}

export default React.memo(EstateUpgradeWarning)
