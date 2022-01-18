import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import SmartBadge from './SmartBadge'
import { MapDispatchProps, OwnProps } from './SmartBadge.types'

const mapDispatch = (
  dispatch: Dispatch,
  { assetType }: OwnProps
): MapDispatchProps => ({
  onClick: () =>
    dispatch(
      push(
        locations.browse({
          assetType,
          section: Section.WEARABLES,
          onlySmart: true
        })
      )
    )
})

export default connect(null, mapDispatch)(SmartBadge)
