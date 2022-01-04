import { Store as CommonsStore } from '@dcl/schemas'

export type Store = {
  owner: string
  cover: string
  coverName: string
  description: string
  website: string
  facebook: string
  twitter: string
  discord: string
}

export enum LinkType {
  WEBSITE = 'website',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  DISCORD = 'discord'
}

export type StoreEntityMetadata = CommonsStore
