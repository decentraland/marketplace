import React from 'react'
import { Link } from 'react-router-dom'
import { IconBadge } from 'decentraland-ui/dist/components/IconBadge/IconBadge'
import { Props } from './LinkedIconBadge.types'

const LinkedIconBadge = (props: Props) => {
  const { href, ...rest } = props

  return href ? (
    <Link to={href}>
      <IconBadge {...rest} />
    </Link>
  ) : (
    <IconBadge {...rest} />
  )
}

export default React.memo(LinkedIconBadge)
