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

  const [showArchived, setShowArchivedSeller] = useState(false)

  const handleToggleSeller = useCallback(
    () => setShowArchivedSeller(!showArchived),
    [showArchived, setShowArchivedSeller]
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
  const filteredSeller = showArchived ? archived : unarchived

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
                <Header sub>
                  {t(
                    showArchived
                      ? 'my_bids_page.bids_archived'
                      : 'my_bids_page.bids_received'
                  )}
                </Header>
              </HeaderMenu.Left>
              <HeaderMenu.Right>
                {showArchived || archived.length > 0 ? (
                  <Button basic onClick={handleToggleSeller}>
                    {showArchived
                      ? t('my_bids_page.show_received', {
                          amount: unarchived.length
                        })
                      : t('my_bids_page.show_archived', {
                          amount: archived.length
                        })}
                  </Button>
                ) : null}
              </HeaderMenu.Right>
            </HeaderMenu>
            <div className="bids">
              {filteredSeller.length === 0 && isLoading ? (
                <div className="center">
                  <Loader active />
                </div>
              ) : null}
              {filteredSeller.length === 0 && !isLoading ? (
                <div className="center">
                  <div className="empty">
                    {t(
                      showArchived
                        ? 'my_bids_page.empty_archived'
                        : 'my_bids_page.empty_received'
                    )}
                  </div>
                </div>
              ) : null}
              {filteredSeller.length > 0
                ? filteredSeller.map(bid => <Bid key={bid.id} bid={bid} />)
                : null}
            </div>
            <HeaderMenu>
              <HeaderMenu.Left>
                <Header sub>{t('my_bids_page.bids_placed')}</Header>
              </HeaderMenu.Left>
            </HeaderMenu>
            <div className="bids">
              {bidder.length === 0 && isLoading ? (
                <div className="center">
                  <Loader active />
                </div>
              ) : null}
              {bidder.length === 0 && !isLoading ? (
                <div className="center">
                  <div className="empty">{t('my_bids_page.empty_placed')}</div>
                </div>
              ) : null}
              {bidder.length > 0
                ? bidder.map(bid => <Bid key={bid.id} bid={bid} />)
                : null}
            </div>
          </>
        )}
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(MyBidsPage)
