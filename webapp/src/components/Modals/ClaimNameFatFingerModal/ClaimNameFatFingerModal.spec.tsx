import { ethers } from 'ethers'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { fireEvent, waitFor } from '@testing-library/react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { DCLController__factory } from '../../../contracts/factories/DCLController__factory'
import { renderWithProviders } from '../../../utils/test'
import ClaimNameFatFingerModal, {
  CRYPTO_PAYMENT_METHOD_DATA_TESTID
} from './ClaimNameFatFingerModal'

jest.mock('../../../modules/vendor/decentraland/marketplace/api')
jest.mock('../../../contracts/factories/DCLController__factory')
jest.mock('decentraland-dapps/dist/lib/eth', () => ({
  ...jest.requireActual('decentraland-dapps/dist/lib/eth'),
  getSigner: jest.fn()
}))

const getSignerMock = getSigner as jest.MockedFunction<typeof getSigner>
const signerMock = {
  getAddress: jest.fn(),
  _signTypedData: jest.fn()
}

describe('ClaimNameFatFingerModal', () => {
  let currentMana: number
  const name = 'aNAME'
  const onCloseMock = jest.fn()
  const onClaimMock = jest.fn()
  const onBuyWithCryptoMock = jest.fn()
  const onClaimNameClearMock = jest.fn()
  const onAuthorizedActionMock = jest.fn()
  const onClaimTxSubmittedMock = jest.fn()
  const baseProps = {
    currentMana: 0,
    isClaimingNamesCrossChainEnabled: false,
    onBuyWithCrypto: onBuyWithCryptoMock,
    identity: {} as AuthIdentity,
    onClaimTxSubmitted: onClaimTxSubmittedMock,
    isClaimingNamesWithFiatEnabled: true,
    metadata: { name },
    isLoading: false,
    name: 'Modal',
    onClose: onCloseMock,
    getContract: jest.fn(),
    onClaim: onClaimMock,
    onClaimNameClear: onClaimNameClearMock,
    onAuthorizedAction: onAuthorizedActionMock,
    onCloseAuthorization: jest.fn(),
    onOpenFiatGateway: jest.fn(),
    wallet: {} as Wallet,
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
    describe('and has enough MANA balance to pay', () => {
      beforeEach(() => {
        currentMana = 100
      })
      it('should call onClaim when claim button is clicked', async () => {
        const { getByRole, getByText } = renderWithProviders(
          <ClaimNameFatFingerModal
            {...baseProps}
            currentMana={currentMana}
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
    describe('and does not have enough MANA balance to pay', () => {
      beforeEach(() => {
        currentMana = 0
        getSignerMock.mockResolvedValueOnce(
          (signerMock as unknown) as ethers.providers.JsonRpcSigner
        )
        ;(DCLController__factory.connect as jest.Mock).mockResolvedValueOnce({
          interface: {
            encodeFunctionData: jest.fn()
          }
        })
      })
      it('should not be able to buy with MANA', async () => {
        const { getByRole, getByText, getByTestId } = renderWithProviders(
          <ClaimNameFatFingerModal
            {...baseProps}
            currentMana={currentMana}
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

        const cryptoPaymentOption = getByTestId(
          CRYPTO_PAYMENT_METHOD_DATA_TESTID
        )
        const inputField = getByRole('textbox')
        await fireEvent.change(inputField, { target: { value: name } })
        const claimButton = getByText(t('global.confirm'))
        await waitFor(() => {
          expect(claimButton).not.toBeDisabled()
        })
        expect(cryptoPaymentOption).toHaveClass('disabled')
        fireEvent.click(claimButton)

        await waitFor(() => {
          expect(onClaimMock).not.toHaveBeenCalledWith(name)
        })
      })
    })
    describe('when clicking the claim button', () => {
      beforeEach(() => {
        getSignerMock.mockResolvedValueOnce(
          (signerMock as unknown) as ethers.providers.JsonRpcSigner
        )
        ;(DCLController__factory.connect as jest.Mock).mockResolvedValueOnce({
          interface: {
            encodeFunctionData: jest.fn()
          }
        })
      })
      it('should open FIAT gateway widget when claim button is clicked', async () => {
        const { getByRole, getByText } = renderWithProviders(
          <ClaimNameFatFingerModal
            {...baseProps}
            currentMana={currentMana}
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

        await waitFor(() => {
          expect(baseProps.onOpenFiatGateway).toHaveBeenCalled()
        })
      })
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
