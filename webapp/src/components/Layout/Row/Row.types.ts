import React from 'react'

export type Props = {
  className?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}
