import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { browse } from '../../modules/routing/actions'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import AccountSidebar from './AccountSidebar'
import { ContainerProps } from './AccountSidebar.types'

const AccountSidebarContainer: React.FC<ContainerProps> = ({ address, isCurrentAccount }) => {
  const dispatch = useDispatch()
  const { section } = useGetBrowseOptions()

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return <AccountSidebar address={address} section={section} isCurrentAccount={isCurrentAccount} onBrowse={handleBrowse} />
}

export default AccountSidebarContainer
