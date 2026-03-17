import { config } from '../../../config'

export function getId(x: number | string, y: number | string) {
  return x + ',' + y
}

export function buildExplorerUrl(x: string | number, y: string | number) {
  return `${config.get('EXPLORER_URL')}/?position=${x},${y}`
}
