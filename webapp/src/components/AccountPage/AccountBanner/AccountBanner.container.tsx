import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import { goBack } from '../../../modules/routing/actions'
import { useGetUserAddressFromCurrentUrl, useGetBrowseOptions } from '../../../modules/routing/hooks'
import { fetchStoreRequest, FETCH_STORE_REQUEST } from '../../../modules/store/actions'
import { getStoresByOwner, getLocalStore, getLoading as getStoreLoading } from '../../../modules/store/selectors'
import { Store } from '../../../modules/store/types'
import { getAddress as getAddressFromWallet } from '../../../modules/wallet/selectors'
import AccountBanner from './AccountBanner'

const AccountBannerContainer: React.FC = () => {
  const dispatch = useDispatch()

  const browseOptions = useGetBrowseOptions()
  const addressFromUrl = useGetUserAddressFromCurrentUrl()
  const addressFromWallet = useSelector(getAddressFromWallet)
  const address = addressFromUrl || addressFromWallet
  const isLoading = useSelector((state: RootState) => isLoadingType(getStoreLoading(state), FETCH_STORE_REQUEST))
  const storesByOwner = useSelector(getStoresByOwner)
  const localStore = useSelector(getLocalStore)

  const store = useMemo(() => {
    let storeData: Store | undefined = address ? storesByOwner[address] : undefined

    if (browseOptions.viewAsGuest) {
      storeData = localStore || storeData
    }

    return storeData
  }, [address, browseOptions.viewAsGuest, storesByOwner, localStore])

  const handleBack = useCallback(() => dispatch(goBack()), [dispatch])
  const handleFetchStore = useCallback((storeAddress: string) => dispatch(fetchStoreRequest(storeAddress)), [dispatch])

  if (!address) {
    return null
  }

  return <AccountBanner address={address} store={store} isLoading={isLoading} onBack={handleBack} onFetchStore={handleFetchStore} />
}

export default AccountBannerContainer
