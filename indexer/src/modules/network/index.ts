import { dataSource } from '@graphprotocol/graph-ts'

export function getNetwork(): string {
  let network = dataSource.network()
  return network == "mainnet" ? "ethereum" : network
}