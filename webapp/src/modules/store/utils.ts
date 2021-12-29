import { Store } from './types'

export const getEmptyLocalStore = (): Store => ({
  owner: '',
  cover: '',
  coverName: '',
  description: '',
  website: '',
  facebook: '',
  twitter: '',
  discord: ''
})
