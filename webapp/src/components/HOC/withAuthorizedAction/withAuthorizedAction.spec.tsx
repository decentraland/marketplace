import userEvent from '@testing-library/user-event'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { renderWithProviders } from '../../../utils/test'
import { AuthorizationAction } from './AuthorizationModal'
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
  const Component = (props: WithAuthorizedActionProps) => (
    <div data-testid="wrapped-component">
      <button
        onClick={() =>
          props.onAuthorizedAction(
            {} as Authorization,
            '100',
            actionCallbackMock
          )
        }
      >
        Action
      </button>
    </div>
  )
  const WithAuthorizedActionComponent = withAuthorizedAction(
    Component,
    AuthorizationAction.BID
  )
  return renderWithProviders(<WithAuthorizedActionComponent />)
}

it('should render wrapped component', () => {
  const screen = renderComponentWithAuthorizedAction()
  expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
})

describe('when onAuthorizedAction is called', () => {
  describe("and user doesn't have enough allowance", () => {
    it('should show authorization modal', async () => {
      (hasAuthorization as jest.Mock).mockReturnValue(false);
      (hasAuthorizationAndEnoughAllowance as jest.Mock).mockReturnValue(false);
      const screen = renderComponentWithAuthorizedAction()
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(screen.getByTestId('authorization-modal')).toBeInTheDocument()
    })
  })

  describe('and user has enought allowance', () => {
    it('should call action callback', async () => {
      (hasAuthorization as jest.Mock).mockReturnValue(true);
      (hasAuthorizationAndEnoughAllowance as jest.Mock).mockReturnValue(true);
      const actionCallbackMock = jest.fn()
      const screen = renderComponentWithAuthorizedAction(actionCallbackMock)
      await userEvent.click(screen.getByRole('button', { name: 'Action' }))
      expect(actionCallbackMock).toHaveBeenCalled()
    })
  })
})
