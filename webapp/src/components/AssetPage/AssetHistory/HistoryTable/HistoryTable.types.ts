import React from 'react'
import { RentalListing, Sale } from '@dcl/schemas'
import { TableCellProps } from 'decentraland-ui'
import { Asset } from '../../../../modules/asset/types'

export type Props = {
  title: string
  asset: Asset
  loadHistoryItems: <T extends RentalListing>(
    page: number,
    limit: number
  ) => Promise<{ data: T[]; total: number }>
  historyItemsHeaders: { props?: TableCellProps; content: React.ReactNode }[]
  getHistoryItemDesktopColumns: <T extends Sale | RentalListing>(
    historyItem: T
  ) => { props?: TableCellProps; content: React.ReactNode }[]
  getHistoryItemMobileColumns: <T extends Sale | RentalListing>(
    historyItem: T
  ) => { summary: React.ReactNode; date: number; index: string }
}

export type MapStateProps = {}
export type MapDispatchProps = {}
