import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import RarityBadge from './RarityBadge'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { MapDispatchProps, OwnProps } from './RarityBadge.types'

const mapDispatch = (
  dispatch: Dispatch,
  { rarity, assetType }: OwnProps
): MapDispatchProps => ({
  onClick: () =>
    dispatch(
      push(
        locations.browse({
          assetType: assetType,
          section: Section.WEARABLES,
          wearableRarities: [rarity]
        })
      )
    )
})

export default connect(null, mapDispatch)(RarityBadge)
