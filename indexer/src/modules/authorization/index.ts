import { EthereumEvent } from '@graphprotocol/graph-ts'

export class AuthorizationTypes {
  static operator: string = 'operator'
  static manager: string = 'manager'
}

export function getAuthorizationId(event: EthereumEvent, type: string): string {
  return (
    type +
    '-' +
    event.block.number.toString() +
    '-' +
    event.logIndex.toString() +
    '-'
  )
}
