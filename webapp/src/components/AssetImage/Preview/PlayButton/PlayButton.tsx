import React, { useCallback, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon } from 'decentraland-ui'
import { Button as ButtonMUI, ButtonGroup, Menu, MenuItem } from 'decentraland-ui2'
import { PlayButtonProps } from './PlayButton.types'

const MENU_ANCHOR_ORIGIN = {
  vertical: 'top' as const,
  horizontal: 'left' as const
}

const MENU_TRANSFORM_ORIGIN = {
  vertical: 'bottom' as const,
  horizontal: 'left' as const
}

export const PlayButton = React.memo<PlayButtonProps>(({ isPlaying, onToggle, socialEmoteAnimations, onSelectAnimation }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

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
      <Button className="play-button" size="small" onClick={onToggle}>
        {isPlaying ? <Icon name="stop" /> : <Icon name="play" />}
        <span>{isPlaying ? t('wearable_preview.stop_emote') : t('wearable_preview.play_emote')}</span>
      </Button>
      <ButtonMUI
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
      </ButtonMUI>
      <Menu
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
            <MenuItem key={option.title} selected={isSelected} onClick={event => handleSelectAnimation(event, index)}>
              <Icon className={classNames('check-icon', { visible: isSelected })} name="check" />
              {option.title}
            </MenuItem>
          )
        })}
      </Menu>
    </ButtonGroup>
  )
})
