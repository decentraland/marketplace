import React, { useCallback, useEffect, useRef, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Header, Loader, Message, Modal, Page } from 'decentraland-ui'
import { Column } from '../Layout/Column'
import { Row } from '../Layout/Row'
import { NavigationTab } from '../Navigation/Navigation.types'
import { PageLayout } from '../PageLayout'
import { ActivityEventItem } from './ActivityEventItem'
import { Transaction } from './Transaction'
import { Props } from './ActivityPage.types'
import './ActivityPage.css'

const PAGE_SIZE = 20

const ActivityPage = (props: Props) => {
  const { address, mergedActivity, loading, error, hasMore, loaded, onClearHistory, onLoadActivity } = props

  const [showConfirmation, setShowConfirmation] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasLoadedFirstPage = useRef(false)

  // First-page load: fires once per mount (or when the wallet address changes).
  useEffect(() => {
    if (!address) return
    hasLoadedFirstPage.current = false
    onLoadActivity(PAGE_SIZE, 0)
    hasLoadedFirstPage.current = true
  }, [address, onLoadActivity])

  // Infinite scroll: IntersectionObserver fires whenever the sentinel becomes visible.
  // That's viewport-aware — on a tall screen where all current items fit, the sentinel
  // is visible immediately and we auto-page until either the viewport fills or there's
  // nothing more to load.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    if (!address) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (loading) return
        if (!hasMore) return
        if (!hasLoadedFirstPage.current) return
        onLoadActivity(PAGE_SIZE, loaded)
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [address, loading, hasMore, loaded, onLoadActivity])

  const handleClear = useCallback(() => {
    if (address) {
      onClearHistory(address)
    }
    setShowConfirmation(false)
  }, [address, onClearHistory])

  const handleConfirm = useCallback(() => setShowConfirmation(true), [setShowConfirmation])
  const handleCancel = useCallback(() => setShowConfirmation(false), [setShowConfirmation])

  let content: React.ReactNode

  const errorBanner = error ? <Message warning size="tiny" content={t('activity_page.error')} /> : null

  const isInitialLoading = loading && mergedActivity.length === 0

  if (isInitialLoading) {
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
        <div ref={sentinelRef} className="activity-sentinel" aria-hidden="true">
          {hasMore && loading ? <Loader active inline="centered" size="small" /> : null}
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
