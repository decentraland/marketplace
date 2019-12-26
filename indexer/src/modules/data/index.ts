import { parseCSV } from '@graphprotocol/graph-ts/helper-functions'
import { Data } from '../../entities/schema'

export enum DataType {
  PARCEL = 0,
  ESTATE = 1
}

export function buildData(
  assetId: string,
  csv: string,
  dataType: DataType
): Data | null {
  let dataEntity = new Data(assetId)

  if (csv.charAt(0) != '0') {
    return null
  }

  let data = parseCSV(csv)
  if (data.length === 0 || data[0] != '0') {
    return null
  }

  dataEntity.version = data[0]

  if (data.length > 1) {
    dataEntity.name = data[1]
  }
  if (data.length > 2) {
    dataEntity.description = data[2]
  }
  if (data.length > 3) {
    dataEntity.ipns = data[3]
  }

  switch (dataType) {
    case DataType.PARCEL: {
      dataEntity.parcel = assetId
      break
    }
    case DataType.ESTATE: {
      dataEntity.estate = assetId
      break
    }
    default:
      return null
  }

  return dataEntity
}
