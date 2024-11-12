import { BaseClientConfig } from 'decentraland-dapps/dist/lib/BaseClient'
import { convertToOutputString } from '../../utils/output'
import { ContractService, NFTService, OrderService, BidService } from './decentraland'
import { VendorName } from './types'

export class VendorFactory {
  static build(vendor: VendorName, config?: BaseClientConfig | undefined, shouldUseLegacyAPIs = true): Vendor<VendorName> {
    switch (vendor) {
      case VendorName.DECENTRALAND:
        return new Vendor<VendorName.DECENTRALAND>(
          vendor,
          new ContractService(),
          new NFTService(config, shouldUseLegacyAPIs),
          new OrderService(shouldUseLegacyAPIs),
          new BidService()
        )
      default:
        throw new Error(`Invalid vendor "${convertToOutputString(vendor)}"`)
    }
  }
}

export class Vendor<V extends VendorName> {
  constructor(
    public type: V,
    public contractService: ContractService,
    public nftService: NFTService,
    public orderService: OrderService,
    public bidService?: BidService
  ) {}
}
