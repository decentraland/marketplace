import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { getTiles } from '../../../modules/tile/selectors'
import { getWalletOwnedLands } from '../../../modules/ui/browse/selectors'
import { MapBrowse } from './MapBrowse'
import { ContainerProps } from './MapBrowse.types'

const MapBrowseContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()
  const { onlyOnSale, onlyOnRent } = useGetBrowseOptions()

  const tiles = useSelector(getTiles)
  const ownedLands = useSelector(getWalletOwnedLands)

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return (
    <MapBrowse {...props} tiles={tiles} ownedLands={ownedLands} onlyOnSale={onlyOnSale} onlyOnRent={onlyOnRent} onBrowse={handleBrowse} />
  )
}

export default MapBrowseContainer
