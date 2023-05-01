import { RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName } from 'decentraland-transactions'
import { BigNumber } from 'ethers'
import { RootState } from '../../../modules/reducer'
import { Contract } from '../../../modules/vendor/services'
import { renderWithProviders } from '../../../utils/test'
import { AuthorizedAction } from './AuthorizationModal'
import { getERC20ContractInstance, getERC721ContractInstance } from './utils'
import withAuthorizedAction from './withAuthorizedAction'
import {
  AuthorizeActionOptions,
  WithAuthorizedActionProps
} from './withAuthorizedAction.types'

jest.mock('decentraland-dapps/dist/containers', () => ({
  TransactionLink: () => 'test'
}))

jest.mock('./utils.ts', () => ({
  getERC20ContractInstance: jest.fn(),
  getERC721ContractInstance: jest.fn()
}))

function renderComponentWithAuthorizedAction(
  options: Partial<AuthorizeActionOptions> = {},
  initialState?: RootState
) {
  const Component = (props: WithAuthorizedActionProps) => {
    return (
      <div data-testid="wrapped-component">
        <button
          onClick={() => {
            props.onAuthorizedAction({
              authorizationType: AuthorizationType.ALLOWANCE,
              requiredAllowanceInWei: '100',
              authorizedAddress: '0x31233333333',
              targetContract: {} as Contract,
              onAuthorized: jest.fn(),
              targetContractName: ContractName.MANAToken,
              ...options
            } as AuthorizeActionOptions)
          }}
        >
          Action
        </button>
      </div>
    )
  }
  const WithAuthorizedActionComponent = withAuthorizedAction(
    Component,
    AuthorizedAction.BID,
    jest.fn(),
    jest.fn()
  )
  return renderWithProviders(<WithAuthorizedActionComponent />, {
    preloadedState: initialState
  })
}

it('should render wrapped component', () => {
  const screen = renderComponentWithAuthorizedAction()
  expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
})

describe('when onAuthorizedAction is called', () => {
  describe('and authorizationType is ALLOWANCE', () => {
    it('should call ERC20 contract allowance method', async () => {
      const allowanceMock = jest.fn().mockResolvedValue(BigNumber.from('10'))
      const authorizedAddress = '0xtest'
      const walletAddress = '0xwalletadd'
      ;(getERC20ContractInstance as jest.Mock).mockReturnValue({
        allowance: allowanceMock
      })
      const screen = renderComponentWithAuthorizedAction(
        {
          authorizedAddress: authorizedAddress
        },
        { wallet: { data: { address: walletAddress } } } as any
      )

      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(allowanceMock).toHaveBeenCalledWith(
        walletAddress,
        authorizedAddress
      )
    })

    describe('and the desired contract has enough allowance', () => {
      it('should call action callback', async () => {
        const actionCallbackMock = jest.fn()
        ;(getERC20ContractInstance as jest.Mock).mockReturnValue({
          allowance: jest.fn().mockResolvedValue(BigNumber.from('10'))
        })
        const screen = renderComponentWithAuthorizedAction(
          { onAuthorized: actionCallbackMock, requiredAllowanceInWei: '1' },
          { wallet: { data: { address: '0xaddress' } } } as any
        )
        await userEvent.click(screen.getByRole('button', { name: 'Action' }))
        expect(actionCallbackMock).toHaveBeenCalled()
      })
    })

    describe('and the desired contract does not have enough allowance', () => {
      let actionCallbackMock: jest.Mock
      let screen: RenderResult

      beforeEach(() => {
        ;(getERC20ContractInstance as jest.Mock).mockReturnValue({
          allowance: jest.fn().mockResolvedValue(BigNumber.from('0'))
        })
        actionCallbackMock = jest.fn()
        screen = renderComponentWithAuthorizedAction(
          { onAuthorized: actionCallbackMock, requiredAllowanceInWei: '1' },
          { wallet: { data: { address: '0xaddress' } } } as any
        )
      })
      it('should show authorization modal', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Action' }))
        expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
      })

      describe('when clicking close button', () => {
        it('should stop showing authorization modal', async () => {
          await userEvent.click(screen.getByRole('button', { name: 'Action' }))
          expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
          await userEvent.click(
            screen.getByRole('button', { name: t('global.close') })
          )
          expect(
            screen.queryByTestId('authorization-modal')
          ).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('and authorizationType is APPROVAL', () => {
    it('should call ERC721 contract allowance method', async () => {
      const isApprovedForAllMock = jest.fn().mockResolvedValue(true)
      const authorizedAddress = '0xtest'
      const walletAddress = '0xwalletadd'
      ;(getERC721ContractInstance as jest.Mock).mockReturnValue({
        isApprovedForAll: isApprovedForAllMock
      })
      const screen = renderComponentWithAuthorizedAction(
        {
          authorizedAddress: authorizedAddress,
          authorizationType: AuthorizationType.APPROVAL
        },
        { wallet: { data: { address: walletAddress } } } as any
      )

      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(isApprovedForAllMock).toHaveBeenCalledWith(
        walletAddress,
        authorizedAddress
      )
    })

    describe('and the desired contract is approved', () => {
      it('should call action callback', async () => {
        const actionCallbackMock = jest.fn()
        ;(getERC721ContractInstance as jest.Mock).mockReturnValue({
          isApprovedForAll: jest.fn().mockResolvedValue(true)
        })
        const screen = renderComponentWithAuthorizedAction(
          {
            onAuthorized: actionCallbackMock,
            authorizationType: AuthorizationType.APPROVAL
          },
          { wallet: { data: { address: '0xaddress' } } } as any
        )
        await userEvent.click(screen.getByRole('button', { name: 'Action' }))
        expect(actionCallbackMock).toHaveBeenCalled()
      })
    })

    describe('and the desired contract is not approved', () => {
      it('should show authorization modal', async () => {
        const actionCallbackMock = jest.fn()
        ;(getERC721ContractInstance as jest.Mock).mockReturnValue({
          isApprovedForAll: jest.fn().mockResolvedValue(false)
        })
        const screen = renderComponentWithAuthorizedAction(
          {
            onAuthorized: actionCallbackMock,
            authorizationType: AuthorizationType.APPROVAL
          },
          { wallet: { data: { address: '0xaddress' } } } as any
        )
        await userEvent.click(screen.getByRole('button', { name: 'Action' }))
        expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
        await userEvent.click(
          screen.getByRole('button', { name: t('global.close') })
        )
        expect(
          screen.queryByTestId('authorization-modal')
        ).not.toBeInTheDocument()
      })
    })
  })
})
