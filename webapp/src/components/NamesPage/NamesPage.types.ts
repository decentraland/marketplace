export type Props = {
  isFullscreen: boolean
  isMap: boolean
  onBrowse: () => void
}

export type MapStateProps = Pick<Props, 'isMap' | 'isFullscreen'>
