import React from 'react'

export enum AddressError {
  INVALID = 'invalid_address',
  ENS_NOT_RESOLVED = 'ens_not_resolved'
}

export type AddressProviderResult = {
  address: string | null
  error?: AddressError
  isLoading: boolean
}

export type Props = {
  input?: string
  children: (result: AddressProviderResult) => React.ReactNode | null
}
