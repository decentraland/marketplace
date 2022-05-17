import React, { useMemo, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getSearchWearableSection } from '../../../modules/routing/search'
import { locations } from '../../../modules/routing/locations'
import IconBadge from '../IconBadge'
import { BrowseOptions } from '../../../modules/routing/types'
import { Props } from './CategoryBadge.types'

const CategoryBadge = ({ wearable, assetType }: Props) => {
  const section = getSearchWearableSection(wearable.category)

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
      throw new Error(`Invalid wearable category ${wearable.category}`)
    }
  }, [section, wearable.category])

  return (
    <IconBadge
      icon={wearable.category}
      text={t(`wearable.category.${wearable.category}`)}
      href={href}
    />
  )
}

export default React.memo(CategoryBadge)
