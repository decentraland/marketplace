import { Store } from './types'

export const getEmptyLocalStore = (): Store => ({
  owner: '',
  cover: '',
  description: '',
  website: '',
  facebook: '',
  twitter: '',
  discord: ''
})
