import { EmotePlayMode } from '@dcl/schemas'

export type Props = {
  emotePlayMode?: EmotePlayMode[]
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
  onChange: (value: { emotePlayMode?: EmotePlayMode[]; emoteHasSound?: boolean; emoteHasGeometry?: boolean }) => void
  defaultCollapsed?: boolean
}
