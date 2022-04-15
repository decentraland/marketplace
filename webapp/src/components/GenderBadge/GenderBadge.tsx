import { BodyShape } from '@dcl/schemas'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import React from 'react'
import { isGender, isUnisex as getIsUnisex } from '../../modules/nft/utils'
import IconBadge from '../AssetPage/IconBadge'
import { Props } from './GenderBadge.types'
import styles from './GenderBadge.module.css'

const GenderBadge = ({ bodyShapes, withText, onClick }: Props) => {
  const isUnisex = getIsUnisex(bodyShapes)

  const icon = isUnisex ? 'Unisex' : bodyShapes[0]

  return withText ? (
    <IconBadge
      icon={icon}
      text={
        isUnisex
          ? t('body_shape.unisex')
          : isGender(bodyShapes, BodyShape.MALE)
          ? t('body_shape.male')
          : t('body_shape.female')
      }
      onClick={onClick}
    />
  ) : (
    <span className={classNames(styles.icon, styles[icon])} />
  )
}

GenderBadge.defaultProps = {
  withText: true,
  onClick: () => {}
}

export default React.memo(GenderBadge)
