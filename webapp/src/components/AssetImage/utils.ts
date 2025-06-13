type Color = { r: number; g: number; b: number }
type WrappedColor = { color: Color }

const DEFAULT_COLOR = 'bbbbbb'

const valueToHex = (value: number) => ('00' + Math.min(255, (value * 255) | 0).toString(16)).slice(-2)

const isColor = (maybeColor: Partial<Color>) =>
  typeof maybeColor.r === 'number' && typeof maybeColor.g === 'number' && typeof maybeColor.b === 'number'

const isWrapped = (maybeWrapped: Partial<WrappedColor>) => maybeWrapped.color && isColor(maybeWrapped.color)

export const colorToHex = (color: Color): string => {
  if (isColor(color)) {
    return valueToHex(color.r) + valueToHex(color.g) + valueToHex(color.b)
  }
  const maybeWrapped = color as unknown as Partial<WrappedColor>
  if (isWrapped(maybeWrapped)) {
    return colorToHex(maybeWrapped.color!)
  }

  return DEFAULT_COLOR
}

export const getEthereumItemUrn = (asset: { contractAddress: string; itemId: string }) => {
  return `urn:decentraland:ethereum:collections-v2:${asset.contractAddress}:${asset.itemId}`
}
