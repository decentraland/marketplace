import { SocialEmoteAnimation } from '@dcl/schemas/dist/dapps/preview/social-emote-animation'

export interface PlayButtonProps {
  isPlaying: boolean
  onToggle: () => void
  socialEmoteAnimations: SocialEmoteAnimation[]
  onSelectAnimation: (animation: SocialEmoteAnimation) => void
}
