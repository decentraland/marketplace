import { EmotePlayMode } from "@dcl/schemas"

export type Props = {
  emotePlayMode?: EmotePlayMode[]
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
  onChange: (value: {
    emotePlayMode?: EmotePlayMode[]
    emoteHasSound?: boolean
    emoteHasGeometry?: boolean
  }) => void
  defaultCollapsed?: boolean,
  isEmotesV2Enabled: boolean
}

export type MapStateProps = Pick<Props, 'isEmotesV2Enabled'>
