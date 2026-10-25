import { render, waitFor } from '@testing-library/react'
import SelectFilter from './SelectFilter'
import { Props } from './SelectFilter.types'

function renderSelectFilter(props: Partial<Props> = {}) {
  return render(<SelectFilter name="" value="" options={[]} onChange={jest.fn()} {...props} />)
}

describe('SelectFilter', () => {
  describe('when the value is not one of the options', () => {
    let fetchOptionFromValue: jest.Mock
    let onChange: jest.Mock

    beforeEach(() => {
      fetchOptionFromValue = jest.fn()
      onChange = jest.fn()
    })

    describe('and the option for the value is found', () => {
      beforeEach(() => {
        fetchOptionFromValue.mockResolvedValue({ value: '0xcollection', text: 'A collection' })
      })

      it('should show the found option without changing the value', async () => {
        const { findAllByText } = renderSelectFilter({ value: '0xcollection', fetchOptionFromValue, onChange })

        expect(await findAllByText('A collection')).not.toHaveLength(0)
        expect(fetchOptionFromValue).toHaveBeenCalledWith('0xcollection')
        expect(onChange).not.toHaveBeenCalled()
      })
    })

    describe('and the option for the value is not found', () => {
      beforeEach(() => {
        fetchOptionFromValue.mockResolvedValue(null)
      })

      describe('and there are options to fall back to', () => {
        it('should change the value to the first option', async () => {
          renderSelectFilter({
            value: '0xcollection',
            options: [{ value: 'ALL', text: 'All' }],
            fetchOptionFromValue,
            onChange
          })

          await waitFor(() => expect(onChange).toHaveBeenCalledWith('ALL'))
        })
      })

      describe('and there are no options to fall back to', () => {
        it('should keep the value instead of failing on the missing first option', async () => {
          renderSelectFilter({ value: '0xcollection', fetchOptionFromValue, onChange })

          await waitFor(() => expect(fetchOptionFromValue).toHaveBeenCalledWith('0xcollection'))
          await waitFor(() => expect(document.querySelector('.ui.dropdown.loading')).not.toBeInTheDocument())
          expect(onChange).not.toHaveBeenCalled()
        })
      })
    })

    describe('and fetching the option for the value fails', () => {
      let warnSpy: jest.SpyInstance

      beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
        fetchOptionFromValue.mockRejectedValue(new Error('Network failure'))
      })

      afterEach(() => {
        warnSpy.mockRestore()
      })

      it('should stop loading and keep the value', async () => {
        renderSelectFilter({ value: '0xcollection', fetchOptionFromValue, onChange })

        await waitFor(() => expect(warnSpy).toHaveBeenCalled())
        await waitFor(() => expect(document.querySelector('.ui.dropdown.loading')).not.toBeInTheDocument())
        expect(onChange).not.toHaveBeenCalled()
      })
    })
  })
})
