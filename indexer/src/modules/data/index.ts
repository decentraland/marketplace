import { Data } from '../../entities/schema'

export enum DataType {
  PARCEL = 0,
  ESTATE = 1
}
export enum CSVState {
  BETWEEN = 0,
  UNQUOTED_VALUE = 1,
  QUOTED_VALUE = 2
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

/**
 * Parses a CSV string into an array of strings.
 * @param csv CSV string.
 * @returns Array of strings.
 */
export function parseCSV(csv: string): Array<string> {
  let values = new Array<string>()
  let valueStart = 0
  let state = CSVState.BETWEEN

  for (let i: i32 = 0; i < csv.length; i++) {
    if (state == CSVState.BETWEEN) {
      if (csv[i] != ',') {
        if (csv[i] == '"') {
          state = CSVState.QUOTED_VALUE
          valueStart = i + 1
        } else {
          state = CSVState.UNQUOTED_VALUE
          valueStart = i
        }
      }
    } else if (state == CSVState.UNQUOTED_VALUE) {
      if (csv[i] == ',') {
        values.push(csv.substr(valueStart, i - valueStart))
        state = CSVState.BETWEEN
      }
    } else if (state == CSVState.QUOTED_VALUE) {
      if (csv[i] == '"') {
        values.push(csv.substr(valueStart, i - valueStart))
        state = CSVState.BETWEEN
      }
    }
  }

  return values
}
