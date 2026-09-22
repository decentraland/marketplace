import { ChainId, Network, Order } from '@dcl/schemas'
import { ContractName, getContractName } from 'decentraland-transactions'
import { Asset } from '../asset/types'
import { isNFT } from '../asset/utils'

/**
 * The one registration that existed before V3: Transak registered a single contract per chain, and both V1
 * and V2 were served by it. Named once and referenced twice below so "the same registrations" is a fact of
 * the code rather than a comment above two identical literals.
 */
const PRE_V3_MARKETPLACE_CONTRACT_IDS: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '670660ed2bbeb54123b28728',
    [ChainId.MATIC_MAINNET]: '6717e6cd2fb1688e111c1a80'
  },
  [Network.ETHEREUM]: {
    [ChainId.ETHEREUM_MAINNET]: '672100492fb1688e111c2bd4',
    [ChainId.ETHEREUM_SEPOLIA]: '671a23e92bbeb54123b3b692'
  }
}

/**
 * Transak's own id for each marketplace contract it will execute against. These are registrations on
 * Transak's side, not addresses, so a contract Transak has never been told about simply has no id here.
 *
 * Keyed by marketplace VERSION as well as chain. A trade carries the contract it was signed against, and
 * Transak has to execute `accept` on that same contract — the signature is bound to it. A single id per chain
 * cannot serve two versions at once: pointing it at V3 would break every V2-signed listing, and leaving it on
 * the older one breaks the V3 ones.
 *
 * V3 is deliberately absent until it is registered with Transak. A missing entry fails closed (see below)
 * rather than executing a V3 trade against a pre-V3 registration, which would revert on-chain anyway.
 */
const OffChainMarketplaceContractIds: Partial<
  Record<ContractName, Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM>>
> = {
  [ContractName.OffChainMarketplace]: PRE_V3_MARKETPLACE_CONTRACT_IDS,
  [ContractName.OffChainMarketplaceV2]: PRE_V3_MARKETPLACE_CONTRACT_IDS
}
const CreditsManagerContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '67dd4ceda7e28cc91ce4c391',
    [ChainId.MATIC_MAINNET]: ''
  }
}
const MarketplaceV2ContractIds: Pick<Record<Network, Partial<Record<ChainId, string>>>, Network.MATIC | Network.ETHEREUM> = {
  [Network.MATIC]: {
    [ChainId.MATIC_AMOY]: '670e86dd2bbeb54123b3a2a3',
    [ChainId.MATIC_MAINNET]: '6717e6dac00223b9cc8e51cd'
  },
  [Network.ETHEREUM]: {
    [ChainId.ETHEREUM_MAINNET]: '672100572fb1688e111c2bdb',
    [ChainId.ETHEREUM_SEPOLIA]: '671f9815945ac8890fbae4c6'
  }
}

export function encodeTokenId(itemId: number, issuedId: number): bigint {
  const MAX_ITEM_ID = BigInt('0xFFFFFFFFFF') // 40 bits max value
  const MAX_ISSUED_ID = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') // 216 bits max value

  if (BigInt(itemId) > MAX_ITEM_ID) {
    throw new Error('encodeTokenId: INVALID_ITEM_ID')
  }

  if (BigInt(issuedId) > MAX_ISSUED_ID) {
    throw new Error('encodeTokenId: INVALID_ISSUED_ID')
  }

  // Shift the itemId left by 216 bits and OR it with issuedId
  return (BigInt(itemId) << BigInt(216)) | BigInt(issuedId)
}

/** CollectionStore's registration, one per chain. Was inline in the saga; named here so every table is read in one place. */
const COLLECTION_STORE_CONTRACT_IDS: Partial<Record<ChainId, string>> = {
  [ChainId.MATIC_AMOY]: '670e8b512bbeb54123b3a2b4',
  [ChainId.MATIC_MAINNET]: '6717e6e62fb1688e111c1a87'
}

/**
 * What a purchase would execute through, which is what decides the Transak registration it needs.
 *
 * `trade` carries the marketplace the listing was signed against, because Transak calls `accept` on that
 * exact contract and a registration for another version would send it somewhere the signature does not
 * authorise. `order` is a legacy on-chain listing and `mint` a CollectionStore item, each with one
 * registration of its own. Paying with credits replaces all of them: the CreditsManager is the registered
 * contract on that route and it resolves the marketplace from the trade on chain.
 */
type RegisteredNetwork = Network.MATIC | Network.ETHEREUM

/** Transak is registered on these two networks only; anything else has no id by construction. */
const isRegisteredNetwork = (network: Network): network is RegisteredNetwork => network === Network.MATIC || network === Network.ETHEREUM

export type TransakPurchase = { network: Network; chainId: ChainId; useCredits?: boolean } & (
  | { kind: 'trade'; marketplaceAddress?: string | null }
  | { kind: 'order' }
  | { kind: 'mint' }
)

/**
 * Transak's id for the contract this purchase would execute, or undefined when Transak has no registration
 * for it.
 *
 * The one place the tables are read, so what the widget is offered for and what it is opened with cannot
 * disagree: a rail the UI advertises and this cannot answer for is a purchase that fails after the buyer
 * has committed to it.
 */
export function getTransakContractId(purchase: TransakPurchase): string | undefined {
  const { network, chainId, useCredits } = purchase
  if (!isRegisteredNetwork(network)) return undefined
  if (useCredits) {
    return CreditsManagerContractIds[Network.MATIC][chainId] || undefined
  }
  switch (purchase.kind) {
    case 'trade': {
      if (!purchase.marketplaceAddress) return undefined
      let marketplaceName: ContractName
      try {
        marketplaceName = getContractName(purchase.marketplaceAddress)
      } catch {
        // An address the registry does not know is not a marketplace Transak could have registered.
        return undefined
      }
      return OffChainMarketplaceContractIds[marketplaceName]?.[network]?.[chainId]
    }
    case 'order':
      return MarketplaceV2ContractIds[network]?.[chainId]
    case 'mint':
      return COLLECTION_STORE_CONTRACT_IDS[chainId]
  }
}

/**
 * Whether the card rail can be offered for this purchase.
 *
 * Answers for the route the buyer has actually selected, because that is the one the saga executes: the
 * marketplace the listing settles on, or the CreditsManager when they are paying with credits. Either way
 * the question is the same one the saga asks, so what is offered is what can be opened.
 */
export function isTransakSupported(purchase: TransakPurchase): boolean {
  return Boolean(getTransakContractId(purchase))
}

/**
 * What Transak would execute for this listing, derived the same way the saga derives it: an NFT takes its
 * trade from the order, an item from itself, and a listing without one settles on the legacy marketplace or
 * the collection store instead.
 *
 * The marketplace address rides along on the listing already, so asking this costs no request — which is
 * what makes it answerable while the buttons render rather than only once the widget is opening.
 */
export function getTransakPurchase(asset: Asset, order?: Order | null): TransakPurchase {
  const { network, chainId } = asset
  if (isNFT(asset)) {
    return order?.tradeId
      ? { kind: 'trade', network, chainId, marketplaceAddress: order.marketplaceAddress }
      : { kind: 'order', network, chainId }
  }
  return asset.tradeId
    ? { kind: 'trade', network, chainId, marketplaceAddress: asset.tradeContractAddress }
    : { kind: 'mint', network, chainId }
}
