export enum Category {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable'
}

export type Contract = {
  name: string
  address: string
  category: Category
}

// TODO: ropsten??
export const ContractAddress = {
  LAND: process.env.REACT_APP_LAND_ADDRESS!,
  ESTATE: process.env.REACT_APP_ESTATE_ADDRESS!,
  EXCLUSIVE_MASKS: process.env.REACT_APP_EXCLUSIVE_MASKS_ADDRESS!,
  HALLOWEEN_2019: process.env.REACT_APP_HALLOWEEN_2019_ADDRESS!,
  XMAS_2019: process.env.REACT_APP_XMAS_2019_ADDRESS!
}
