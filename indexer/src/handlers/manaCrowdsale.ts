import { Address } from '@graphprotocol/graph-ts'

import { Finalized } from '../entities/MANACrowdsale/MANACrowdsale'
import { ERC721 } from '../entities/templates'
import {
  LANDRegistry,
  EstateRegistry,
  Halloween2019Collection,
  ExclusiveMasksCollection,
  Xmas2019Collection
} from '../modules/contract/addresses'

export function handleFinalized(_: Finalized): void {
  ERC721.create(Address.fromString(LANDRegistry))
  ERC721.create(Address.fromString(EstateRegistry))
  ERC721.create(Address.fromString(Halloween2019Collection))
  ERC721.create(Address.fromString(ExclusiveMasksCollection))
  ERC721.create(Address.fromString(Xmas2019Collection))
}
