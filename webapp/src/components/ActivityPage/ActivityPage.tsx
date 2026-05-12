import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Header, Loader, Message, Modal, Page } from 'decentraland-ui'
import { ActivityEventItem } from './ActivityEventItem'
import { Transaction } from './Transaction'
import { Column } from '../Layout/Column'
import { Row } from '../Layout/Row'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { Props } from './ActivityPage.types'
import './ActivityPage.css'

const ActivityPage = (props: Props) => {
  const { address, mergedActivity, loading, error, onClearHistory, onLoadActivity } = props

  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (address) {
      onLoadActivity()
    }
  }, [address, onLoadActivity])

  const handleClear = useCallback(() => {
    if (address) {
      onClearHistory(address)
    }
    setShowConfirmation(false)
  }, [address, onClearHistory])

  const handleConfirm = useCallback(() => setShowConfirmation(true), [setShowConfirmation])
  const handleCancel = useCallback(() => setShowConfirmation(false), [setShowConfirmation])

  let content: React.ReactNode

  const errorBanner = error ? (
    <Message warning size="tiny" content={t('activity_page.error')} />
  ) : null

  if (loading && mergedActivity.length === 0) {
    content = (
      <div className="center">
        <Loader active size="large">
          {t('activity_page.loading')}
        </Loader>
      </div>
    )
  } else if (mergedActivity.length === 0) {
    content = (
      <>
        {errorBanner}
        <div className="center">
          <p>{t('activity_page.empty')}</p>
        </div>
      </>
    )
  } else {
    content = (
      <>
        {errorBanner}
        <Row>
          <Column align="left" grow={true}>
            <Header sub>{t('activity_page.latest_activity')}</Header>
          </Column>
          <Column align="right">
            <Button basic onClick={handleConfirm}>
              {t('activity_page.clear_history')}
            </Button>
          </Column>
        </Row>
        <div className="transactions">
          {mergedActivity.map(item =>
            item.kind === 'local' ? (
              <Transaction tx={item.tx} key={`local:${item.tx.hash}`} />
            ) : (
              <ActivityEventItem event={item.event} key={`server:${item.event.id}`} />
            )
          )}
        </div>
      </>
    )
  }

  return (
    <PageLayout activeTab={NavigationTab.ACTIVITY}>
      <Page className="ActivityPage">{content}</Page>
      <Modal size="tiny" open={showConfirmation}>
        <Modal.Header>{t('activity_page.clear_history_modal.title')}</Modal.Header>
        <Modal.Content>{t('activity_page.clear_history_modal.text')}</Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCancel}>{t('global.cancel')}</Button>
          <Button primary onClick={handleClear}>
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Modal>
    </PageLayout>
  )
}

export default React.memo(ActivityPage)
