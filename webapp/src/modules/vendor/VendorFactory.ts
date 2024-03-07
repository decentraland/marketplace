import { BaseClientConfig } from 'decentraland-dapps/dist/lib/BaseClient'
import {
  ContractService,
  NFTService,
  OrderService,
  BidService,
  AnalyticsService
} from './decentraland'
import { VendorName } from './types'

export class VendorFactory {
  static build(
    vendor: VendorName,
    config?: BaseClientConfig | undefined
  ): Vendor<VendorName> {
    switch (vendor) {
      case VendorName.DECENTRALAND:
        return new Vendor<VendorName.DECENTRALAND>(
          vendor,
          new ContractService(),
          new NFTService(config),
          new OrderService(),
          new BidService(),
          new AnalyticsService()
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
    public nftService: NFTService,
    public orderService: OrderService,
    public bidService?: BidService,
    public analyticsService?: AnalyticsService
  ) {}
}
