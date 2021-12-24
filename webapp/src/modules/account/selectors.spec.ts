import { Network } from '@dcl/schemas'
import {
  getAggregatedMetricsByAddress,
  getMetricsByAddress,
  getMetricsByAddressByNetwork,
  getMetricsByNetworkByAddress
} from './selectors'
import { AccountMetrics } from './types'
import { sumAccountMetrics } from './utils'

let metrics1: AccountMetrics
let metrics2: AccountMetrics
let metrics3: AccountMetrics
let metrics4: AccountMetrics

beforeEach(() => {
  metrics1 = {
    address: 'address1',
    earned: '200',
    spent: '200',
    sales: 200,
    royalties: '200',
    purchases: 200
  }

  metrics2 = {
    address: 'address2',
    earned: '300',
    spent: '300',
    sales: 300,
    royalties: '300',
    purchases: 300
  }

  metrics3 = {
    address: 'address1',
    earned: '100',
    spent: '100',
    sales: 100,
    royalties: '100',
    purchases: 100
  }

  metrics4 = {
    address: 'address3',
    earned: '400',
    spent: '400',
    sales: 400,
    royalties: '400',
    purchases: 400
  }
})

describe('when getting account metrics by address by network', () => {
  it('should return a record of of metrics by networks inside another record with addresses as keys', () => {
    const metricsByNetworkByAddress: ReturnType<typeof getMetricsByNetworkByAddress> = {
      [Network.ETHEREUM]: {
        address1: metrics1,
        address2: metrics2
      },
      [Network.MATIC]: {
        address1: metrics3,
        address3: metrics4
      }
    }

    expect(
      getMetricsByAddressByNetwork.resultFunc(metricsByNetworkByAddress)
    ).toEqual({
      address1: {
        [Network.ETHEREUM]: metrics1,
        [Network.MATIC]: metrics3
      },
      address2: {
        [Network.ETHEREUM]: metrics2
      },
      address3: {
        [Network.MATIC]: metrics4
      }
    })
  })
})

describe('when getting aggregated metrics by address', () => {
  it('should return a record of of metrics that have been sumed together by address', () => {
    const metricsByAddressByNetwork: ReturnType<typeof getMetricsByAddressByNetwork> = {
      address1: {
        [Network.ETHEREUM]: metrics1,
        [Network.MATIC]: metrics3
      },
      address2: {
        [Network.ETHEREUM]: metrics2,
        [Network.MATIC]: (undefined as unknown) as AccountMetrics
      },
      address3: {
        [Network.ETHEREUM]: (undefined as unknown) as AccountMetrics,
        [Network.MATIC]: metrics4
      }
    }

    expect(
      getAggregatedMetricsByAddress.resultFunc(metricsByAddressByNetwork)
    ).toEqual({
      address1: sumAccountMetrics(metrics1, metrics3),
      address2: metrics2,
      address3: metrics4
    })
  })
})

describe('when getting metrics by address', () => {
  it('should return a record with aggregated and by network metrics of each user', () => {
    const metricsByAddressByNetwork: ReturnType<typeof getMetricsByAddressByNetwork> = {
      address1: {
        [Network.ETHEREUM]: metrics1,
        [Network.MATIC]: metrics3
      },
      address2: {
        [Network.ETHEREUM]: metrics2,
        [Network.MATIC]: (undefined as unknown) as AccountMetrics
      },
      address3: {
        [Network.ETHEREUM]: (undefined as unknown) as AccountMetrics,
        [Network.MATIC]: metrics4
      }
    }

    const aggregatedMetricsByAddress: ReturnType<typeof getAggregatedMetricsByAddress> = {
      address1: sumAccountMetrics(metrics1, metrics3),
      address2: metrics2,
      address3: metrics4
    }

    expect(
      getMetricsByAddress.resultFunc(
        metricsByAddressByNetwork,
        aggregatedMetricsByAddress
      )
    ).toEqual({
      address1: {
        [Network.ETHEREUM]: metrics1,
        [Network.MATIC]: metrics3,
        aggregated: sumAccountMetrics(metrics1, metrics3)
      },
      address2: {
        [Network.ETHEREUM]: metrics2,
        aggregated: metrics2
      },
      address3: {
        [Network.MATIC]: metrics4,
        aggregated: metrics4
      }
    })
  })
})
