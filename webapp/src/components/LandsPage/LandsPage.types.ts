export type Props = {
  isFullscreen: boolean
  isMap: boolean
}

export type MapStateProps = Pick<Props, 'isMap' | 'isFullscreen'>
