import { Tile } from '../../../Atlas/Atlas.types'

export type Props = {
  estateId: string
  parcelCoordinates: Tile[]
}

export type OwnProps = Pick<Props, 'estateId'>

export type MapStateProps = Pick<Props, 'parcelCoordinates'>
