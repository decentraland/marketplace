import React, { useMemo } from 'react'
import classNames from 'classnames'
import { BodyShape, WearableGender } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isGender, isUnisex as getIsUnisex } from '../../modules/nft/utils'
import { locations } from '../../modules/routing/locations'
import IconBadge from '../AssetPage/LinkedIconBadge'
import { Props } from './GenderBadge.types'
import styles from './GenderBadge.module.css'

const GenderBadge = ({ bodyShapes, withText, assetType, section }: Props) => {
  const isUnisex = getIsUnisex(bodyShapes)
  const isGenderBodyShape = isGender(bodyShapes, BodyShape.MALE)

  const href = useMemo(
    () =>
      locations.browse({
        assetType: assetType,
        section: section,
        wearableGenders: isUnisex
          ? [WearableGender.MALE, WearableGender.FEMALE]
          : isGenderBodyShape
            ? [WearableGender.MALE]
            : [WearableGender.FEMALE]
      }),
    [assetType, section, isUnisex, isGenderBodyShape]
  )

  const icon = isUnisex ? 'Unisex' : bodyShapes[0].endsWith('BaseMale') ? 'BaseMale' : 'BaseFemale'

  return withText ? (
    <IconBadge
      icon={icon}
      text={isUnisex ? t('body_shape.unisex') : isGenderBodyShape ? t('body_shape.male') : t('body_shape.female')}
      href={href}
    />
  ) : (
    <span className={classNames(styles.icon, styles[icon])} />
  )
}

GenderBadge.defaultProps = {
  withText: true
}

export default React.memo(GenderBadge)
