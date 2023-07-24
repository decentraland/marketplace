import { useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media'
import { renderWithProviders } from '../../../utils/test'
import { OnlySmartFilter, OnlySmartFilterProps } from './OnlySmartFilter'

jest.mock('decentraland-ui/dist/components/Media', () => ({
  useTabletAndBelowMediaQuery: jest.fn()
}))

function renderOnlySmartFilter(props: Partial<OnlySmartFilterProps> = {}) {
  return renderWithProviders(
    <OnlySmartFilter onChange={jest.fn()} {...props} />
  )
}

describe('OnlySmartFilter', () => {
  let useTabletAndBelowMediaQueryMock: jest.MockedFunction<typeof useTabletAndBelowMediaQuery>

  beforeEach(() => {
    useTabletAndBelowMediaQueryMock = useTabletAndBelowMediaQuery as jest.MockedFunction<
      typeof useTabletAndBelowMediaQuery
    >
  })

  describe('when the dispositive is mobile or tablet', () => {
    beforeEach(() => {
      useTabletAndBelowMediaQueryMock.mockReturnValue(true)
    })

    it('should not render the only smart filter section', () => {
      const { container } = renderOnlySmartFilter()
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when the dispositive is not mobile nor tablet', () => {
    beforeEach(() => {
      useTabletAndBelowMediaQueryMock.mockReturnValue(false)
    })

    it('should render the only smart filter section', () => {
      const { container } = renderOnlySmartFilter()
      expect(container).not.toBeEmptyDOMElement()
    })
  })
})
