import { Account, Avatar, Profile } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTResult } from '../vendor/decentraland'
import { CreatorAccount } from './types'
import { enhanceCreatorName, fromProfilesToCreators, sumAccountMetrics } from './utils'

describe('when summing account metrics', () => {
  it('should return an account metric with its values added from the provided account metrics', () => {
    expect(
      sumAccountMetrics(
        {
          address: 'address1',
          earned: '100',
          purchases: 100,
          royalties: '100',
          sales: 100,
          spent: '100'
        },
        {
          address: 'address2',
          earned: '200',
          purchases: 200,
          royalties: '200',
          sales: 200,
          spent: '200'
        }
      )
    ).toEqual({
      address: 'address1',
      earned: '300',
      purchases: 300,
      royalties: '300',
      sales: 300,
      spent: '300'
    })
  })
})

describe('when transforming profiles and accounts objects to creators entities', () => {
  let profiles: Profile[]
  let accounts: Account[]
  let avatarName: string
  let ethAddress: string
  let collectionsAmount: number
  beforeEach(() => {
    avatarName = 'anAvatarName'
    ethAddress = 'anEthAddress'
    profiles = [
      {
        avatars: [
          {
            name: avatarName,
            ethAddress
          } as Avatar
        ]
      }
    ]
    collectionsAmount = 3
    accounts = [{ address: ethAddress, collections: collectionsAmount } as Account]
  })
  it('should return an creator account with the values from the profile and account', () => {
    expect(fromProfilesToCreators(profiles, accounts)).toEqual([
      {
        name: avatarName,
        address: ethAddress,
        collections: collectionsAmount
      }
    ])
  })
})

describe('when enhancing creator name', () => {
  let creator: CreatorAccount
  let ens: NFTResult[]
  let search: string
  beforeEach(() => {
    creator = {
      name: 'aName',
      address: 'anAddress',
      collections: 1
    }
    ens = [
      {
        nft: {
          owner: creator.address,
          name: 'aName'
        }
      } as NFTResult
    ]
    search = 'aName'
  })
  describe('when the creator name does not contain the search', () => {
    beforeEach(() => {
      creator.name = 'anotherName'
    })
    it('should enhance the name and add the profile name at the end', () => {
      enhanceCreatorName(creator, ens, search)
      expect(creator.name).toEqual(`aName (${t('global.currently')} anotherName)`)
    })
  })
  describe('when the creator name contains the search', () => {
    it('should not change the creator name', () => {
      enhanceCreatorName(creator, ens, search)
      expect(creator.name).toEqual('aName')
    })
  })
})
