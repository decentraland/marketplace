import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import IconBadge from '../IconBadge'
import { Props } from './CategoryBadge.types'
import { getSearchWearableSection } from '../../../modules/routing/search'
import { locations } from '../../../modules/routing/locations'

const CategoryBadge = ({ wearable, assetType }: Props) => {

  const section = getSearchWearableSection(wearable.category)

  const href = React.useMemo(() => {
    let browseProps = { assetType: assetType, section: section }
    !section && delete browseProps.section

    return locations.browse(browseProps)
  }, [assetType, section])  

  // TODO: we have to handle these types of errors and report them somewhere
  React.useEffect(() => {
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
