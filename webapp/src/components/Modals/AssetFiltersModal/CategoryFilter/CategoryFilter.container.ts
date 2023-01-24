import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getView } from '../../../../modules/ui/browse/selectors';
import { getAssetType, getSection } from '../../../../modules/routing/selectors';
import { Section } from '../../../../modules/vendor/routing/types';
import { MapStateProps, OwnProps } from './CategoryFilter.types';
import { CategoryFilter } from './CategoryFilter'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values } = ownProps;
  return {
    section: 'section' in values ? values.section as Section : getSection(state),
    assetType: 'assetType' in values ? values.assetType : getAssetType(state),
    view: getView(state)
  }
}

export default connect(mapState)(CategoryFilter)
