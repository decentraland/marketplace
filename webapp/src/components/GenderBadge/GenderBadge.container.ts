import { BodyShape, WearableGender } from '@dcl/schemas'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isGender, isUnisex } from '../../modules/nft/utils'
import { locations } from '../../modules/routing/locations'
import GenderBadge from './GenderBadge'
import { MapDispatchProps, OwnProps } from './GenderBadge.types'

const mapDispatch = (
  dispatch: Dispatch,
  { bodyShapes, assetType, section }: OwnProps
): MapDispatchProps => ({
  onClick: () =>
    dispatch(
      push(
        locations.browse({
          assetType,
          section,
          wearableGenders: isUnisex(bodyShapes)
            ? [WearableGender.MALE, WearableGender.FEMALE]
            : isGender(bodyShapes, BodyShape.MALE)
            ? [WearableGender.MALE]
            : [WearableGender.FEMALE]
        })
      )
    )
})

export default connect(null, mapDispatch)(GenderBadge)
