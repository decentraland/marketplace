import { BigNumber, ethers } from 'ethers'
import add from 'date-fns/add'
import {
  ChainId,
  PeriodCreation,
  RentalListing,
  RentalListingPeriod,
  RentalStatus
} from '@dcl/schemas'
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { config } from '../../config'
import { VendorName } from '../vendor'
import { rentalsAPI } from '../vendor/decentraland/rentals/api'
import { addressEquals } from '../wallet/utils'
import { Asset } from '../asset/types'
import { NFT } from '../nft/types'
import { PeriodOption } from './types'
import { getRentalsContractInstance } from './contract'

export const daysByPeriod: Record<PeriodOption, number> = {
  [PeriodOption.ONE_DAY]: 1,
  [PeriodOption.ONE_WEEK]: 7,
  [PeriodOption.ONE_MONTH]: 30,
  [PeriodOption.TWO_MONTHS]: 60,
  [PeriodOption.QUARTER_YEAR]: 90,
  [PeriodOption.HALF_YEAR]: 180,
  [PeriodOption.ONE_YEAR]: 365
}

export const periodsByDays = (Object.keys(
  daysByPeriod
) as PeriodOption[]).reduce((acc, period) => {
  acc[daysByPeriod[period]] = period
  return acc
}, {} as Record<number, PeriodOption>)

export async function getSignature(
  chainId: ChainId,
  contractAddress: string,
  tokenId: string,
  nonces: string[],
  periods: PeriodCreation[],
  expiration: number
) {
  const signer = (await getSigner()) as ethers.providers.JsonRpcSigner
  const address = await signer.getAddress()

  const rentalsContract: ContractData = getContract(
    ContractName.Rentals,
    chainId
  )

  const domain: TypedDataDomain = {
    name: rentalsContract.name,
    verifyingContract: rentalsContract.address,
    version: rentalsContract.version,
    chainId: ethers.utils.hexZeroPad(ethers.utils.hexlify(chainId), 32)
  }

  const types: Record<string, TypedDataField[]> = {
    Listing: [
      { name: 'signer', type: 'address' },
      { name: 'contractAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'expiration', type: 'uint256' },
      { name: 'indexes', type: 'uint256[3]' },
      { name: 'pricePerDay', type: 'uint256[]' },
      { name: 'maxDays', type: 'uint256[]' },
      { name: 'minDays', type: 'uint256[]' },
      { name: 'target', type: 'address' }
    ]
  }

  const values = {
    signer: address.toLowerCase(),
    contractAddress: contractAddress.toLowerCase(),
    tokenId,
    expiration: ((expiration / 1000) | 0).toString(),
    indexes: nonces,
    pricePerDay: periods.map(period => period.pricePerDay),
    maxDays: periods.map(period => period.maxDays.toString()),
    minDays: periods.map(period => period.minDays.toString()),
    target: ethers.constants.AddressZero
  }

  const signature = await signer._signTypedData(domain, types, values)

  return signature
}

export async function getAssetNonce(
  chainId: ChainId,
  contractAddress: string,
  tokenId: string,
  signerAddress: string
) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.getAssetIndex(
    contractAddress,
    tokenId,
    signerAddress
  )
  return nonce.toString()
}

export async function getSignerNonce(chainId: ChainId, signerAddress: string) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.getSignerIndex(signerAddress)
  return nonce.toString()
}

export async function getContractNonce(chainId: ChainId) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.getContractIndex()
  return nonce.toString()
}

export async function getNonces(
  chainId: ChainId,
  contractAddress: string,
  tokenId: string,
  signerAddress: string
) {
  return Promise.all([
    getContractNonce(chainId),
    getSignerNonce(chainId, signerAddress),
    getAssetNonce(chainId, contractAddress, tokenId, signerAddress)
  ])
}

export function getOpenRentalId(asset: Asset | null): string | null {
  return (asset as NFT | null)?.openRentalId ?? null
}

export function getMaxPriceOfPeriods<
  T extends { periods: RentalListing['periods'] }
>(rental: T): string {
  return rental.periods.reduce(
    (maxPeriodPrice, period) =>
      BigNumber.from(maxPeriodPrice).gte(period.pricePerDay)
        ? maxPeriodPrice
        : period.pricePerDay,
    '0'
  )
}

/**
 * Returns the chosen rental period of an active rental.
 * @throws Will throw if the rental hasn't started yet.
 * @param rental - A rental listing.
 */
export function getRentalChosenPeriod(
  rental: RentalListing
): RentalListingPeriod {
  const rentalPeriod = rental.periods.find(
    period => period.maxDays === rental.rentedDays
  )
  if (!rentalPeriod) {
    throw Error('Rental period was not found')
  }

  return rentalPeriod
}

/**
 * Returns the end date of a rental.
 * @param rental - A rental listing.
 * @param period - A period of the rental listing.
 * @returns the end date of the rental or null if the rental has not started.
 */
export function getRentalEndDate(rental: RentalListing): Date | null {
  return rental.startedAt && rental.rentedDays
    ? add(rental.startedAt, { days: rental.rentedDays })
    : null
}

