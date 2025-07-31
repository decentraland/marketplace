import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { goBack } from '../../modules/routing/actions'
import { useGetCollectionAddressFromCurrentUrl } from '../../modules/routing/hooks'
import { getAddress } from '../../modules/wallet/selectors'
import CollectionPage from './CollectionPage'

const CollectionPageContainer: React.FC = () => {
  const dispatch = useDispatch()

  const contractAddress = useGetCollectionAddressFromCurrentUrl()
  const currentAddress = useSelector(getAddress)

  const onBack = useCallback(() => {
    dispatch(goBack())
  }, [dispatch])

  return <CollectionPage contractAddress={contractAddress} currentAddress={currentAddress} onBack={onBack} />
}

export default CollectionPageContainer
