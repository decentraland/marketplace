import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { MapTopbar } from './MapTopbar'
import { ContainerProps } from './MapTopbar.types'

const MapTopbarContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return <MapTopbar onlyOnRent={browseOptions.onlyOnRent} onlyOnSale={browseOptions.onlyOnSale} onBrowse={handleBrowse} {...props} />
}

export default MapTopbarContainer
