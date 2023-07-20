import { act, cleanup, waitFor } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { Asset } from '../../../modules/asset/types'
import * as assetLib from '../../../lib/asset'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import SmartWearableVideoShowcaseModal from './SmartWearableVideoShowcaseModal'
import { VIDEO_TEST_ID } from './constants'

jest.mock('../../../lib/asset')

// To avoid 'unstable_flushDiscreteUpdates' error when rendering the video
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => {}
})

let asset: Asset = {
  id: 'aListId'
} as Asset

function renderSmartWearableVideoShowcaseModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SmartWearableVideoShowcaseModal
      name="SmartWearableVideoShowcaseModal"
      metadata={{
        asset
      }}
      onClose={jest.fn()}
      {...props}
    />
  )
}

describe('when the modal is rendered', () => {
  let renderedModal: ReturnType<typeof renderSmartWearableVideoShowcaseModal>

  it('should render the title and share buttons', () => {
    renderedModal = renderSmartWearableVideoShowcaseModal()
    const { getByText } = renderedModal
    expect(
      getByText(t('smart_wearable_video_showcase_modal.title'))
    ).toBeInTheDocument()
  })

  describe('when the asset does not have a urn', () => {
    beforeEach(() => {
      renderedModal = renderSmartWearableVideoShowcaseModal()
    })

    it('the video should have an undefined src', () => {
      const { queryByTestId } = renderedModal
      expect(queryByTestId(VIDEO_TEST_ID)).toBeNull()
    })
  })

  describe('when the asset does has the urn set', () => {
    beforeEach(async () => {
      jest
        .spyOn(assetLib, 'getSmartWearableVideoShowcase')
        .mockResolvedValueOnce('videoHash')

      await act(async () => {
        renderedModal = renderSmartWearableVideoShowcaseModal({
          metadata: {
            asset: {
              ...asset,
              urn: 'urn:decentraland:SmartItemCollection:0x000000'
            } as Asset
          }
        })
      })
    })

    afterEach(cleanup)

    it('should render the video with the src taken from the catalyst', async () => {
      const { getByTestId } = renderedModal
      const video = getByTestId(VIDEO_TEST_ID) as HTMLVideoElement

      await waitFor(() => {
        expect(getByTestId(VIDEO_TEST_ID)).toBeInTheDocument()
        expect(video.src).toBe(builderAPI.contentUrl('videoHash'))
      })
    })
  })
})
