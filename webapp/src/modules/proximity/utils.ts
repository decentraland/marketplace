import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export const getDistance = (distance: number) =>
  distance === 0 ? t('detail.adjacent') : t('detail.distance', { distance })
