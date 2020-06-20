import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, Header, Button, Modal } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../modules/routing/locations'
import { Navigation } from '../Navigation'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Transaction } from './Transaction'
import { Props } from './ActivityPage.types'
import './ActivityPage.css'
import { NavigationTab } from '../Navigation/Navigation.types'

const ActivityPage = (props: Props) => {
  const { address, transactions, onClearHistory } = props

  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleClear = useCallback(() => {
    if (address) {
      onClearHistory(address)
    }
    setShowConfirmation(false)
  }, [address, onClearHistory])

  const handleConfirm = useCallback(() => setShowConfirmation(true), [
    setShowConfirmation
  ])
  const handleCancel = useCallback(() => setShowConfirmation(false), [
    setShowConfirmation
  ])

  let content = null

  if (!address) {
    content = (
      <div className="center">
        <p>
          {
            <T
              id="wallet.sign_in_required"
              values={{
                sign_in: (
                  <Link to={locations.signIn()}>{t('wallet.sign_in')}</Link>
                )
              }}
            />
          }
        </p>
      </div>
    )
  } else if (transactions.length === 0) {
    content = (
      <div className="center">
        <p>{t('activity_page.empty')}</p>
      </div>
    )
  } else {
    content = (
      <>
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
          {transactions
            .map(tx => <Transaction tx={tx} key={tx.hash} />)
            .reverse()}
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.ACTIVITY} />
      <Page className="ActivityPage">{content}</Page>
      <Modal size="tiny" open={showConfirmation}>
        <Modal.Header>
          {t('activity_page.clear_history_modal.title')}
        </Modal.Header>
        <Modal.Content>
          {t('activity_page.clear_history_modal.text')}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCancel}>{t('global.cancel')}</Button>
          <Button primary onClick={handleClear}>
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Modal>
      <Footer />
    </>
  )
}

export default React.memo(ActivityPage)
