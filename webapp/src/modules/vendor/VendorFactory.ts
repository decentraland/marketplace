import * as decentraland from './decentraland'
import * as superrare from './superrare'
import { Vendors, NFTService, OrderService, BidService } from './types'

export class VendorFactory {
  static build(vendor: Vendors): Vendor {
    switch (vendor) {
      case Vendors.DECENTRALAND:
        return new Vendor(
          new decentraland.NFTService(),
          new decentraland.OrderService(),
          new decentraland.BidService()
        )
      case Vendors.SUPERRARE:
        return new Vendor(new superrare.NFTService())
      default:
        throw new Error(`Invalid vendor ${vendor}`)
    }
  }
}

class Vendor {
  constructor(
    public nftService: NFTService,
    public orderService?: OrderService,
    public bidService?: BidService
  ) {}
}
