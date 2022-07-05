import { services as decentraland } from './decentraland'
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
