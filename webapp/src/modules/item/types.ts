import { NFTCategory } from '../nft/types'
import {
	WearableRarity,
	WearableCategory,
	BodyShape
} from '../nft/wearable/types'

// TODO: Update from tentative first version
export type Item = {
	id: string
	name: string
	thumbnail: string
	category: NFTCategory.WEARABLE
	contractAddress: string
	collectionId: string
	rarity: WearableRarity
	price: string
	available: number
	createdAt: number
	creator: string
	data: {
		// Data<T> <---- make generic
		wearable: {
			// WearableData
			description: string
			category: WearableCategory
			bodyShapes: BodyShape[]
		}
	}
}
