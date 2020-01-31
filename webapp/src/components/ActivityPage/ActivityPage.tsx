import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, Header, Button, Modal } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Navigation } from '../Navigation'
import { locations } from '../../modules/routing/locations'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Transaction } from './Transaction'
import { Props } from './ActivityPage.types'
import './ActivityPage.css'

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
        <div className="history-header">
          <div className="left">
            <Header sub>Latest Activity</Header>
          </div>
          <div className="right">
            <Button basic onClick={handleConfirm}>
              Clear History
            </Button>
          </div>
        </div>
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
      <Navigation />
      <Page className="ActivityPage">{content}</Page>
      <Modal size="tiny" open={showConfirmation}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Content>
          You are about to clear your transaction history. Do you want to
          proceed?
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleClear}>
            Proceed
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Modal.Actions>
      </Modal>
      <Footer />
    </>
  )
}

export default React.memo(ActivityPage)
