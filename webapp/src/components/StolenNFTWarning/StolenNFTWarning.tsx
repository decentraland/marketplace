import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { isStolenNFT } from '../../lib/stolenNfts'
import { Asset } from '../../modules/asset/types'
import styles from './StolenNFTWarning.module.css'

type Props = {
  asset: Asset | null | undefined
  className?: string
}

const StolenNFTWarning = ({ asset, className }: Props) => {
  if (!isStolenNFT(asset)) return null

  return (
    <div className={classNames(styles.warning, className)} role="alert" data-testid="stolen-nft-warning">
      <Icon name="exclamation triangle" className={styles.icon} />
      <span className={styles.message}>{t('stolen_nft_warning.label')}</span>
    </div>
  )
}

export default React.memo(StolenNFTWarning)
