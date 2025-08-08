import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetBrowseOptions } from '../../../../modules/routing/hooks'
import { getView } from '../../../../modules/ui/browse/selectors'
import { Section } from '../../../../modules/vendor/routing/types'
import { CategoryFilter } from './CategoryFilter'
import { ContainerProps } from './CategoryFilter.types'

const CategoryFilterContainer: React.FC<ContainerProps> = ({ values, onChange }) => {
  const browseOptions = useGetBrowseOptions()
  const view = useSelector(getView)

  const section = useMemo(
    () => ('section' in values && values.section ? (values.section as Section) : browseOptions.section),
    [values.section, browseOptions.section]
  )
  const assetType = useMemo(
    () => ('assetType' in values && values.assetType ? values.assetType : browseOptions.assetType),
    [values.assetType, browseOptions.assetType]
  )
  return <CategoryFilter section={section} assetType={assetType} view={view} onChange={onChange} />
}

export default CategoryFilterContainer
