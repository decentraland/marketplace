import { ChainId } from '@dcl/schemas'
import { Vendors } from '../vendor'

export enum Network {
  ROPSTEN = 'ropsten',
  MAINNET = 'mainnet'
}

export type Contract = {
  name: string
  address: string
  chainId: ChainId
  vendor: Vendors
  category: string
}
