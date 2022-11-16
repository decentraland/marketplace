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
import { Asset } from '../asset/types'
import { NFT } from '../nft/types'
import { PeriodOption, PeriodOptionsDev } from './types'
import { getRentalsContractInstance } from './contract'

export const daysByPeriod: Record<PeriodOption, number> = {
  [PeriodOptionsDev.ONE_DAY]: 1,
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

export function getMaxPriceOfPeriods(rental: RentalListing): string {
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
export function isBeingRented(rental: RentalListing | null) {
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

/**
 * Checks wether a rental has already ended it's renting time.
 * @param rental - A rental listing.
 * @returns true if the rental end date is set and the rental has already passed its renting time, false otherwise.
 */
export function hasRentalEnded(rental: RentalListing): boolean {
  const endDate = getRentalEndDate(rental)
  return endDate ? endDate.getTime() <= Date.now() : false
}
