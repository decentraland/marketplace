import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { Asset } from '../../../modules/asset/types'
import { Props } from './RequiredPermissions.types'
import RequiredPermissions from './RequiredPermissions'

const asset: Asset = {
  id: '1'
} as Asset

function renderRequiredPermissions(props: Partial<Props> = {}) {
  return renderWithProviders(
    <RequiredPermissions
      asset={asset}
      isLoading={false}
      hasFetched={true}
      requiredPermissions={[]}
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
      expect(
        getByText(
          t(
            `smart_wearable.required_permission.${requiredPermission.toLowerCase()}`
          )
        )
      ).toBeInTheDocument()
    })
  })
})
