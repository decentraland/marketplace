import { RootState } from '../reducer'
import { getState } from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'
import { FeatureName } from './types'

export const getRankingsFeatureVariant = (state: RootState) => {
  try {
    const features = getState(state)
    return features.data[ApplicationName.MARKETPLACE].variants[
      `${ApplicationName.MARKETPLACE}-${FeatureName.RANKINGS}`
    ]
  } catch (e) {
    return false
  }
}
