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

export type CreditsClaimProgressStatus = 'polling' | 'success' | 'failed'

// Sub-stage within the 'polling' status, to drive a friendly step-by-step UI:
//  - 'consuming'   → the origin (Polygon) tx is being mined (credits being spent)
//  - 'registering' → the origin tx is done; the NAME is being registered on the destination
export type CreditsClaimProgressStage = 'consuming' | 'registering'

export type CreditsClaimProgress = {
  name: string
  polygonTxHash: string
  coralScanUrl: string
  status: CreditsClaimProgressStatus
  stage?: CreditsClaimProgressStage
  // Destination (Ethereum) tx hash where the NAME was registered — set on success.
  destinationTxHash?: string
}
