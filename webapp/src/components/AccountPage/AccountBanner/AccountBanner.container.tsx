import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { goBack } from '../../../modules/routing/actions'
import { useGetUserAddressFromCurrentUrl, useGetBrowseOptions } from '../../../modules/routing/hooks'
import { fetchStoreRequest, FETCH_STORE_REQUEST } from '../../../modules/store/actions'
import { getStoresByOwner, getLocalStore, getLoading as getStoreLoading } from '../../../modules/store/selectors'
import { Store } from '../../../modules/store/types'
import { getAddress as getAddressFromWallet } from '../../../modules/wallet/selectors'
import AccountBanner from './AccountBanner'
import { ContainerProps } from './AccountBanner.types'

const AccountBannerContainer: React.FC<ContainerProps> = props => {
  const dispatch = useDispatch()

  const { viewAsGuest } = useGetBrowseOptions()

  const addressFromUrl = useGetUserAddressFromCurrentUrl()
  const addressFromWallet = useSelector(getAddressFromWallet)

  const storeLoading = useSelector(getStoreLoading)
  const storesByOwner = useSelector(getStoresByOwner)
  const localStore = useSelector(getLocalStore)

  const address = addressFromUrl || addressFromWallet
  const isLoading = useMemo(() => isLoadingType(storeLoading, FETCH_STORE_REQUEST), [storeLoading])

  const store: Store | undefined = useMemo(() => {
    let storeResult: Store | undefined = address ? storesByOwner[address] : undefined

    if (viewAsGuest) {
      storeResult = localStore || storeResult
    }

    return storeResult
  }, [address, storesByOwner, viewAsGuest, localStore])

  const handleBack = useCallback<ActionFunction<typeof goBack>>(() => dispatch(goBack()), [dispatch])
  const handleFetchStore = useCallback<ActionFunction<typeof fetchStoreRequest>>(
    storeAddress => dispatch(fetchStoreRequest(storeAddress)),
    [dispatch]
  )

  return <AccountBanner {...props} store={store} isLoading={isLoading} onBack={handleBack} onFetchStore={handleFetchStore} />
}

export default AccountBannerContainer
