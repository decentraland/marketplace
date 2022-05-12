import React from 'react'

export type Props = {
  className?: string
  icon?: string
  text: string
  onClick?: () => void
  href?: string
  children?: React.ReactNode
}
