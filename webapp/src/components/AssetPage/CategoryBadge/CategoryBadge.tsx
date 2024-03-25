import React, { useMemo, useEffect } from 'react'
import { EmoteCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { getSearchSection } from '../../../modules/routing/search'
import { BrowseOptions } from '../../../modules/routing/types'
import IconBadge from '../IconBadge'
import { Props } from './CategoryBadge.types'

const CategoryBadge = ({ category, assetType }: Props) => {
  const isEmote = Object.values(EmoteCategory).includes(category as EmoteCategory)
  const section = getSearchSection(category)

  const href = useMemo(() => {
    const browseProps: BrowseOptions = { assetType: assetType }
    if (section) {
      browseProps.section = section
    }

    return locations.browse(browseProps)
  }, [assetType, section])

  // TODO: we have to handle these types of errors and report them somewhere
  useEffect(() => {
    if (!section) {
      throw new Error(`Invalid ${isEmote ? 'emote' : 'wearable'} category ${category}`)
    }
  }, [section, category, isEmote])

  return <IconBadge icon={isEmote ? undefined : category} text={t(`${isEmote ? 'emote' : 'wearable'}.category.${category}`)} href={href} />
}

export default React.memo(CategoryBadge)
