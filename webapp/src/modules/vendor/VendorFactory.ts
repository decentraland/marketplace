import * as decentraland from './decentraland'
import * as superrare from './superrare'
import {
  ContractService,
  NFTService,
  OrderService,
  BidService
} from './services'
import { Vendors } from './types'

export class VendorFactory {
  static build(vendor: Vendors): Vendor {
    switch (vendor) {
      case Vendors.DECENTRALAND:
        return new Vendor(
          vendor,
          new decentraland.ContractService(),
          new decentraland.NFTService(),
          new decentraland.OrderService(),
          new decentraland.BidService()
        )
      case Vendors.SUPERRARE:
        return new Vendor(
          vendor,
          new superrare.ContractService(),
          new superrare.NFTService()
        )
      default:
        throw new Error(`Invalid vendor "${vendor}"`)
    }
  }
}

class Vendor {
  constructor(
    public type: Vendors,
    public contractService: ContractService,
    public nftService: NFTService,
    public orderService?: OrderService,
    public bidService?: BidService
  ) {}

  hasBids(): boolean {
    return this.bidService !== undefined
  }
}
