export type MakersPlaceSort =
  | 'createdAtAsc'
  | 'createdAtDesc'
  | 'priceAsc'
  | 'priceDesc'
  | 'saleCreatedAtAsc'
  | 'saleCreatedAtDesc'

export type MakersPlaceFetchParams = {
  page_num: number
  page_size: number
  on_sale: 'True'
  sort: MakersPlaceSort
  q?: string
  owner_address?: string
}

export type MakersPlaceFetchOneParams = {
  token_id: number
  contract_address: string
}

export type MakersPlaceAsset = {
  token_id: number | null
  token_contract_address: string
  name: string
  description: string
  total_supply: number
  image_url: string
  owner: string
  url?: string
  sale_created_at?: string
  price_in_wei?: string
  sale_contract_address?: string
}

export type FetchOneSuccessResponse = {
  item: MakersPlaceAsset
  status: 'success'
}
export type FetchOneFailureResponse = {
  status: 'failure'
  errors: Record<string, string[]>
}
export type FetchOneResponse = FetchOneSuccessResponse | FetchOneFailureResponse

export type FetchSuccessResponse = {
  items: MakersPlaceAsset[]
  page_num: number
  page_size: number
  total_pages: number
  total_items: number
  status: 'success'
}
export type FetchFailureResponse = {
  status: 'failure'
  errors: string[]
}
export type FetchResponse = FetchSuccessResponse | FetchFailureResponse

export type Response = FetchOneResponse | FetchResponse
