import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Bid, BidSortBy } from '@dcl/schemas'
import { Mana, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { bidAPI } from '../../../modules/vendor/decentraland'
import { formatWeiMANA } from '../../../lib/mana'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import TableContainer from '../../Table/TableContainer'
import { AssetType } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import { AssetProvider } from '../../AssetProvider'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { formatDataToTable } from './utils'
import { Props } from './BidsTable.types'

export const ROWS_PER_PAGE = 5
const INITIAL_PAGE = 1

const BidsTable = (props: Props) => {
  const { nft, address, isAcceptingBid, onAccept } = props
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const tabList = [
    {
      value: 'offers_table',
      displayValue: t('offers_table.offers')
    }
  ]

  const sortByList = [
    {
      text: t('offers_table.most_expensive'),
      value: BidSortBy.MOST_EXPENSIVE
    },
    {
      text: t('offers_table.recenty_offered'),
      value: BidSortBy.RECENTLY_OFFERED
    },
    {
      text: t('offers_table.recently_updated'),
      value: BidSortBy.RECENTLY_UPDATED
    }
  ]

  const [bids, setBids] = useState<DataTableType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<BidSortBy>(BidSortBy.MOST_EXPENSIVE)
  const [showConfirmationModal, setShowConfirmationModal] = useState<{
    display: boolean
    bid: Bid | null
  }>({
    display: false,
    bid: null
  })

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    let cancel = false
    if (nft) {
      setIsLoading(true)
      bidAPI
        .fetchByNFT(nft.contractAddress, nft.tokenId, null, sortBy, ROWS_PER_PAGE.toString(), ((page - 1) * ROWS_PER_PAGE).toString())
        .then(response => {
          if (cancel) return
          setTotal(response.total)
          setBids(
            formatDataToTable(
              response.data.filter(bid => bid.bidder !== address),
              bid => setShowConfirmationModal({ display: true, bid }),
              address,
              isMobileOrTablet
            )
          )
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => !cancel && setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
      return () => {
        cancel = true
      }
    }
  }, [nft, setIsLoading, setBids, page, sortBy, address, isMobileOrTablet])

  return bids.length > 0 ? (
    <>
      <TableContainer
        children={
          <TableContent
            data={bids}
            activePage={page}
            isLoading={isLoading}
            setPage={setPage}
            totalPages={totalPages}
            empty={() => null}
            total={total}
            hasHeaders
          />
        }
        tabsList={tabList}
        sortbyList={sortByList}
        handleSortByChange={(value: string) => setSortBy(value as BidSortBy)}
        sortBy={sortBy}
      />
      {showConfirmationModal.bid && showConfirmationModal.display ? (
        <AssetProvider
          type={AssetType.NFT}
          contractAddress={showConfirmationModal.bid.contractAddress}
          tokenId={showConfirmationModal.bid.tokenId}
        >
          {nft =>
            nft &&
            showConfirmationModal.bid && (
              <ConfirmInputValueModal
                open={showConfirmationModal.display}
                headerTitle={t('bid_page.confirm.title')}
                content={
                  <>
                    <T
                      id="bid_page.confirm.accept_bid_line_one"
                      values={{
                        name: <b>{getAssetName(nft)}</b>,
                        amount: (
                          <Mana showTooltip network={nft.network} inline>
                            {formatWeiMANA(showConfirmationModal.bid.price)}
                          </Mana>
                        )
                      }}
                    />
                    <br />
                    <T id="bid_page.confirm.accept_bid_line_two" />
                  </>
                }
                onConfirm={() => {
                  showConfirmationModal.bid && onAccept(showConfirmationModal.bid)
                }}
                valueToConfirm={ethers.utils.formatEther(showConfirmationModal.bid.price)}
                network={nft.network}
                onCancel={() => setShowConfirmationModal({ display: false, bid: null })}
                loading={isAcceptingBid}
                disabled={isAcceptingBid}
              />
            )
          }
        </AssetProvider>
      ) : null}
    </>
  ) : null
}

export default React.memo(BidsTable)
