import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getSigner } from 'decentraland-dapps/dist/lib/eth'
import { fireEvent, cleanup } from '@testing-library/react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { DCLController__factory } from '../../../contracts/factories/DCLController__factory'
import { renderWithProviders } from '../../../utils/test'
import ClaimNameFatFingerModal, { CRYPTO_PAYMENT_METHOD_DATA_TESTID, FIAT_PAYMENT_METHOD_DATA_TESTID } from './ClaimNameFatFingerModal'
import { Props } from './ClaimNameFatFingerModal.types'

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

const renderClaimFatFingerModal = (props: Partial<Props> = {}) =>
  renderWithProviders(
    <ClaimNameFatFingerModal
      onBuyWithCrypto={jest.fn()}
      onClaimTxSubmitted={jest.fn()}
      metadata={{ name: 'aNAME' }}
      isClaimingName={false}
      name={'Modal'}
      onClose={jest.fn()}
      onOpenFiatGateway={jest.fn()}
      wallet={{} as Wallet}
      {...props}
    />
  )

describe('ClaimNameFatFingerModal', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  describe('when there is no name typed', () => {
    it('should have the buy with crypto and card buttons disabled', () => {
      const { getByTestId } = renderClaimFatFingerModal()

      expect(getByTestId(CRYPTO_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()
      expect(getByTestId(FIAT_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()
    })
  })

  describe('when not typing the same name that is given by props', () => {
    it('should have the confirm button disabled and show and error message', () => {
      const { getByRole, getByText, getByTestId } = renderClaimFatFingerModal()

      const inputField = getByRole('textbox')
      fireEvent.change(inputField, { target: { value: 'wrongName' } })

      expect(getByTestId(CRYPTO_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()
      expect(getByTestId(FIAT_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()

      const errorMessage = getByText(t('names_page.claim_name_fat_finger_modal.names_different'))
      expect(errorMessage).toBeInTheDocument()
    })
  })

  describe('when typing the correct name', () => {
    let renderedModal: ReturnType<typeof renderClaimFatFingerModal>
    const name = 'aName'
    const address = '0x1'
    let onBuyWithCrypto: jest.Mock
    let onOpenFiatGateway: jest.Mock
    let onClaimTxSubmitted: jest.Mock

    beforeEach(() => {
      onBuyWithCrypto = jest.fn()
      onOpenFiatGateway = jest.fn()
      onClaimTxSubmitted = jest.fn()
      renderedModal = renderClaimFatFingerModal({
        metadata: { name },
        wallet: {
          address,
          chainId: ChainId.ETHEREUM_SEPOLIA
        } as Wallet,
        onBuyWithCrypto,
        onOpenFiatGateway,
        onClaimTxSubmitted
      })
      const inputField = renderedModal.getByRole('textbox')
      fireEvent.change(inputField, { target: { value: name } })
    })

    describe('and clicking the buy with crypto button', () => {
      beforeEach(() => {
        const { getByTestId } = renderedModal
        fireEvent.click(getByTestId(CRYPTO_PAYMENT_METHOD_DATA_TESTID))
      })

      it('should call the onBuyWithCrypto method prop', () => {
        expect(onBuyWithCrypto).toHaveBeenCalled()
      })
    })

    describe('and clicking the buy with card button', () => {
      let encodeFunctionMock: jest.Mock

      beforeEach(() => {
        encodeFunctionMock = jest.fn()
        getSignerMock.mockResolvedValueOnce(signerMock as unknown as ethers.providers.JsonRpcSigner)
        ;(DCLController__factory.connect as jest.Mock).mockResolvedValueOnce({
          interface: {
            encodeFunctionData: encodeFunctionMock
          }
        })

        const { getByTestId } = renderedModal
        fireEvent.click(getByTestId(FIAT_PAYMENT_METHOD_DATA_TESTID))
      })

      it('should open the FIAT gateway widget', () => {
        expect(onOpenFiatGateway).toHaveBeenCalled()
      })

      it('should perform the buy operation with the chosen name and wallet address', () => {
        expect(encodeFunctionMock).toHaveBeenCalledWith('register', [name, address])
      })

      describe('when the buy operation is pending', () => {
        const txId = 'aTxId'

        beforeEach(() => {
          onOpenFiatGateway.mock.calls[0][2].onPending({
            data: { tx_id: txId }
          })
        })

        it('should call the onClaimTxSubmitted method prop with the transaction data', () => {
          expect(onClaimTxSubmitted).toHaveBeenCalledWith(name, address, ChainId.ETHEREUM_SEPOLIA, txId)
        })
      })
    })
  })

  describe('while the name is being claimed', () => {
    let renderedModal: ReturnType<typeof renderClaimFatFingerModal>

    beforeEach(() => {
      renderedModal = renderClaimFatFingerModal({ isClaimingName: true })
    })

    it('should have the input field disabled', () => {
      expect(renderedModal.getByRole('textbox')).toBeDisabled()
    })

    it('should have the buy with crypto and fiat buttons disabled', () => {
      const { getByTestId } = renderedModal

      expect(getByTestId(CRYPTO_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()
      expect(getByTestId(FIAT_PAYMENT_METHOD_DATA_TESTID)).toBeDisabled()
    })
  })
})
