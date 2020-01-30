import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export const getDistanceText = (distance: number) =>
  distance === 0 ? t('detail.adjacent') : t('detail.distance', { distance })
