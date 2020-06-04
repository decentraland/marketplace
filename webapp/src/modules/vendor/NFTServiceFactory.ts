import { NFTService as DecentralandNFTService } from './decentraland/NFTService'
import { NFTService as SuperrareNFTService } from './superrare/NFTService'
import { Vendors, NFTService } from './types'

export class NFTServiceFactory {
  static build(vendor: Vendors): NFTService {
    switch (vendor) {
      case Vendors.DECENTRALAND:
        return new DecentralandNFTService()
      case Vendors.SUPERRARE:
        return new SuperrareNFTService()
      default:
        throw new Error(`Invalid vendor ${vendor}`)
    }
  }
}
