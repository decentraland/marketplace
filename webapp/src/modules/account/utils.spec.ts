import { sumAccountMetrics } from './utils'

describe('when summing account metrics', () => {
  it('should return an account metric with its values added from the provided account metrics', () => {
    expect(
      sumAccountMetrics(
        {
          address: 'address1',
          earned: '100',
          purchases: 100,
          royalties: '100',
          sales: 100,
          spent: '100'
        },
        {
          address: 'address2',
          earned: '200',
          purchases: 200,
          royalties: '200',
          sales: 200,
          spent: '200'
        }
      )
    ).toEqual({
      address: 'address1',
      earned: '300',
      purchases: 300,
      royalties: '300',
      sales: 300,
      spent: '300'
    })
  })
})