/**
 * Checks wether a the listing of an NFT is executed, meaning that is currently on rent.
 * @param rental - A rental listing.
 * @returns true if the rental exists and is being rented, false otherwise
 */
export function isRentalListingExecuted(rental: RentalListing | null) {
  return rental !== null && rental.status === RentalStatus.EXECUTED
}

/**
 * Checks wether a the listing of an NFT is open.
 * @param rental - A rental listing.
 * @returns true if the rental listing exists and is open, false otherwise
 */
export function isRentalListingOpen(rental: RentalListing | null) {
  return rental !== null && rental.status === RentalStatus.OPEN
}

export function isRentalListingCancelled(rental: RentalListing | null) {
  return rental !== null && rental.status === RentalStatus.CANCELLED
}

/**
 * Checks wether a new rental listing can be created on an asset.
 * @param rental - A rental listing or null if it doesn't have one.
 * @returns true if the rental listing exists and is open, false otherwise
 */
export function canCreateANewRental(rental: RentalListing | null) {
  return (
    rental === null ||
    (rental !== null &&
      (isRentalListingCancelled(rental) ||
        (isRentalListingExecuted(rental) && hasRentalEnded(rental))))
  )
}

/**
 * Checks wether a rental has already ended it's renting time.
 * @param rental - A rental listing.
 * @returns true if the rental end date is set and the rental has already passed its renting time, false otherwise.
 */
export function hasRentalEnded(rental: RentalListing): boolean {
  const endDate = getRentalEndDate(rental)
  return endDate ? endDate.getTime() <= Date.now() : false
}

/**
 * Checks wether a LAND/Estate can be claimed
 * @param rental - A rental listing.
 * @returns true if the rental if the Rental has status `EXECUTED` and the rental ended or if the Rental has status `OPEN` OR `CANCELLED`
 * but the rental contract is still owning the NFT from a past rental
 */
export function canBeClaimed(
  userAddress: string,
  rental: RentalListing,
  asset: Asset
): boolean {
  if (addressEquals(userAddress, (asset as NFT).owner)) {
    return false // the user is the owner, there's nothing to be claimed
  }
  if (rental.status === RentalStatus.EXECUTED) {
    const endDate = getRentalEndDate(rental)
    return endDate ? endDate.getTime() <= Date.now() : false
  } else if (
    (isRentalListingOpen(rental) || isRentalListingCancelled(rental)) &&
    userAddress === rental.lessor
  ) {
    const rentalsContract: ContractData = getContract(
      ContractName.Rentals,
      (asset as NFT).chainId
    )
    // can only be claimed from the contract address
    // this avoids the case where the asset was transfer with an open rental
    return addressEquals(rentalsContract.address, (asset as NFT).owner)
  }
  return false
}

/**
 * Checks wether a LAND/Estate is locked from doing transfers, accepting bids or operating with orders.
 * @param rental - A rental listing.
 * @returns true if the rental if the Rental has status `EXECUTED` or if the Rental can be claimed.
 */
export function isLandLocked(
  userAddress: string,
  rental: RentalListing,
  asset: Asset
) {
  return (
    rental.status === RentalStatus.EXECUTED ||
    canBeClaimed(userAddress, rental, asset)
  )
}

async function delay(milliseconds: number) {
  return await new Promise<void>(resolve => setTimeout(resolve, milliseconds))
}

export async function waitUntilRentalChangesStatus(
  nft: NFT<VendorName>,
  status: RentalStatus
) {
  let hasChanged = false
  let listing: RentalListing
  while (!hasChanged) {
    await delay(Number(config.get('REFRESH_SIGNATURES_DELAY', '5000')))
    listing = await rentalsAPI.refreshRentalListing(nft.openRentalId!)
    hasChanged = listing.status === status
  }
  return listing!
}

/**
 * Gets the last byte as a number from the a signature.
 * @param signature - A ECDSA signature.
 * @returns the last byte of the given signature.
 */
function getLastECDSASignatureByte(signature: string) {
  return Number.parseInt(signature.slice(-2), 16)
}

/**
 * Checks wether a ECDSA signature has a valid V.
 * @param signature - A ECDSA signature.
 * @returns true if the v value is decimal 27 or 28 else otherwise.
 */
function hasECDSASignatureAValidV(signature: string): boolean {
  const lastSignatureByte = getLastECDSASignatureByte(signature)
  return lastSignatureByte === 27 || lastSignatureByte === 28
}

/**
 * Generates an ECDSA signature with a valid V from another signature by changing its V value to 27 or 28 if it was 0 or 1.
 * @param signature - A ECDSA signature.
 * @returns a ECDSA signature based on the given one with its V value as 27 or 28.
 */
export function generateECDSASignatureWithValidV(signature: string): string {
  const isSignatureVValid = hasECDSASignatureAValidV(signature)
  return isSignatureVValid
    ? signature
    : signature.slice(0, -2) +
        (getLastECDSASignatureByte(signature) + 27).toString(16)
}
