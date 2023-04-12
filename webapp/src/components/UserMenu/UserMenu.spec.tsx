import { renderWithProviders } from '../../utils/test'
import UserMenu from './UserMenu'
import { Props as UserMenuProps } from './UserMenu.types'

function renderUserMenu(props: Partial<UserMenuProps> = {}) {
  return renderWithProviders(
    <UserMenu
      onClickMyAssets={jest.fn()}
      onClickMyLists={jest.fn()}
      isFavoritesEnabled={false}
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

  describe('when the favorites features is disabled', () => {
    it('should not render the My Lists option in the menu', () => {
      const { queryByTestId } = renderUserMenu()
      expect(queryByTestId('my-lists')).not.toBeInTheDocument()
    })
  })

  describe('when the favorites features is enabled', () => {
    it('should render the My Lists option in the menu', () => {
      const { getByTestId } = renderUserMenu({ isFavoritesEnabled: true })
      expect(getByTestId('my-lists')).toBeInTheDocument()
    })
  })
})
