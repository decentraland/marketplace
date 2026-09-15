import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Loader } from 'decentraland-ui'
import { EstateSnapshotStatus } from '../../modules/nft/hooks'
import ErrorBanner from '../ErrorBanner'
import { Props } from './EstateCompositionWarning.types'
import styles from './EstateCompositionWarning.module.css'

// Says why an Estate flow is not letting the user continue: the registry is
// still being read, could not be read, or holds a different set of LANDs than
// the page is showing. Only the failed read is worth offering a retry for —
// a composition that disagrees with the page needs the page reloaded, which
// re-reads it anyway.
const EstateCompositionWarning = ({ state, className }: Props) => {
  if (state.status === EstateSnapshotStatus.LOADING) {
    return (
      <div className={classNames(styles.loading, className)}>
        <Loader active inline size="tiny" />
        <span>{t('estate_composition.loading')}</span>
      </div>
    )
  }

  if (state.status === EstateSnapshotStatus.UNAVAILABLE) {
    return (
      <div className={classNames(styles.unavailable, className)}>
        <ErrorBanner info={t('estate_composition.unavailable')} />
        <Button basic onClick={state.retry}>
          {t('estate_composition.retry')}
        </Button>
      </div>
    )
  }

  if (state.status === EstateSnapshotStatus.OUT_OF_SYNC) {
    return <ErrorBanner info={t('estate_composition.out_of_sync', { count: state.snapshot?.parcels.length ?? 0 })} className={className} />
  }

  return null
}

export default React.memo(EstateCompositionWarning)
