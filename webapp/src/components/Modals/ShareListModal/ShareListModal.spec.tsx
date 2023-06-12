import { renderWithProviders } from '../../../utils/test'
import { List } from '../../../modules/favorites/types'

import { Props } from './ShareListModal.types'
import ShareListModal from './ShareListModal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

let list: List = {
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

describe('when the modal is rendered', () => {
  let renderedModal: ReturnType<typeof renderShareListModal>

  beforeEach(() => {
    renderedModal = renderShareListModal()
  })

  it('should render the title and share buttons', () => {
    const { getByText } = renderedModal
    expect(getByText(t('share_list_modal.title'))).toBeInTheDocument()
    expect(getByText(t('share_list_modal.copy_link'))).toBeInTheDocument()
    expect(
      getByText(t('share_list_modal.share_on_twitter'))
    ).toBeInTheDocument()
  })

  it('should render the lists card', () => {
    const { getByText } = renderedModal
    expect(getByText(list.name)).toBeInTheDocument()
  })

  it('should have a twitter share button with the href pointing to a twitter message', () => {
    const dclUrl = 'https://market.decentraland.zone'
    const locationsUrl = '/lists/aListId?assetType=item&section=lists&page=1'
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      t('share_list_modal.twitter_message')
    )} ${dclUrl}${locationsUrl}`
    const { getByRole } = renderedModal
    expect(
      getByRole('button', { name: t('share_list_modal.share_on_twitter') })
    ).toHaveAttribute('href', twitterURL)
  })
})
