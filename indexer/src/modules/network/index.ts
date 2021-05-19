import { dataSource } from '@graphprotocol/graph-ts'

export function getURNNetwork(): string {
  let network = dataSource.network()
  return network == "mainnet" ? "ethereum" : network
}