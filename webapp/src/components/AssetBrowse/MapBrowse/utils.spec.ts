import { getNearestTile } from './utils'

describe('#getNearestTile', () => {
  describe('when the list of coords is not defined', () => {
    it('should return undefined', () => {
      expect(getNearestTile({ x: 1, y: 2 })).toBeUndefined()
    })
  })

  describe('when the list of coords is empty', () => {
    it('should return undefined', () => {
      expect(getNearestTile({ x: 1, y: 2 }, [])).toBeUndefined()
    })
  })

  describe('when the list of coords has only one value', () => {
    it('should return the available value', () => {
      expect(getNearestTile({ x: 1, y: 2 }, [{ x: 100, y: 200 }])).toEqual({
        x: 100,
        y: 200
      })
    })
  })

  describe('when the list of coords has multiple values', () => {
    it('should return the nearest tile', () => {
      expect(
        getNearestTile({ x: 1, y: 2 }, [
          { x: 10, y: 20 },
          { x: 100, y: 200 },
          { x: 1, y: 5 }
        ])
      ).toEqual({ x: 1, y: 5 })
    })
  })
})
