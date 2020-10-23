export function getBidId(
  contractAddress: string,
  tokenId: string,
  bidder: string
): string {
  return contractAddress + '-' + tokenId + '-' + bidder
}
