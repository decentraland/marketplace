import { ChainId, PeriodCreation } from '@dcl/schemas'
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import {
  getConnectedProvider,
  getSigner
} from 'decentraland-dapps/dist/lib/eth'
import { BigNumber, ethers } from 'ethers'
import {
  ContractData,
  ContractName,
  getContract
} from 'decentraland-transactions'
import { PeriodOption } from './types'

export const daysByPeriod: Record<PeriodOption, number> = {
  [PeriodOption.ONE_WEEK]: 7,
  [PeriodOption.ONE_MONTH]: 30,
  [PeriodOption.TWO_MONTHS]: 60,
  [PeriodOption.QUARTER_YEAR]: 90,
  [PeriodOption.HALF_YEAR]: 180,
  [PeriodOption.ONE_YEAR]: 365
}

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
    salt: ethers.utils.hexZeroPad(ethers.utils.hexlify(chainId), 32)
  }

  const types: Record<string, TypedDataField[]> = {
    Listing: [
      { name: 'signer', type: 'address' },
      { name: 'contractAddress', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'expiration', type: 'uint256' },
      { name: 'nonces', type: 'uint256[]' },
      { name: 'pricePerDay', type: 'uint256[]' },
      { name: 'maxDays', type: 'uint256[]' },
      { name: 'minDays', type: 'uint256[]' }
    ]
  }

  const values = {
    signer: address.toLowerCase(),
    contractAddress: contractAddress.toLowerCase(),
    tokenId,
    expiration: ((expiration / 1000) | 0).toString(),
    nonces,
    pricePerDay: periods.map(period => period.pricePerDay.toString()),
    maxDays: periods.map(period => period.maxDays.toString()),
    minDays: periods.map(period => period.minDays.toString())
  }

  const signature = await signer._signTypedData(domain, types, values)

  console.log(domain, types, values, signature)

  const signingAddress = ethers.utils.verifyTypedData(
    domain,
    types,
    values,
    signature
  )

  console.log('signingAddress', signingAddress, address === signingAddress)

  return signature
}

async function getRentalsContractInstance(chainId: ChainId) {
  const provider = await getConnectedProvider()
  if (!provider) {
    throw new Error('Could not get connected provider')
  }
  const { address, abi } = getContract(ContractName.Rentals, chainId)
  const instance = new ethers.Contract(
    address,
    abi,
    new ethers.providers.Web3Provider(provider)
  )
  return instance
}

export async function getAssetNonce(
  chainId: ChainId,
  contractAddress: string,
  tokenId: string,
  signerAddress: string
) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.assetNonce(
    contractAddress,
    tokenId,
    signerAddress
  )
  return nonce.toString()
}

export async function getSignerNonce(chainId: ChainId, signerAddress: string) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.signerNonce(signerAddress)
  return nonce.toString()
}

export async function getContractNonce(chainId: ChainId) {
  const rentals = await getRentalsContractInstance(chainId)
  const nonce: BigNumber = await rentals.contractNonce()
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
