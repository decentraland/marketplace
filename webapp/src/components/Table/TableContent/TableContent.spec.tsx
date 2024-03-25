import { within } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/tests'
import { ROWS_PER_PAGE } from '../../AssetPage/OwnersTable/OwnersTable'
import TableContent from './TableContent'
import { DataTableType } from './TableContent.types'

describe('Table content', () => {
  let data: DataTableType[] = [
    { first_header: 'content header 1', second_header: <div>second text</div> },
    {
      first_header: 'second content header 1',
      second_header: <div>second text header 2</div>
    }
  ]

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Empty table', () => {
    it('should render the empty table message', () => {
      const { getByText } = renderWithProviders(<TableContent data={[]} isLoading={false} empty={() => <div>empty table</div>} total={0} />)
      expect(getByText('empty table')).toBeInTheDocument()
    })
  })

  describe('Should render the table correctly', () => {
    it('should render the table', () => {
      const screen = renderWithProviders(<TableContent data={data} isLoading={false} empty={() => <div>empty table</div>} total={0} />)

      const { getByTestId } = screen

      expect(getByTestId('table-content')).not.toBe(null)
    })

    it('should render the headers', () => {
      const screen = renderWithProviders(<TableContent data={data} isLoading={false} empty={() => <div>empty table</div>} total={0} />)

      const { getByText } = screen

      expect(getByText('first_header')).not.toBe(null)
      expect(getByText('second_header')).not.toBe(null)
    })

    it('should render the content', () => {
      const screen = renderWithProviders(<TableContent data={data} isLoading={false} empty={() => <div>empty table</div>} total={0} />)

      const { getByText } = screen

      expect(getByText('content header 1')).not.toBe(null)
      expect(getByText('second text')).not.toBe(null)
      expect(getByText('second content header 1')).not.toBe(null)
      expect(getByText('second text header 2')).not.toBe(null)
    })
  })

  describe('Should render the loader if its loading', () => {
    it('should render the loader', () => {
      const screen = renderWithProviders(<TableContent data={data} isLoading={true} empty={() => <div>empty table</div>} total={0} />)

      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    describe('Should have pagination', () => {
      it('should render the pagination correctly', () => {
        data = Array(ROWS_PER_PAGE).fill({
          first_header: 'contetnt 1',
          second_header: 'content 2'
        })

        const screen = renderWithProviders(
          <TableContent data={data} isLoading={false} empty={() => <div>empty table</div>} total={data.length} totalPages={2} />
        )

        const { getByRole } = screen

        const navigation = getByRole('navigation')

        expect(within(navigation).getByText('1')).toBeInTheDocument()
        expect(within(navigation).getByText('2')).toBeInTheDocument()
      })
    })

    describe('Should not have pagination', () => {
      it('should not render pagination as there is no need', () => {
        const screen = renderWithProviders(
          <TableContent data={data} isLoading={false} empty={() => <div>empty table</div>} total={data.length} totalPages={1} />
        )

        const { queryByRole } = screen

        expect(queryByRole('navigation')).not.toBeInTheDocument()
      })
    })
  })
})
