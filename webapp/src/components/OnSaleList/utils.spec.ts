import { SortBy } from '../../modules/routing/types'
import { filterByName, sort } from './utils'

describe('when filtering elements by name', () => {
  it('should return elements that include the provided name', () => {
    const res = filterByName(
      [{ item: { name: 'Foo' } }, { nft: { name: 'Bar' } }] as any,
      'foo'
    )
    expect(res.length).toBe(1)
    expect(res[0].item?.name).toBe('Foo')
  })
})

describe('when sorting elements', () => {
  it('should return a sorted by name element array', () => {
    const res = sort(
      [{ item: { name: 'John' } }, { nft: { name: 'Jack' } }] as any,
      SortBy.NAME
    )
    expect(res.length).toBe(2)
    expect(res[0].nft!.name).toBe('Jack')
    expect(res[1].item!.name).toBe('John')
  })
})
