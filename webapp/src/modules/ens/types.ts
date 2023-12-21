export type ENS = {
  /** The NFT owner address */
  nftOwnerAddress: string
  /** The ENS name owner address */
  ensOwnerAddress: string
  /** The ENS name */
  name: string
  /** The ENS subdomain name */
  subdomain: string
  /** The NFT's token id that represents the ENS name */
  tokenId: string
  resolver: string
  content: string

  ipfsHash?: string

  // We'll need to change `landId` eventually so it can handle different content types. We could use:
  //   contentId?: string
  //   contentType?: ENSContent {LAND = 'land', (...)}
  landId?: string

  worldStatus?: WorldStatus | null

  /** Registrar contract address */
  contractAddress: string
}

export type ENSError = {
  message: string
  code?: number
  origin?: ENSOrigin
}

export enum ENSOrigin {
  RESOLVER = 'Resolver',
  CONTENT = 'Content'
}

export type Authorization = {
  allowance: string
}

export type WorldStatus = {
  healthy: boolean
  scene: {
    urn: string
    entityId: string
  }
}
