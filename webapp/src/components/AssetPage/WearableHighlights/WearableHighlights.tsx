import React, { useCallback } from 'react'
import { BodyShape } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland/routing/types'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { WearableGender } from '../../../modules/nft/wearable/types'
import { getSearchWearableSection } from '../../../modules/routing/search'
import { Highlights } from '../Highlights'
import { Highlight } from '../Highlight'
import { Props } from './WearableHighlights.types'
import './WearableHighlights.css'

const WearableHighlights = (props: Props) => {
  const { type, wearable, onNavigate } = props

  const handleCategoryClick = useCallback(() => {
    if (!wearable) {
      throw new Error('Missing wearable')
    }
    const category = wearable.category
    const section = getSearchWearableSection(category)
    if (!section) {
      throw new Error(`Invalid wearable category ${category}`)
    }
    onNavigate(locations.browse({ assetType: type, section }))
  }, [type, wearable, onNavigate])

  const handleGenderClick = useCallback(() => {
    onNavigate(
      locations.browse({
        assetType: type,
        section: Section.WEARABLES,
        wearableGenders: isGender(wearable, BodyShape.MALE)
          ? [WearableGender.MALE]
          : [WearableGender.FEMALE]
      })
    )
  }, [type, wearable, onNavigate])

  const handleUnisexClick = useCallback(() => {
    onNavigate(
      locations.browse({
        assetType: type,
        section: Section.WEARABLES,
        wearableGenders: [WearableGender.MALE, WearableGender.FEMALE]
      })
    )
  }, [type, onNavigate])

  return wearable ? (
    <Highlights className="WearableHighlights">
      <Highlight
        icon={<div className={wearable.category} />}
        name={t(`wearable.category.${wearable.category}`)}
        onClick={handleCategoryClick}
      />
      {isUnisex(wearable) ? (
        <Highlight
          icon={<div className="Unisex" />}
          name={t('wearable.body_shape.unisex')}
          onClick={handleUnisexClick}
        />
      ) : (
        <Highlight
          icon={<div className={wearable.bodyShapes[0]} />}
          name={
            isGender(wearable, BodyShape.MALE)
              ? t('wearable.body_shape.male')
              : t('wearable.body_shape.female')
          }
          onClick={handleGenderClick}
        />
      )}
    </Highlights>
  ) : null
}

export default React.memo(WearableHighlights)
