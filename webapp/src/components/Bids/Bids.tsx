import React, { useEffect, useState, useCallback } from 'react'
import { Loader, HeaderMenu, Header, Button } from 'decentraland-ui'
import { useLocation } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../modules/routing/locations'
import { Bid } from '../Bid'
import { Props } from './Bids.types'
import './Bids.css'

const Bids = (props: Props) => {
  const {
    wallet,
    isConnecting,
    isLoading,
    bidderBids,
    sellerBids,
    archivedBidIds,
    onNavigate,
    onFetchBids
  } = props

  const [showArchived, setShowArchivedSeller] = useState(false)
  const { pathname, search } = useLocation()

  const handleToggleSeller = useCallback(
    () => setShowArchivedSeller(!showArchived),
    [showArchived, setShowArchivedSeller]
  )

  // Redirect to signIn if trying to access current account without a wallet
  useEffect(() => {
    if (!isConnecting && !wallet) {
      onNavigate(locations.signIn(`${pathname}${search}`))
    }
  }, [isConnecting, wallet, onNavigate, pathname, search])

  useEffect(() => {
    if (wallet) {
      onFetchBids(wallet.address)
    }
  }, [wallet, onFetchBids])

  const archived = sellerBids.filter(bid => archivedBidIds.includes(bid.id))
  const unarchived = sellerBids.filter(bid => !archivedBidIds.includes(bid.id))
  const filteredSeller = showArchived ? archived : unarchived

  return (
    <div className="Bids">
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
            {bidderBids.length === 0 && isLoading ? (
              <div className="center">
                <Loader active />
              </div>
            ) : null}
            {bidderBids.length === 0 && !isLoading ? (
              <div className="center">
                <div className="empty">{t('my_bids_page.empty_placed')}</div>
              </div>
            ) : null}
            {bidderBids.length > 0
              ? bidderBids.map(bid => <Bid key={bid.id} bid={bid} />)
              : null}
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(Bids)
