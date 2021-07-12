export type Parcel = {
  x: string
  y: string
  data: {
    description: string
  } | null
  estate: {
    tokenId: string
    name: string
  } | null
}
