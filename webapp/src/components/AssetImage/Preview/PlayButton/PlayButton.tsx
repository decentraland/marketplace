import React, { useCallback, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ButtonGroup } from 'decentraland-ui2'
import { PlayButton as StyledPlayButton, AnimationsButton, StyledMenu, StyledMenuItem, StyledCheckIcon } from './PlayButton.styled'
import { PlayButtonProps } from './PlayButton.types'

const MENU_ANCHOR_ORIGIN = {
  vertical: 'top' as const,
  horizontal: 'left' as const
}

const MENU_TRANSFORM_ORIGIN = {
  vertical: 'bottom' as const,
  horizontal: 'left' as const
}

export const PlayButton = React.memo<PlayButtonProps>(
  ({ isPlaying, onToggle, socialEmoteAnimations, selectedAnimation, onSelectAnimation }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(
      selectedAnimation ? socialEmoteAnimations.findIndex(animation => animation.title === selectedAnimation.title) : 0
    )

    const open = Boolean(anchorEl)
    const hasAnimations = socialEmoteAnimations.length > 0

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }, [])

    const handleClose = useCallback(() => {
      setAnchorEl(null)
    }, [])

    const handleSelectAnimation = useCallback(
      (_event: React.MouseEvent<HTMLElement>, index: number) => {
        // Validate index bounds before accessing array
        if (index >= 0 && index < socialEmoteAnimations.length) {
          onSelectAnimation(socialEmoteAnimations[index])
          setSelectedIndex(index)
          setAnchorEl(null)
        }
      },
      [socialEmoteAnimations, onSelectAnimation]
    )

    return (
      <ButtonGroup className="social-emote-controls">
        <StyledPlayButton size="small" onClick={onToggle}>
          {isPlaying ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
          <span>{isPlaying ? t('wearable_preview.stop_emote') : t('wearable_preview.play_emote')}</span>
        </StyledPlayButton>
        <AnimationsButton
          id="social-emote-animations-button"
          aria-controls={open ? 'social-emote-animations-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="Select animation"
          variant="contained"
          disableElevation
          disabled={!hasAnimations}
          onClick={handleClick}
        >
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </AnimationsButton>
        <StyledMenu
          id="social-emote-animations-menu"
          MenuListProps={{
            'aria-labelledby': 'social-emote-animations-button'
          }}
          anchorOrigin={MENU_ANCHOR_ORIGIN}
          transformOrigin={MENU_TRANSFORM_ORIGIN}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {socialEmoteAnimations.map((option, index) => {
            const isSelected = index === selectedIndex
            return (
              <StyledMenuItem key={option.title} selected={isSelected} onClick={event => handleSelectAnimation(event, index)}>
                <StyledCheckIcon className={classNames({ visible: isSelected })} />
                {option.title}
              </StyledMenuItem>
            )
          })}
        </StyledMenu>
      </ButtonGroup>
    )
  }
)
