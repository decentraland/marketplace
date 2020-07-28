import { services as decentraland } from './decentraland'
import { services as superRare } from './super_rare'
import { services as makersPlace } from './makers_place'
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
      case Vendors.SUPER_RARE:
        return new Vendor(
          vendor,
          new superRare.ContractService(),
          new superRare.NFTService(),
          new superRare.OrderService()
        )
      case Vendors.MAKERS_PLACE:
        return new Vendor(
          vendor,
          new makersPlace.ContractService(),
          new makersPlace.NFTService(),
          new makersPlace.OrderService()
        )
      default:
        throw new Error(`Invalid vendor "${vendor}"`)
    }
  }
}

export class Vendor {
  constructor(
    public type: Vendors,
    public contractService: ContractService,
    public nftService: NFTService,
    public orderService: OrderService,
    public bidService?: BidService
  ) {}
}
