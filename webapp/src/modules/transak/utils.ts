export function encodeTokenId(itemId: number, issuedId: number): bigint {
  const MAX_ITEM_ID = BigInt('0xFFFFFFFFFF') // 40 bits max value
  const MAX_ISSUED_ID = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') // 216 bits max value

  if (BigInt(itemId) > MAX_ITEM_ID) {
    throw new Error('encodeTokenId: INVALID_ITEM_ID')
  }

  if (BigInt(issuedId) > MAX_ISSUED_ID) {
    throw new Error('encodeTokenId: INVALID_ISSUED_ID')
  }

  // Shift the itemId left by 216 bits and OR it with issuedId
  return (BigInt(itemId) << BigInt(216)) | BigInt(issuedId)
}
