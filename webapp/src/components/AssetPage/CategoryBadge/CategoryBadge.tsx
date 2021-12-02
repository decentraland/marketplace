import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import IconBadge from '../IconBadge'
import { Props } from './CategoryBadge.types'

const CategoryBadge = ({ wearable, onClick }: Props) => {
  return (
    <IconBadge
      icon={wearable.category}
      text={t(`wearable.category.${wearable.category}`)}
      onClick={onClick}
    />
  )
}

export default React.memo(CategoryBadge)
