export enum Permission {
  VIEW = 'view',
  EDIT = 'edit'
}

export type FavoritesData = {
  pickedByUser?: boolean
  createdAt?: number
  count: number
}

export type FavoritedItems = { itemId: string; createdAt: number }[]

export type List = {
  id: string
  name: string
  description: string
  ownerAddress: string
  createdAt: number
  permission?: Permission
}
