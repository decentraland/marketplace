import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Asset } from '../../../modules/asset/types'
import { renderWithProviders } from '../../../utils/test'
import RequiredPermissions from './RequiredPermissions'
import { Props } from './RequiredPermissions.types'

const asset: Asset = {
  id: '1'
} as Asset

function renderRequiredPermissions(props: Partial<Props> = {}) {
  return renderWithProviders(
    <RequiredPermissions
      asset={asset}
      isLoading={false}
      hasFetched={true}
      error={undefined}
      requiredPermissions={[]}
      onClearError={jest.fn()}
      onFetchRequiredPermissions={jest.fn()}
      {...props}
    />
  )
}

describe('when the permissions were fetched and the array is empty', () => {
  it('should not render anything', () => {
    const { container } = renderRequiredPermissions()
    expect(container).toBeEmptyDOMElement()
  })
})

describe('when the permissions were not yet fetched and are being loaded', () => {
  it('should not render anything', () => {
    const { container } = renderRequiredPermissions({ isLoading: true })
    expect(container).toBeEmptyDOMElement()
  })
})

describe('when the permissions were fetched and the array is not empty', () => {
  let requiredPermissions: string[]
  beforeEach(() => {
    requiredPermissions = [
      'ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE',
      'ALLOW_TO_TRIGGER_AVATAR_EMOTE',
      'ALLOW_MEDIA_HOSTNAMES',
      'USE_WEB3_API',
      'USE_FETCH',
      'USE_WEBSOCKET',
      'OPEN_EXTERNAL_LINK'
    ]
  })

  it('should render them as badges', () => {
    const { getByText } = renderRequiredPermissions({ requiredPermissions })
    requiredPermissions.forEach(requiredPermission => {
      expect(getByText(t(`smart_wearable.required_permission.${requiredPermission.toLowerCase()}`))).toBeInTheDocument()
    })
  })
})

describe('when there is an error', () => {
  it('should render the error message', () => {
    const { getByText } = renderRequiredPermissions({ error: 'An error' })
    expect(getByText('An error')).toBeInTheDocument()
  })
})

describe('when the component is unmounted', () => {
  let onClearError: jest.Mock
  let error: string | undefined

  beforeEach(() => {
    onClearError = jest.fn()
  })

  describe("and there's an error", () => {
    beforeEach(() => {
      error = 'An error'
    })

    it('should clear the error', () => {
      const { unmount } = renderRequiredPermissions({ error, onClearError })
      unmount()
      expect(onClearError).toHaveBeenCalled()
    })
  })
  describe("and there's no error", () => {
    beforeEach(() => {
      error = undefined
    })

    it('should not clear the error', () => {
      const { unmount } = renderRequiredPermissions({ error, onClearError })
      unmount()
      expect(onClearError).not.toHaveBeenCalled()
    })
  })
})
