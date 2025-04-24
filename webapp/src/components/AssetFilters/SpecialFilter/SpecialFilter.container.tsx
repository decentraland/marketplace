import { connect } from 'react-redux'
import { getIsCreditsEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { getOnlySmart, getWithCredits } from '../../../modules/routing/selectors'
import { SpecialFilter, SpecialFilterProps } from './SpecialFilter'

export type MapStateProps = {
  isOnlySmart?: boolean
  withCredits?: boolean
  isCreditsEnabled: boolean
}

export type OwnProps = Omit<SpecialFilterProps, 'isOnlySmart' | 'withCredits' | 'isCreditsEnabled'>

const mapState = (state: RootState): MapStateProps => {
  return {
    isOnlySmart: getOnlySmart(state),
    withCredits: getWithCredits(state),
    isCreditsEnabled: getIsCreditsEnabled(state)
  }
}

export default connect(mapState)(SpecialFilter)
