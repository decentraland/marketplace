import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { InfiniteScroll } from './InfiniteScroll'
import { Props } from './InfiniteScroll.types'

function renderInfiniteScroll(props: Partial<Props>) {
  return render(
    <InfiniteScroll maxScrollPages={0} hasMorePages onLoadMore={jest.fn()} page={0} {...props}>
      <span>My container</span>
    </InfiniteScroll>
  )
}

describe('when maxScrollPages is 0', () => {
  describe('and hasMorePages is true', () => {
    it('should show load button from the start', () => {
      const screen = renderInfiniteScroll({ maxScrollPages: 0 })
      expect(screen.getByRole('button', { name: t('global.load_more') })).toBeInTheDocument()
    })

    describe('and load more button is clicked', () => {
      it('should call onLoadMore function', async () => {
        const loadMoreMock = jest.fn()
        const screen = renderInfiniteScroll({
          maxScrollPages: 0,
          onLoadMore: loadMoreMock
        })
        await userEvent.click(screen.getByRole('button', { name: t('global.load_more') }))
        expect(loadMoreMock).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('and hasMorePages is false', () => {
    it('should not show load more button', () => {
      const screen = renderInfiniteScroll({
        maxScrollPages: 0,
        hasMorePages: false
      })
      expect(screen.queryByRole('button', { name: t('global.load_more') })).not.toBeInTheDocument()
    })
  })
})
