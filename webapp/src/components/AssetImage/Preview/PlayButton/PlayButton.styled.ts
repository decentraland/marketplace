import CheckIcon from '@mui/icons-material/Check'
import { styled } from '@mui/material/styles'
import { Button, Menu, MenuItem } from 'decentraland-ui2'

const PlayButton = styled(Button)({
  color: 'black !important',
  backgroundColor: 'var(--text)',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  border: 'none',
  '&:hover': {
    transform: 'none',
    backgroundColor: 'var(--text)',
    border: 'none'
  }
})

const AnimationsButton = styled(Button)({
  minWidth: '10px',
  width: '40px',
  color: 'black !important',
  backgroundColor: 'var(--text) !important',
  borderLeftStyle: 'solid',
  borderLeftWidth: '2px',
  borderTopLeftRadius: '0 !important',
  borderBottomLeftRadius: '0 !important'
})

const StyledMenu = styled(Menu)({
  '& .MuiList-root': {
    backgroundColor: 'var(--text)'
  }
})

const StyledMenuItem = styled(MenuItem)({
  color: 'black',
  fontWeight: 700,
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#5555552e'
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--text) !important'
  }
})

const StyledCheckIcon = styled(CheckIcon)({
  visibility: 'hidden',
  '&.visible': {
    visibility: 'visible'
  }
})

export { PlayButton, AnimationsButton, StyledMenu, StyledMenuItem, StyledCheckIcon }
