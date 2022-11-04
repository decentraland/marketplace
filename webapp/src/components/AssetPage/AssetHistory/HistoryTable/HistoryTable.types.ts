import React from 'react'
import { TableCellProps } from 'decentraland-ui'

import { Asset } from '../../../../modules/asset/types'

export interface IdentifiableObject {
  [key: string]: any
  id: string
}

export type Props = {
  title: string
  asset: Asset
  loadHistoryItems: <T extends IdentifiableObject>(
    page: number,
    limit: number
  ) => Promise<{ data: T[]; total: number }>
  historyItemsHeaders: { props?: TableCellProps; content: React.ReactNode }[]
  getHistoryItemDesktopColumns: <T extends IdentifiableObject>(
    historyItem: T
  ) => { props?: TableCellProps; content: React.ReactNode }[]
  getHistoryItemMobileColumns: <T extends IdentifiableObject>(
    historyItem: T
  ) => { summary: React.ReactNode; date: number; index: string }
}

export type MapStateProps = {}
export type MapDispatchProps = {}
