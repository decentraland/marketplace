import React from 'react'
import { NavigationTab } from '../Navigation/Navigation.types'

export type Props = {
  activeTab?: NavigationTab
  className?: string
} & React.PropsWithChildren<React.ReactNode>
