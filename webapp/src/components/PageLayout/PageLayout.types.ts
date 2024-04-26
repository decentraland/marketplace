import React from 'react'
import { NavigationTab } from '../Navigation/Navigation.types'

export type Props = {
  activeTab?: NavigationTab
  className?: string
  hideNavigation?: boolean
} & React.PropsWithChildren<React.ReactNode>
