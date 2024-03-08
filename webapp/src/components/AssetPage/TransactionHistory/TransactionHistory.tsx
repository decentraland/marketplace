import React, { useState, useEffect } from 'react'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Item } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { saleAPI } from '../../../modules/vendor/decentraland'
import { isNFT } from '../../../modules/asset/utils'
import { NFT } from '../../../modules/nft/types'
import TableContainer from '../../Table/TableContainer'
import { TableContent } from '../../Table/TableContent'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import { formatDataToTable } from './utils'
import { Props } from './TransactionHistory.types'
import './TransactionHistory.css'

const ROWS_PER_PAGE = 5

const TransactionHistory = (props: Props) => {
  const { asset } = props
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const tabList = [
    {
      value: 'transaction_history',
      displayValue: t('transaction_history.title')
    }
  ]

  const [sales, setSales] = useState<DataTableType[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const isAssetNull = asset === null
  const isAssetNFT = asset && isNFT(asset)
  const assetContractAddress = asset?.contractAddress
  const assetTokenId = asset ? (asset as NFT).tokenId : '0'
  const assetItemId = asset ? (asset as Item).itemId : '0'

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    let cancel = false
    if (!isAssetNull) {
      setIsLoading(true)
      const params: Record<string, string | number> = {
        contractAddress: assetContractAddress!,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE
      }
      if (isAssetNFT) {
        params.tokenId = assetTokenId
      } else {
        params.itemId = assetItemId
      }
      saleAPI
        .fetch(params)
        .then(response => {
          if (cancel) return
          setTotal(response.total)
          setSales(formatDataToTable(response.data, isMobileOrTablet))
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => !cancel && setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
    return () => {
      cancel = true
    }
  }, [assetContractAddress, assetTokenId, assetItemId, setIsLoading, setSales, page, isAssetNull, isAssetNFT, isMobileOrTablet])

  return sales.length > 0 ? (
    <div className="TransactionHistory">
      <TableContainer
        tabsList={tabList}
        children={
          <TableContent
            hasHeaders
            data={sales}
            activePage={page}
            isLoading={isLoading}
            setPage={setPage}
            totalPages={totalPages}
            empty={() => null}
            total={total}
            rowsPerPage={ROWS_PER_PAGE}
          />
        }
      />
    </div>
  ) : null
}

export default React.memo(TransactionHistory)
