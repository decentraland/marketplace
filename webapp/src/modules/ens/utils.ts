import { ethers } from 'ethers'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'
import { config } from '../../config'

const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

export const PRICE_IN_WEI = '100000000000000000000' // 100 MANA
export const PRICE = ethers.utils.formatEther(PRICE_IN_WEI)
export const MAX_NAME_SIZE = 15
export const MIN_NAME_SIZE = 2

const nameRegex = new RegExp(`^([a-zA-Z0-9]){2,${MAX_NAME_SIZE}}$`)

export function getDomainFromName(name: string): string {
  return `${name.toLowerCase()}.dcl.eth`
}

export async function isNameAvailable(name: string): Promise<boolean> {
  if (!name) {
    return false
  }
  const signer: ethers.Signer = await getSigner()
  const contractDCLRegistrar = DCLRegistrar__factory.connect(
    REGISTRAR_ADDRESS,
    signer
  )
  return contractDCLRegistrar.available(name)
}

export function isNameValid(name: string): boolean {
  return nameRegex.test(name)
}

export function hasNameMinLength(name: string): boolean {
  return name.length >= MIN_NAME_SIZE
}

export function isEnoughClaimMana(mana: number) {
  // 100 is the minimum amount of MANA the user needs to claim a new Name
  // We're checking against this instead of 0 when checking the allowance too because
  // we do not yet support the double transaction needed to set the user's allowance to 0 first and then bump it up to wichever number
  return mana >= 100
}
