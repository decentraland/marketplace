import { Network } from '@dcl/schemas'
import { FieldProps } from 'decentraland-ui'

export type Props = Omit<FieldProps, 'value'> & {
  network: Network
  value: string
}
