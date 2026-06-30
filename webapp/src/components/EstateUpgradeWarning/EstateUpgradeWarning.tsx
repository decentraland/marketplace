import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { isEstateListingAffectedByUpgrade } from '../../lib/estateUpgrade'
import { NFT } from '../../modules/nft/types'
import styles from './EstateUpgradeWarning.module.css'

type Props = {
  nft: NFT | null | undefined
  className?: string
  // When true, callers are showing this on the lister's own listing — the wording
  // uses "you" instead of "the seller".
  isOwnListing?: boolean
  // Creation timestamp (seconds or ms) of the listing being shown (order / bid).
  // The warning only renders for a listing created before the v2-fingerprint
  // cutoff — i.e. one actually broken by the upgrade. Omit it when there is no
  // listing in context.
  listingCreatedAt?: number
}

const EstateUpgradeWarning = ({ nft, className, isOwnListing = false, listingCreatedAt }: Props) => {
  if (!isEstateListingAffectedByUpgrade(nft, listingCreatedAt)) return null

  const messageKey = isOwnListing ? 'estate_upgrade_warning.owner' : 'estate_upgrade_warning.visitor'

  return (
    <div className={classNames(styles.warning, className)} role="alert">
      <Icon name="exclamation triangle" className={styles.icon} />
      <span className={styles.message}>{t(messageKey)}</span>
    </div>
  )
}

export default React.memo(EstateUpgradeWarning)
