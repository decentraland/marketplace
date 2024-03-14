import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Button, Icon, ModalNavigation } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { AssetType } from '../../../modules/asset/types'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/decentraland/routing'
import { config } from '../../../config'
import copyText from '../../../lib/copyText'
import { useTimer } from '../../../lib/timer'
import * as events from '../../../utils/events'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { ListCard } from '../../ListsPage/ListCard'
import { Props } from './ShareListModal.types'
import styles from './ShareListModal.module.css'

const twitterLink = 'https://twitter.com/intent/tweet?text='
const MARKETPLACE_URL = config.get('MARKETPLACE_URL', '')

const ShareListModal = (props: Props) => {
  const {
    metadata: { list },
    onClose
  } = props
  const [hasCopiedAddress, setHasCopied] = useTimer(1200)

  const listLink = locations.list(list.id, {
    assetType: AssetType.ITEM,
    page: 1,
    section: Section.LISTS,
    view: View.LISTS,
    vendor: VendorName.DECENTRALAND,
    sortBy: SortBy.NEWEST
  })

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleCopyLink = useCallback(async () => {
    const url = `${MARKETPLACE_URL}${listLink}`
    getAnalytics().track(events.SHARE_LIST, {
      list,
      url,
      type: events.SHARE_LIST_TYPE.COPY_LINK
    })
    await copyText(url, setHasCopied)
  }, [list, listLink, setHasCopied])

  const handleShareOnTwitter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const url = `${twitterLink}${encodeURIComponent(`${t('share_list_modal.twitter_message')}${MARKETPLACE_URL}${listLink}`)}`
      getAnalytics().track(events.SHARE_LIST, {
        list,
        url,
        type: events.SHARE_LIST_TYPE.TWITTER
      })
      // Based on SegmentAnalytics track callback implementation
      const timeout = setTimeout(() => {
        window.open(url, '_blank')
      }, 300)

      e.currentTarget.blur()

      return () => clearTimeout(timeout)
    },
    [list, listLink]
  )

  return (
    <Modal size="tiny" className={styles.modal} onClose={handleClose}>
      <ModalNavigation title={t('share_list_modal.title')} onClose={handleClose} />
      <Modal.Content className={styles.content}>
        <ListCard list={list} viewOnly />
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button primary fluid onClick={handleCopyLink}>
          {hasCopiedAddress ? t('share_list_modal.copied') : t('share_list_modal.copy_link')}
        </Button>
        <Button fluid inverted onClick={handleShareOnTwitter}>
          <Icon name="twitter" />
          {t('share_list_modal.share_on_twitter')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ShareListModal)
