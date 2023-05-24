import { renderWithProviders } from '../../utils/test'
import UserMenu from './UserMenu'
import { Props as UserMenuProps } from './UserMenu.types'

function renderUserMenu(props: Partial<UserMenuProps> = {}) {
  return renderWithProviders(
    <UserMenu
      onClickMyAssets={jest.fn()}
      onClickMyLists={jest.fn()}
      isSignedIn
      {...props}
    />
  )
}

describe('UserMenu', () => {
  it('should render the My Assets option in the menu', () => {
    const { getByTestId } = renderUserMenu()
    expect(getByTestId('my-assets')).toBeInTheDocument()
  })

  it('should render the My Lists option in the menu', () => {
    const { getByTestId } = renderUserMenu()
    expect(getByTestId('my-lists')).toBeInTheDocument()
  })
})
