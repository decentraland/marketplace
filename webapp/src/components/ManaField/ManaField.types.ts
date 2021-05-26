import { Network } from '@dcl/schemas'
import { FieldProps } from 'decentraland-ui'

export type Props = FieldProps & {
  network: Network
}
