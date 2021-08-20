import { ProximityTags } from '../ProximityTags'
import { Props } from './EstateTags.types'
import './EstateTags.css'

const EstateTags = (props: Props) => {
  const { nft } = props
  const estate = nft.data.estate!
  return (
    <div className="EstateTags tags">
      <div className="size">{estate.size.toLocaleString()} LAND</div>
      <ProximityTags nft={nft} />
    </div>
  )
}

export default EstateTags
