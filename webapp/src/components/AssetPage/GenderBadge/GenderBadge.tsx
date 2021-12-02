import { BodyShape } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import React from 'react'
import {
  isGender,
  isUnisex as getIsUnisex
} from '../../../modules/nft/wearable/utils'
import IconBadge from '../IconBadge'
import { Props } from './GenderBadge.types'

const GenderBadge = ({ wearable, onClick }: Props) => {
  const isUnisex = getIsUnisex(wearable)

  return (
    <IconBadge
      icon={isUnisex ? 'Unisex' : wearable.bodyShapes[0]}
      text={
        isUnisex
          ? t('wearable.body_shape.unisex')
          : isGender(wearable, BodyShape.MALE)
          ? t('wearable.body_shape.male')
          : t('wearable.body_shape.female')
      }
      onClick={onClick}
    />
  )
}

export default React.memo(GenderBadge)
