import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { VendorName } from '../../../modules/vendor'
import OtherAccountSidebar from './OtherAccountSidebar'
import { ContainerProps } from './OtherAccountSidebar.types'

const OtherAccountSidebarContainer: React.FC<ContainerProps> = ({ section, address }) => {
  const dispatch = useDispatch()
  const { assetType } = useGetBrowseOptions()

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(
    options => dispatch(browse({ vendor: VendorName.DECENTRALAND, ...options })),
    [dispatch]
  )

  return <OtherAccountSidebar section={section} address={address} assetType={assetType} onBrowse={handleBrowse} />
}

export default OtherAccountSidebarContainer
