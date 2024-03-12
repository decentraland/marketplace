import { Dispatch } from 'redux'
import { Tile } from '../Atlas.types'

export type Props = {
  x: number
  y: number
  visible: boolean
  tile: Tile
  position: 'left' | 'right'
}

export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'x' | 'y' | 'visible' | 'tile'>
