import { Transfer } from '../types/templates/ERC721/ERC721'
import * as addresses from '../utils/addresses'

export function isMint(event: Transfer): boolean {
  return event.params.from.toHexString() == addresses.Null
}
