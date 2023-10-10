export type AddressesByTagResponse = string[]

export type BuilderCollectionAttributes = {
  id: string // uuid
  contract_address: string
  name: string
  eth_address: string
  salt: string | null
  urn_suffix: string | null
  third_party_id: string | null
  is_published: boolean
  is_approved: boolean
  minters: string[]
  managers: string[]
  forum_link: string | null
  forum_id: number | null
  lock: Date | null
  reviewed_at: Date | null
  created_at: Date
  updated_at: Date
}
