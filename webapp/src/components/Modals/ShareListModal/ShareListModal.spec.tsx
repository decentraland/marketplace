import { fireEvent } from '@testing-library/react'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { List } from '../../../modules/favorites/types'
import { renderWithProviders } from '../../../utils/test'
import ShareListModal from './ShareListModal'
import { Props } from './ShareListModal.types'

jest.mock('decentraland-dapps/dist/modules/analytics/utils')

const getAnalyticsMock = getAnalytics as jest.Mock

const list: List = {
  id: 'aListId',
  name: 'aListName',
  description: 'aListDescription',
  isPrivate: false
} as List

function renderShareListModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ShareListModal
      name="ShareListModal"
      metadata={{
        list: list
      }}
      onClose={jest.fn()}
      {...props}
    />
  )
}

beforeEach(() => {
  getAnalyticsMock.mockReturnValue({
    page: jest.fn(),
    track: jest.fn()
  })
})

describe('when the modal is rendered', () => {
  let renderedModal: ReturnType<typeof renderShareListModal>

  beforeEach(() => {
    renderedModal = renderShareListModal()
  })

  it('should render the title and share buttons', () => {
    const { getByText } = renderedModal
    expect(getByText(t('share_list_modal.title'))).toBeInTheDocument()
    expect(getByText(t('share_list_modal.copy_link'))).toBeInTheDocument()
    expect(getByText(t('share_list_modal.share_on_twitter'))).toBeInTheDocument()
  })

  it('should render the lists card', () => {
    const { getByText } = renderedModal
    expect(getByText(list.name)).toBeInTheDocument()
  })
})

describe('when the share on twitter button is clicked', () => {
  let renderedModal: ReturnType<typeof renderShareListModal>

  beforeEach(() => {
    jest.useFakeTimers()
    renderedModal = renderShareListModal()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should open a new page with a twitter message', () => {
    jest.spyOn(window, 'open').mockImplementation(() => null)
    const dclUrl = 'https://decentraland.zone/marketplace'
    const locationsUrl = '/lists/aListId?assetType=item&section=lists&vendor=decentraland&page=1&sortBy=newest'
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${t('share_list_modal.twitter_message')}${dclUrl}${locationsUrl}`
    )}`

    const { getByRole } = renderedModal
    const button = getByRole('button', {
      name: t('share_list_modal.share_on_twitter')
    })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)

    jest.runOnlyPendingTimers()

    expect(window.open).toHaveBeenCalledWith(twitterURL, '_blank')
  })
})
