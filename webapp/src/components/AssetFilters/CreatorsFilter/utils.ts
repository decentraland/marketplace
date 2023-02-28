import { Profile } from '@dcl/schemas'
import { CatalystClient } from 'dcl-catalyst-client'
import { peerUrl } from '../../../lib/environment'

export async function getCreatorsByAddress(address: string[]) {
  const client = new CatalystClient({ catalystUrl: peerUrl })
  const profiles: Profile[] = await client.fetchProfiles(address)

  return profiles.map(profile => ({
    name: profile.avatars[0].name,
    address: profile.avatars[0].ethAddress
  }))
}
