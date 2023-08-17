import React, { RefObject } from 'react'
import { DropdownItemProps } from 'decentraland-ui'

export type Props = {
  children: React.ReactNode
  ref: RefObject<HTMLDivElement>
  tabsList: { displayValue: string; value: string }[]
  activeTab?: string
  handleTabChange?: (tab: string) => void
  sortbyList?: DropdownItemProps[]
  handleSortByChange?: (value: string) => void
  sortBy?: string
}
