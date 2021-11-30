import { getAssetName } from '../../../../modules/asset/utils'

export type Props = {
  asset: Parameters<typeof getAssetName>[0]
}
