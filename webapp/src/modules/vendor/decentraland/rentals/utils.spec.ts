import { objectToURLSearchParams } from './utils'
describe('#objectToURLSearchParams', () => {
  describe('when params is undefined', () => {
    it('should return empty URLSearchParams', () => {
      expect(objectToURLSearchParams(undefined).toString()).toEqual('')
    })
  })

  describe('when params has a defined property', () => {
    describe('when property has a simple value', () => {
      it('should return correct URLSearchParams item', () => {
        const urlSearchParams = objectToURLSearchParams({ property1: 'test' })
        expect(urlSearchParams.get('property1')).toEqual('test')
        expect(urlSearchParams.toString()).toEqual('property1=test')
      })
    })

    describe('when property value is an array', () => {
      it('should return correct URLSearchParams item', () => {
        const urlSearchParams = objectToURLSearchParams({ property1: ['value1', 'value2', 'value3'] })
        expect(urlSearchParams.getAll('property1')).toEqual(['value1', 'value2', 'value3'])
        expect(urlSearchParams.toString()).toEqual('property1=value1&property1=value2&property1=value3')
      })
    })
  })
})
