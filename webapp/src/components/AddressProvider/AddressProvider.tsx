import React, { useEffect, useState } from 'react'
import { isENSAddress, resolveENSname } from '../../modules/wallet/utils'
import { AddressError, Props } from './AddressProvider.types'
import { utils } from 'ethers'

const AddressProvider = (props: Props) => {
  const { children, input } = props
  const isENS = input && isENSAddress(input)
  const [address, setAddress] = useState(input && !isENS ? input : null)
  const [isLoading, setIsLoading] = useState(!!isENS)
  const [error, setError] = useState<AddressError>()

  useEffect(() => {
    if (address && !utils.isAddress(address) && !isENS) {
      setError(AddressError.INVALID)
    }
  }, [address, isENS])

  // Resolves ENS name if needed
  useEffect(() => {
    let cancel = false
    const resolveAddress = async () => {
      if (input && isENS) {
        setIsLoading(true)
        const resolvedAddress = await resolveENSname(input)
        setIsLoading(false)
        if (cancel) return
        if (!resolvedAddress) {
          setError(AddressError.ENS_NOT_RESOLVED)
          return
        }
        setAddress(resolvedAddress)
      }
    }
    resolveAddress()
    return () => {
      cancel = true
    }
  }, [isENS, input])

  return <>{children({ address, isLoading, error })}</>
}

export default React.memo(AddressProvider)
