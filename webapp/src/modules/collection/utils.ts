import { config } from '../../config'

export const getCollectionManagementUrl = (contractAddress: string) =>
  `${config.get('CREATORS_URL')}/collections?contract=${encodeURIComponent(contractAddress)}`
