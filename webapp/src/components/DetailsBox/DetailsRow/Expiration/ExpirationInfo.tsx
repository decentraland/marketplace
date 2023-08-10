import { memo } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { Info } from '../../Info'
import { Props } from './ExpirationInfo.types'

export const ExpirationInfo = ({
  title,
  popupContent,
  icon,
  expirationDate
}: Props) => (
  <Info title={title} popupContent={popupContent} icon={icon}>
    <span>
      {formatDistanceToNow(
        expirationDate * (expirationDate.toString().length === 10 ? 1000 : 1),
        {
          addSuffix: true
        }
      )}
    </span>
  </Info>
)

export default memo(ExpirationInfo)
