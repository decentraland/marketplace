import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { Button, Icon, ModalNavigation } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { AssetType } from '../../../modules/asset/types'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/decentraland/routing'
import { config } from '../../../config'
import copyText from '../../../lib/copyText'
import { useTimer } from '../../../lib/timer'
import { ListCard } from '../../ListsPage/ListCard'
import { Props } from './ShareListModal.types'
import styles from './ShareListModal.module.css'

const twitterLink = 'https://twitter.com/intent/tweet?text='

const ShareListModal = (props: Props) => {
  const MARKETPLACE_URL = config.get('MARKETPLACE_URL', '')

  const {
    metadata: { list },
    onClose
  } = props
  const [hasCopiedAddress, setHasCopied] = useTimer(1200)

  const listLink = locations.list(list.id, {
    assetType: AssetType.ITEM,
    page: 1,
    section: Section.LISTS,
    view: View.LISTS
  })

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <Modal size="tiny" className={styles.modal} onClose={handleClose}>
      <ModalNavigation
        title={t('share_list_modal.title')}
        onClose={handleClose}
      />
      <Modal.Content className={styles.content}>
        <ListCard list={list} />
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button
          primary
          fluid
          onClick={() =>
            copyText(`${MARKETPLACE_URL}${listLink}`, setHasCopied)
          }
        >
          {hasCopiedAddress
            ? t('share_list_modal.copied')
            : t('share_list_modal.copy_link')}
        </Button>
        <Button
          as="a"
          fluid
          inverted
          href={`${twitterLink}${encodeURIComponent(
            t('share_list_modal.twitter_message')
          )} ${MARKETPLACE_URL}${listLink}`}
        >
          <Icon name="twitter" />
          {t('share_list_modal.share_on_twitter')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ShareListModal)
