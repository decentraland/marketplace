import userEvent from '@testing-library/user-event'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useEffect } from 'react'
import { renderWithProviders } from '../../../utils/test'
import { AuthorizedAction } from './AuthorizationModal'
import withAuthorizedAction from './withAuthorizedAction'
import { WithAuthorizedActionProps } from './withAuthorizedAction.types'

jest.mock('decentraland-dapps/dist/containers', () => ({
  TransactionLink: () => 'test'
}))

jest.mock('decentraland-dapps/dist/modules/authorization/utils', () => ({
  hasAuthorization: jest.fn(),
  hasAuthorizationAndEnoughAllowance: jest.fn()
}))

function renderComponentWithAuthorizedAction(
  actionCallbackMock: jest.Mock = jest.fn()
) {
  const Component = (props: WithAuthorizedActionProps) => {
    useEffect(() => props.onSetAuthorization({} as Authorization), [])
    return (
      <div data-testid="wrapped-component">
        <button
          onClick={() => {
            props.onAuthorizedAction('100', actionCallbackMock)
          }}
        >
          Action
        </button>
      </div>
    )
  }
  const WithAuthorizedActionComponent = withAuthorizedAction(
    Component,
    AuthorizedAction.BID
  )
  return renderWithProviders(<WithAuthorizedActionComponent />)
}

it('should render wrapped component', () => {
  const screen = renderComponentWithAuthorizedAction()
  expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
})

describe('when onAuthorizedAction is called', () => {
  describe("and the user doesn't have authorization", () => {
    beforeEach(() => {
      ;(hasAuthorization as jest.Mock).mockReturnValue(false)
      ;(hasAuthorizationAndEnoughAllowance as jest.Mock).mockReturnValue(false)
    })

    it('should show authorization modal', async () => {
      const screen = renderComponentWithAuthorizedAction()
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
    })
  })

  describe("and user has authorization but doesn't have enough allowance", () => {
    beforeEach(() => {
      ;(hasAuthorization as jest.Mock).mockReturnValue(true)
      ;(hasAuthorizationAndEnoughAllowance as jest.Mock).mockReturnValue(false)
    })

    it('should show authorization modal', async () => {
      const screen = renderComponentWithAuthorizedAction()
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
    })

    describe('when clicking close button', () => {
      it('should stop showing authorization modal', async () => {
        const screen = renderComponentWithAuthorizedAction()
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

  describe('and user has enough allowance', () => {
    beforeEach(() => {
      ;(hasAuthorization as jest.Mock).mockReturnValue(true)
      ;(hasAuthorizationAndEnoughAllowance as jest.Mock).mockReturnValue(true)
    })

    it('should call action callback', async () => {
      const actionCallbackMock = jest.fn()
      const screen = renderComponentWithAuthorizedAction(actionCallbackMock)
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(actionCallbackMock).toHaveBeenCalled()
    })
  })
})
