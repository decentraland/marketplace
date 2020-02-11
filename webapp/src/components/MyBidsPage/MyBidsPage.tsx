import React, { useEffect, useState, useCallback } from 'react'
import { Page, Loader, HeaderMenu, Header, Button } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { Bid } from '../Bid'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './MyBidsPage.types'
import './MyBidsPage.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

const MyBidsPage = (props: Props) => {
  const {
    wallet,
    isConnecting,
    isLoading,
    onNavigate,
    onFetchBids,
    bidder,
    seller,
    archivedBidIds
  } = props

  const [showArchivedSeller, setShowArchivedSeller] = useState(false)

  const handleToggleSeller = useCallback(
    () => setShowArchivedSeller(!showArchivedSeller),
    [showArchivedSeller, showArchivedSeller]
  )

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!isConnecting && !wallet) {
      onNavigate(locations.signIn())
    }
  }, [isConnecting, wallet, onNavigate])

  useEffect(() => {
    if (wallet) {
      onFetchBids(wallet.address)
    }
  }, [wallet, onFetchBids])

  const archived = seller.filter(bid => archivedBidIds.includes(bid.id))
  const unarchived = seller.filter(bid => !archivedBidIds.includes(bid.id))
  const filteredSeller = showArchivedSeller
    ? [...unarchived, ...archived]
    : unarchived

  return (
    <div className="MyBidsPage">
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_BIDS} />
      <Page>
        {isConnecting || !wallet ? (
          <Loader size="massive" active />
        ) : (
          <>
            <HeaderMenu>
              <HeaderMenu.Left>
                <Header sub>{t('my_bids_page.bids_received')}</Header>
              </HeaderMenu.Left>
              <HeaderMenu.Right>
                <Button basic onClick={handleToggleSeller}>
                  {showArchivedSeller
                    ? t('my_bids_page.hide_archives', {
                        amount: archived.length
                      })
                    : t('my_bids_page.show_archives', {
                        amount: archived.length
                      })}
                </Button>
              </HeaderMenu.Right>
            </HeaderMenu>
            {filteredSeller.length === 0 && isLoading ? (
              <div className="center">
                <Loader active />
              </div>
            ) : null}
            {filteredSeller.length === 0 && !isLoading ? (
              <div className="center">
                <div className="empty">{t('my_bids_page.empty')}</div>
              </div>
            ) : null}
            {filteredSeller.length > 0
              ? filteredSeller.map(bid => <Bid bid={bid} />)
              : null}
            <HeaderMenu>
              <HeaderMenu.Left>
                <Header sub>{t('my_bids_page.bids_placed')}</Header>
              </HeaderMenu.Left>
            </HeaderMenu>
            {bidder.length === 0 && isLoading ? (
              <div className="center">
                <Loader active />
              </div>
            ) : null}
            {bidder.length === 0 && !isLoading ? (
              <div className="center">
                <div className="empty">{t('my_bids_page.empty')}</div>
              </div>
            ) : null}
            {bidder.length > 0 ? bidder.map(bid => <Bid bid={bid} />) : null}
          </>
        )}
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(MyBidsPage)
