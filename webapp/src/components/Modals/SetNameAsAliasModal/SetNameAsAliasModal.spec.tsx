import { RenderResult, fireEvent } from '@testing-library/react'
import { AvatarInfo, Profile } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import SetNameAsAliasModal from './SetNameAsAliasModal'

describe('SetNameAsAliasModal', () => {
  const previousName = 'previous name'
  const newName = 'John Doe'
  const mockProps = {
    name: 'Modal Name',
    address: '0x1234567890',
    profile: {
      avatars: [
        {
          name: previousName,
          hasClaimedName: false,
          avatar: {
            snapshots: []
          } as unknown as AvatarInfo
        }
      ]
    } as Profile,
    metadata: {
      name: newName
    },
    isLoading: false,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onAuthorizedAction: jest.fn(),
    onCloseAuthorization: jest.fn(),
    isLoadingAuthorization: false
  }

  describe('when the alias is not set yet', () => {
    let screen: RenderResult
    beforeEach(() => {
      screen = renderWithProviders(<SetNameAsAliasModal {...mockProps} />)
    })
    it('renders the modal with the base title', () => {
      const { getByText } = screen
      expect(getByText(t('set_name_as_alias_modal.title'))).toBeInTheDocument()
    })
    it('renders both names showing how it will be changed', () => {
      const { getByText } = screen
      expect(getByText(newName)).toBeInTheDocument()
      expect(getByText(`${previousName}#${mockProps.address.slice(-4)}`)).toBeInTheDocument()
    })
    it('renders the correct actions', () => {
      const { getByText } = screen
      expect(getByText(t('global.cancel'))).toBeInTheDocument()
      expect(getByText(t('global.confirm'))).toBeInTheDocument()
    })
    it('clicking Confirm should call onSubmit', () => {
      const { getByText } = screen
      const confirmButton = getByText(t('global.confirm'))
      fireEvent.click(confirmButton)
      expect(mockProps.onSubmit).toHaveBeenCalledWith(mockProps.address, newName)
    })
  })

  describe('when the alias is set', () => {
    let updatedProfile: Profile
    let screen: RenderResult
    beforeEach(() => {
      updatedProfile = {
        avatars: [
          {
            name: newName,
            hasClaimedName: true,
            avatar: {
              snapshots: []
            } as unknown as AvatarInfo
          }
        ]
      } as Profile
      screen = renderWithProviders(<SetNameAsAliasModal {...mockProps} profile={updatedProfile} />)
    })
    it('renders the success title when the alias is set', () => {
      const { getByText } = screen
      expect(getByText(t('set_name_as_alias_modal.success_title'))).toBeInTheDocument()
    })
    it('should render the new name and the checked icon', () => {
      const { getAllByText, getByAltText } = screen
      expect(getAllByText(newName).length).toBeGreaterThan(0)
      expect(getByAltText('verified icon')).toBeInTheDocument()
    })
    it('should render the Finish button', () => {
      const { getByText } = screen
      expect(getByText(t('global.finish'))).toBeInTheDocument()
    })
    describe('and the Finish button is clicked', () => {
      it('should call onClose', () => {
        const { getByText } = screen
        const finishButton = getByText(t('global.finish'))
        fireEvent.click(finishButton)
        expect(mockProps.onClose).toHaveBeenCalled()
      })
    })
  })

  describe('when the user has no profile yet', () => {
    it('should render the guest name', () => {
      const { getByText } = renderWithProviders(<SetNameAsAliasModal {...mockProps} profile={undefined} />)
      expect(getByText(`${t('global.guest')}#4567`)).toBeInTheDocument()
    })
  })
})
