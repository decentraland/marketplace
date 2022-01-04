import { SortBy } from '../../modules/routing/types'
import { filterByName, paginate, sort } from './utils'

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

describe('when paginating 8 different elements', () => {
  describe('when having 3 elements per page', () => {
    const perPage = 3
    const elements = [
      { item: { id: '1' } },
      { item: { id: '2' } },
      { item: { id: '3' } },
      { item: { id: '4' } },
      { item: { id: '5' } },
      { item: { id: '6' } },
      { item: { id: '7' } },
      { item: { id: '8' } }
    ] as any[]

    it('should return a list of elements for the 1st page', () => {
      const res = paginate(elements, 1, perPage)
      expect(res.map(x => x.item!.id)).toEqual(['1', '2', '3'])
    })

    it('should return a list of elements for the 2nd page', () => {
      const res = paginate(elements, 2, perPage)
      expect(res.map(x => x.item!.id)).toEqual(['4', '5', '6'])
    })

    it('should return a list of elements for the 3rd page', () => {
      const res = paginate(elements, 3, perPage)
      expect(res.map(x => x.item!.id)).toEqual(['7', '8'])
    })

    it('should return an empty list from the non existing 4th page', () => {
      const res = paginate(elements, 4, perPage)
      expect(res.map(x => x.item!.id)).toEqual([])
    })
  })
})
