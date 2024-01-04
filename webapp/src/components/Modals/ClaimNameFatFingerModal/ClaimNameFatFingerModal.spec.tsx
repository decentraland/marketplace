import { fireEvent, waitFor } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import ClaimNameFatFingerModal from './ClaimNameFatFingerModal'

describe('ClaimNameFatFingerModal', () => {
  const name = 'aNAME'
  const onCloseMock = jest.fn()
  const onClaimMock = jest.fn()
  const onClaimNameClearMock = jest.fn()
  const onAuthorizedActionMock = jest.fn()
  const baseProps = {
    metadata: { name },
    isLoading: false,
    name: 'Modal',
    onClose: onCloseMock,
    getContract: jest.fn(),
    onClaim: onClaimMock,
    onClaimNameClear: onClaimNameClearMock,
    onAuthorizedAction: onAuthorizedActionMock,
    onCloseAuthorization: jest.fn(),
    isLoadingAuthorization: false
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when there is no name typed', () => {
    it('should have the confirm button disabled', () => {
      const { getByText } = renderWithProviders(
        <ClaimNameFatFingerModal {...baseProps} />
      )

      const claimButton = getByText(t('global.confirm'))
      expect(claimButton).toBeDisabled()
    })
  })

  describe('when not typing the same name that is given by props', () => {
    it('should have the confirm button disabled and show error message', () => {
      const { getByRole, getByText } = renderWithProviders(
        <ClaimNameFatFingerModal {...baseProps} />
      )

      const inputField = getByRole('textbox')
      fireEvent.change(inputField, { target: { value: 'wrongName' } })

      const claimButton = getByText(t('global.confirm'))
      expect(claimButton).toBeDisabled()

      const errorMessage = getByText(
        t('names_page.claim_name_fat_finger_modal.names_different')
      )
      expect(errorMessage).toBeInTheDocument()
    })
  })

  describe('when typing the correct name', () => {
    it('should call onClaim when claim button is clicked', async () => {
      const { getByRole, getByText } = renderWithProviders(
        <ClaimNameFatFingerModal
          {...baseProps}
          getContract={jest.fn().mockResolvedValue({
            address: '0x0' // mana contract mock
          })}
          onAuthorizedAction={jest
            .fn()
            .mockImplementation(({ onAuthorized }: any) => {
              onAuthorized()
            })}
        />
      )

      const inputField = getByRole('textbox')
      await fireEvent.change(inputField, { target: { value: name } })
      const claimButton = getByText(t('global.confirm'))
      await waitFor(() => {
        expect(claimButton).not.toBeDisabled()
      })
      fireEvent.click(claimButton)
      expect(onClaimMock).toHaveBeenCalledWith(name)
    })
  })

  describe('while loading', () => {
    it('should have the confirm button disabled', () => {
      const { getByText } = renderWithProviders(
        <ClaimNameFatFingerModal {...baseProps} isLoading />
      )

      const claimButton = getByText(t('global.confirm'))
      expect(claimButton).toBeDisabled()
    })
  })

  describe('when the modal is closed', () => {
    it('should call onClose', () => {
      const { getByText } = renderWithProviders(
        <ClaimNameFatFingerModal {...baseProps} />
      )

      const closeButton = getByText(t('global.cancel'))
      fireEvent.click(closeButton)

      expect(onCloseMock).toHaveBeenCalled()
    })
  })
})
