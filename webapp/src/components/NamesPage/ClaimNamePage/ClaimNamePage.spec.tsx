import { fireEvent, waitFor } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { renderWithProviders } from '../../../utils/test'
import { MAX_NAME_SIZE, isNameAvailable } from '../../../modules/ens/utils'
import { Props } from './ClaimNamePage.types'
import ClaimNamePage from './ClaimNamePage'

jest.mock(
  '../../../modules/ens/utils',
  () =>
    ({
      ...jest.requireActual('../../../modules/ens/utils'),
      isNameAvailable: jest.fn()
    }) as unknown
)

describe('ClaimNamePage', () => {
  let walletMock: Wallet
  let onBrowseMock: Props['onBrowse']
  let onClaimMock: Props['onClaim']
  let onRedirectMock: Props['onRedirect']

  const renderAndTypeText = async (text: string) => {
    const matchers = renderWithProviders(
      <ClaimNamePage wallet={walletMock} isConnecting={false} onClaim={onClaimMock} onBrowse={onBrowseMock} onRedirect={onRedirectMock} />
    )
    const { getByDisplayValue, getByText } = matchers
    const nameInput = getByDisplayValue(t('names_page.your_name')) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: text } })

    await waitFor(() => {
      expect(nameInput.value).toBe(text)
    })

    const claimButton = getByText(t('names_page.claim_a_name'))
    expect(claimButton).toHaveAttribute('disabled')

    return matchers
  }

  describe('when typing an invalid NAME', () => {
    let invalidName: string
    describe('and the name has a not supported character', () => {
      beforeEach(() => {
        invalidName = 'test!'
      })
      it('should have the claim name disabled and show the proper warning message', async () => {
        const { getByText } = await renderAndTypeText(invalidName)

        expect(getByText(t('names_page.invalid_characters'))).toBeInTheDocument()
      })
    })
    describe('and the name has a space', () => {
      beforeEach(() => {
        invalidName = 'te st'
      })
      it('should have the claim name disabled and show the proper warning message', async () => {
        const { getByText } = await renderAndTypeText(invalidName)

        expect(getByText(t('names_page.has_spaces'))).toBeInTheDocument()
      })
    })
    describe('and the name is too short', () => {
      beforeEach(() => {
        invalidName = 't'
      })
      it('should have the claim name disabled and show the proper warning message', async () => {
        const { getByText } = await renderAndTypeText(invalidName)

        expect(getByText(t('names_page.name_too_short'))).toBeInTheDocument()
      })
    })
    describe('and the name is too long', () => {
      beforeEach(() => {
        invalidName = Array(MAX_NAME_SIZE + 1)
          .fill('t')
          .toString()
      })
      it('should have the claim name disabled and show the proper warning message', async () => {
        const { getByText } = await renderAndTypeText(invalidName)

        expect(getByText(t('names_page.name_too_long'))).toBeInTheDocument()
      })
    })
  })

  describe('when typing a valid NAME', () => {
    let validName: string
    beforeEach(() => {
      validName = 'test'
    })

    describe('and its available', () => {
      beforeEach(() => {
        ;(isNameAvailable as jest.Mock).mockResolvedValue(true)
      })
      describe('and has enough funds to claim the NAME', () => {
        beforeEach(() => {
          walletMock = {} as Wallet
          onClaimMock = jest.fn()
        })
        it('should have the claim name enabled and call the onClaim when clicking it', async () => {
          const { getByText } = await renderAndTypeText(validName)
          const claimButton = getByText(t('names_page.claim_a_name'))
          await waitFor(() => expect(claimButton).not.toHaveAttribute('disabled'))
          fireEvent.click(claimButton)
          await waitFor(() => expect(onClaimMock).toHaveBeenCalledWith(validName))
        })
      })
      describe('and does not have enough funds to claim the NAME', () => {
        beforeEach(() => {
          walletMock = {} as Wallet
          onClaimMock = jest.fn()
        })
        it('should have the claim name disabled and not call the onClaim when clicking it', async () => {
          const { getByText } = await renderAndTypeText(validName)
          const claimButton = getByText(t('names_page.claim_a_name'))
          await waitFor(() => expect(claimButton).toHaveAttribute('disabled'))
          fireEvent.click(claimButton)
          await waitFor(() => expect(onClaimMock).not.toHaveBeenCalledWith(validName))
        })
      })
    })

    describe('and its not available', () => {
      beforeEach(() => {
        ;(isNameAvailable as jest.Mock).mockResolvedValue(false)
      })
      it('should have the claim name disabled', async () => {
        const { getByText } = await renderAndTypeText(validName)

        await waitFor(() => expect(getByText(t('names_page.claim_a_name'))).toHaveAttribute('disabled'))
      })
    })
  })
})
