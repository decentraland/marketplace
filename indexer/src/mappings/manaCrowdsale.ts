import { Address } from '@graphprotocol/graph-ts'

import { Finalized } from '../types/MANACrowdsale/MANACrowdsale'
import { ERC721 } from '../types/templates'
import {
  LANDRegistry,
  EstateRegistry,
  ERC721Collection_halloween_2019,
  ERC721Collection_exclusive_masks
} from '../modules/contract/addresses'

export function handleFinalized(_: Finalized): void {
  ERC721.create(Address.fromString(LANDRegistry))
  ERC721.create(Address.fromString(EstateRegistry))
  ERC721.create(Address.fromString(ERC721Collection_halloween_2019))
  ERC721.create(Address.fromString(ERC721Collection_exclusive_masks))
}
