import React from 'react'
import { IconProps } from 'semantic-ui-react/dist/commonjs/elements/Icon'

export type Props = {
  className: string
  text: React.ReactNode
  icon: IconProps['name'] | ''
  type: 'square' | 'rectangle' | 'circle'
  isActive: boolean
  isDisabled: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => any
}
