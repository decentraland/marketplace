import { Account, Profile } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ethers } from 'ethers'
import { NFTResult } from '../vendor/decentraland'
import { AccountMetrics, CreatorAccount } from './types'

export function sumAccountMetrics(a: AccountMetrics, b: AccountMetrics) {
  return {
    ...a,
    purchases: a.purchases + b.purchases,
    sales: a.sales + b.sales,
    earned: addStrings(a.earned, b.earned),
    royalties: addStrings(a.royalties, b.royalties),
    spent: addStrings(a.spent, b.spent)
  }
}

function addStrings(a: string, b: string) {
  return ethers.BigNumber.from(a).add(b).toString()
}

export function fromProfilesToCreators(profiles: Profile[], accounts: Account[]): CreatorAccount[] {
  return profiles
    .map(profile => ({
      name: profile.avatars[0].name,
      address: profile.avatars[0].ethAddress,
      collections: accounts.find(account => account.address === profile.avatars[0].ethAddress)?.collections || 0
    }))
    .filter(account => account.collections > 0)
}

export function enhanceCreatorName(creator: CreatorAccount, ens: NFTResult[], search: string) {
  if (!creator.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
    const ensThatMatches = ens.find(nft => nft.nft.owner === creator.address)
    const hasADifferentName = ensThatMatches?.nft.name !== creator.name
    if (ensThatMatches && hasADifferentName) {
      creator.name = `${ensThatMatches.nft.name} (${t('global.currently')} ${creator.name})`
    }
  }
}
