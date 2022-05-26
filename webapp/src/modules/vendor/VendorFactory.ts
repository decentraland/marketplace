import { services as decentraland } from './decentraland'
import { services as superRare } from './super_rare'
import { services as makersPlace } from './makers_place'
import { services as knownOrigin } from './known_origin'
import {
  ContractService,
  NFTService,
  OrderService,
  BidService,
  AnalyticsService
} from './services'
import { VendorName } from './types'

export class VendorFactory {
  static build(vendor: VendorName): Vendor<VendorName> {
    switch (vendor) {
      case VendorName.DECENTRALAND:
        return new Vendor<VendorName.DECENTRALAND>(
          vendor,
          new decentraland.ContractService(),
          new decentraland.NFTService(),
          new decentraland.OrderService(),
          new decentraland.BidService(),
          new decentraland.AnalyticsService()
        )
      case VendorName.SUPER_RARE:
        return new Vendor(
          vendor,
          new superRare.ContractService(),
          new superRare.NFTService(),
          new superRare.OrderService()
        )
      case VendorName.MAKERS_PLACE:
        return new Vendor(
          vendor,
          new makersPlace.ContractService(),
          new makersPlace.NFTService(),
          new makersPlace.OrderService()
        )
      case VendorName.KNOWN_ORIGIN:
        return new Vendor(
          vendor,
          new knownOrigin.ContractService(),
          new knownOrigin.NFTService(),
          new knownOrigin.OrderService()
        )
      default:
        throw new Error(`Invalid vendor "${vendor}"`)
    }
  }
}

export class Vendor<V extends VendorName> {
  constructor(
    public type: V,
    public contractService: ContractService,
    public nftService: NFTService<V>,
    public orderService: OrderService<V>,
    public bidService?: BidService<V>,
    public analyticsService?: AnalyticsService
  ) {}
}
