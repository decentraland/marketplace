import { config } from '../config'

export const environment = config.get('ENVIRONMENT')!
export const peerUrl = config.get('PEER_URL')!
export const builderUrl = config.get('BUILDER_URL')!
