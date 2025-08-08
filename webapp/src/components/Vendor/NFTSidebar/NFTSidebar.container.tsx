import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import NFTSidebar from './NFTSidebar'
import { ContainerProps } from './NFTSidebar.types'

const NFTSidebarContainer: React.FC<ContainerProps> = ({ section, sections }) => {
  const dispatch = useDispatch()
  const { vendor, section: browseSection, search, withCredits } = useGetBrowseOptions()

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return (
    <NFTSidebar
      vendor={vendor}
      section={section || browseSection}
      sections={sections}
      search={search}
      withCredits={withCredits}
      onBrowse={handleBrowse}
    />
  )
}

export default NFTSidebarContainer
