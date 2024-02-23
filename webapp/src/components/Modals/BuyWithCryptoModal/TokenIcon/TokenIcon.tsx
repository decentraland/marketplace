import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'
import noTokenImage from '../../../../images/no-token.png'
import { Props } from './TokenIcon.types'

export const TokenIcon = (props: Props) => {
  const { src, name } = props

  return (
    <Popup
      content={name}
      style={{ zIndex: 3001 }}
      on="hover"
      position="top center"
      trigger={
        <img height={24} width={24} src={src ?? noTokenImage} alt={name} />
      }
    />
  )
}
