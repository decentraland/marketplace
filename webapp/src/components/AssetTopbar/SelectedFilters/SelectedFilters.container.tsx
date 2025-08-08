import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { getCategoryFromSection } from '../../../modules/routing/search'
import { isLandSection } from '../../../modules/ui/utils'
import { SelectedFilters } from './SelectedFilters'

const SelectedFiltersContainer: React.FC = () => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()

  const category = useMemo(
    () => (browseOptions.section ? getCategoryFromSection(browseOptions.section) : undefined),
    [browseOptions.section]
  )
  const isLandSectionValue = useMemo(() => isLandSection(browseOptions.section), [browseOptions.section])

  const handleBrowse: ActionFunction<typeof browse> = useCallback(options => dispatch(browse(options)), [dispatch])

  return <SelectedFilters category={category} browseOptions={browseOptions} isLandSection={isLandSectionValue} onBrowse={handleBrowse} />
}

export default SelectedFiltersContainer
