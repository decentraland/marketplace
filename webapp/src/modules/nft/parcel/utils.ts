export function getId(x: number | string, y: number | string) {
  return x + ',' + y
}

export function buildExplorerUrl(x: string | number, y: string | number) {
  return `https://play.decentraland.org/?position=${x},${y}`
}
