import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { locations } from '../../modules/routing/locations'
import { getSectionFromCategory } from '../../modules/routing/search'
import { MapDispatchProps, OwnProps } from './RarityBadge.types'
import RarityBadge from './RarityBadge'

const mapDispatch = (
  dispatch: Dispatch,
  { rarity, category, assetType }: OwnProps
): MapDispatchProps => ({
  onClick: () =>
    dispatch(
      push(
        locations.browse({
          assetType: assetType,
          section: getSectionFromCategory(category),
          rarities: [rarity]
        })
      )
    )
})

export default connect(null, mapDispatch)(RarityBadge)
