import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import { Bid } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { T, t } from 'decentraland-dapps/dist/modules/translation'
import { Button, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import emptyBids from '../../../../images/empty-bids.png'
import { formatWeiMANA } from '../../../../lib/mana'
import { AssetType } from '../../../../modules/asset/types'
import { getAssetName, isNFT } from '../../../../modules/asset/utils'
import { getAcceptBidStatus, getError } from '../../../../modules/bid/selectors'
import { getAcceptBidAuthorizationOptions } from '../../../../modules/bid/utils'
import { useERC721ContractName } from '../../../../modules/contract/hooks'
import { locations } from '../../../../modules/routing/locations'
import { bidAPI } from '../../../../modules/vendor/decentraland'
import { marketplaceAPI } from '../../../../modules/vendor/decentraland/marketplace/api'
import { AssetProvider } from '../../../AssetProvider'
import { ConfirmInputValueModal } from '../../../ConfirmInputValueModal'
import { Mana } from '../../../Mana'
import { TableContent } from '../../../Table/TableContent'
import { DataTableType } from '../../../Table/TableContent/TableContent.types'
import { formatDataToTable } from '../utils'
import { Props } from './BidsTableContent.types'
import styles from './BidsTableContent.module.css'

export const ROWS_PER_PAGE = 5
const INITIAL_PAGE = 1

function BidsTableContent({ asset, isBidsOffchainEnabled, address, sortBy, isAcceptingBid, onAccept, onAuthorizedAction }: Props) {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const history = useHistory()
  const [bids, setBids] = useState<DataTableType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const assetOwner = isNFT(asset) ? asset.owner : asset.creator
  const targetContractLabel = useERC721ContractName(asset.contractAddress, asset.chainId)

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
    if (asset) {
      setIsLoading(true)
      if (isBidsOffchainEnabled) {
        marketplaceAPI
          .fetchBids({
            contractAddress: asset.contractAddress,
            ...(isNFT(asset) ? { tokenId: asset.tokenId } : { itemId: asset.itemId }),
            sortBy,
            limit: ROWS_PER_PAGE,
            offset: (page - 1) * ROWS_PER_PAGE
          })
          .then(({ results, total }) => {
            if (cancel) return
            setTotal(total)
            setBids(formatDataToTable(results, bid => setShowConfirmationModal({ display: true, bid }), address, isMobileOrTablet))
            setTotalPages(Math.ceil(total / ROWS_PER_PAGE))
          })
          .finally(() => !cancel && setIsLoading(false))
          .catch(error => {
            console.error(error)
          })
      } else {
        if (isNFT(asset)) {
          bidAPI
            .fetchByNFT(
              asset.contractAddress,
              asset.tokenId,
              null,
              sortBy,
              ROWS_PER_PAGE.toString(),
              ((page - 1) * ROWS_PER_PAGE).toString()
            )
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
        }
      }
      return () => {
        cancel = true
      }
    }
  }, [asset, setIsLoading, setBids, page, sortBy, address, isMobileOrTablet])

  const handleConfirm = (bid: Bid) => {
    const options = getAcceptBidAuthorizationOptions(bid, () => onAccept(bid), targetContractLabel)
    if (isBidsOffchainEnabled && options) {
      onAuthorizedAction(options)
      return
    }
    onAccept(bid)
  }

  return (
    <>
      <TableContent
        data={bids}
        activePage={page}
        isLoading={isLoading}
        setPage={setPage}
        totalPages={totalPages}
        total={total}
        hasHeaders
        empty={() => (
          <div className={styles.emptyTable}>
            <img src={emptyBids} alt="empty" className={styles.emptyIcon} />
            <span className={styles.emptyDescription}>
              {t('bids_table.no_bids')}
              {assetOwner !== address && (
                <Button
                  basic
                  onClick={() =>
                    history.push(
                      isNFT(asset)
                        ? locations.bid(asset.contractAddress, asset.tokenId)
                        : locations.bid(asset.contractAddress, asset.itemId)
                    )
                  }
                >
                  {t('bids_table.make_offer')}
                </Button>
              )}
            </span>
          </div>
        )}
      />
      {showConfirmationModal.bid && showConfirmationModal.display && asset ? (
        <AssetProvider
          type={isNFT(asset) ? AssetType.NFT : AssetType.ITEM}
          contractAddress={showConfirmationModal.bid.contractAddress}
          tokenId={'tokenId' in showConfirmationModal.bid ? showConfirmationModal.bid.tokenId : showConfirmationModal.bid.itemId}
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
                  showConfirmationModal.bid && handleConfirm(showConfirmationModal.bid)
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
  )
}

export default withAuthorizedAction(
  BidsTableContent,
  AuthorizedAction.BID,
  {
    confirm_transaction: {
      title: 'accept_bid.authorization.confirm_transaction.title'
    },
    title: 'accept_bid.authorization.title'
  },
  getAcceptBidStatus,
  getError
)
