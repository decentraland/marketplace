import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { NFT, Sale } from '../../entities/schema'
import { createOrLoadAccount } from '../account'
import { buildCountFromSale } from '../count'

export let BID_SALE_TYPE = 'bid'
export let ORDER_SALE_TYPE = 'order'

export function trackSale(
  type: string,
  buyer: Address,
  seller: Address,
  nftId: string,
  price: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // ignore zero price sales
  if (price.isZero()) {
    return
  }

  // count sale
  let count = buildCountFromSale(price)
  count.save()

  // load entities
  let nft = NFT.load(nftId)

  // save sale
  let saleId = BigInt.fromI32(count.salesTotal).toString()
  let sale = new Sale(saleId)
  sale.type = type
  sale.buyer = buyer
  sale.seller = seller
  sale.price = price
  sale.nft = nftId
  sale.timestamp = timestamp
  sale.txHash = txHash
  sale.searchTokenId = nft.tokenId
  sale.searchContractAddress = nft.contractAddress
  sale.save()

  // update buyer account
  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  buyerAccount.save()

  // update seller account
  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price)
  sellerAccount.save()

  // update nft
  nft.soldAt = timestamp
  nft.sales += 1
  nft.volume = nft.volume.plus(price)
  nft.updatedAt = timestamp
  nft.save()
}
