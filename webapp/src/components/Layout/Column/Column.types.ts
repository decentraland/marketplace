import React from 'react'

export type Props = {
  className?: string
  children: React.ReactNode
  align: 'left' | 'center' | 'right'
  grow: boolean
  shrink: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}
