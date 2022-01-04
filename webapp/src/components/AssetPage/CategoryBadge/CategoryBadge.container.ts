import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { locations } from '../../../modules/routing/locations'
import { getSearchWearableSection } from '../../../modules/routing/search'
import CategoryBadge from './CategoryBadge'
import { MapDispatchProps, OwnProps } from './CategoryBadge.types'

const mapDispatch = (
  dispatch: Dispatch,
  { wearable, assetType }: OwnProps
): MapDispatchProps => ({
  onClick: () => {
    const category = wearable.category
    const section = getSearchWearableSection(category)

    if (!section) {
      throw new Error(`Invalid wearable category ${category}`)
    }

    dispatch(push(locations.browse({ assetType, section })))
  }
})

export default connect(null, mapDispatch)(CategoryBadge)
