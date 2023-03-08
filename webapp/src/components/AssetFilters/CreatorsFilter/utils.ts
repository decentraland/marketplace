import { Profile } from '@dcl/schemas'

export function profileToCreatorAccount(profiles: Profile[]) {
  return profiles.map(profile => ({
    name: profile.avatars[0].name,
    address: profile.avatars[0].ethAddress
  }))
}
