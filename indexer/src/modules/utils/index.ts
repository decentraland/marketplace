import { BigInt } from "@graphprotocol/graph-ts";

export let ONE_MILLION = BigInt.fromI32(1000000);

export function toLowerCase(str: string): string {
  let result = ''

  for (let i = 0; i < str.length; i++) {
    let character = str[i]
    let charCode = character.charCodeAt(0)
    if (charCode > 64 && charCode < 91) {
      result += String.fromCharCode(charCode + 32)
    } else {
      result += character
    }
  }

  return result
}
