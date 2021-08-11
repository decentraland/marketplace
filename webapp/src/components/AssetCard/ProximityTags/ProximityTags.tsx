import { useProximity } from '../../../modules/proximity/hooks'
import { getDistanceText } from '../../../modules/proximity/utils'
import { Props } from './ProximityTags.types'
import './ProximityTags.css'

const ProximityTags = (props: Props) => {
  const { nft, proximities } = props
  const proximity = useProximity(nft, proximities)
  return (
    <>
      {proximity?.plaza !== undefined ? (
        <div
          className="ProximityTag plaza"
          title={getDistanceText(proximity.plaza)}
        />
      ) : null}
      {proximity?.road !== undefined ? (
        <div
          className="ProximityTag road"
          title={getDistanceText(proximity.road)}
        />
      ) : null}
      {proximity?.district !== undefined ? (
        <div
          className="ProximityTag district"
          title={getDistanceText(proximity.district)}
        />
      ) : null}
    </>
  )
}

export default ProximityTags
