import { NFT } from '@dcl/schemas'

export type Wearable = NFT['data']['wearable']

export enum WearableGender {
  MALE = 'male',
  FEMALE = 'female'
}
