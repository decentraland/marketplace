import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import { getWallet } from '../../modules/wallet/selectors'
import AccountPage from './AccountPage'
import { ContainerProps } from './AccountPage.types'

const AccountPageContainer: React.FC<ContainerProps> = props => {
  const { address } = props.match.params
  const { vendor, isFullscreen, viewAsGuest } = useGetBrowseOptions()

  const wallet = useSelector(getWallet)
  const isConnectingState = useSelector(isConnecting)
  const addressInUrl = useMemo(() => address?.toLowerCase(), [address])

  return (
    <AccountPage
      addressInUrl={addressInUrl}
      vendor={vendor}
      wallet={wallet}
      isConnecting={isConnectingState}
      isFullscreen={isFullscreen}
      viewAsGuest={!!viewAsGuest}
    />
  )
}

export default AccountPageContainer
