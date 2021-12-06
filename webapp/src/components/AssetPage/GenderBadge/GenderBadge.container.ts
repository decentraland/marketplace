import { BodyShape, WearableGender } from '@dcl/schemas'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isGender, isUnisex } from '../../../modules/nft/wearable/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import GenderBadge from './GenderBadge'
import { MapDispatchProps, OwnProps } from './GenderBadge.types'

const mapDispatch = (
  dispatch: Dispatch,
  { wearable, assetType }: OwnProps
): MapDispatchProps => ({
  onClick: () =>
    dispatch(
      push(
        locations.browse({
          assetType,
          section: Section.WEARABLES,
          wearableGenders: isUnisex(wearable)
            ? [WearableGender.MALE, WearableGender.FEMALE]
            : isGender(wearable, BodyShape.MALE)
            ? [WearableGender.MALE]
            : [WearableGender.FEMALE]
        })
      )
    )
})

export default connect(null, mapDispatch)(GenderBadge)
