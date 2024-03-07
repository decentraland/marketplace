export type Props = {
  parcelCoordinates: { x: number; y: number }[]
  total: number
}

export type MapStateProps = Pick<Props, 'parcelCoordinates'>
