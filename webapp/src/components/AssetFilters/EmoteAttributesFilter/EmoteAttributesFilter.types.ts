import { EmoteOutcomeType, EmotePlayMode } from '@dcl/schemas'

export type Props = {
  emotePlayMode?: EmotePlayMode[]
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
  emoteOutcomeType?: EmoteOutcomeType
  onChange: (value: {
    emotePlayMode?: EmotePlayMode[]
    emoteHasSound?: boolean
    emoteHasGeometry?: boolean
    emoteOutcomeType?: EmoteOutcomeType
  }) => void
  defaultCollapsed?: boolean
  isSocialEmotesEnabled?: boolean
}
