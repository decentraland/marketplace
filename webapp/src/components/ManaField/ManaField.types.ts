import { Network } from '@dcl/schemas'
import { FieldProps } from 'decentraland-ui/dist/components/Field/Field'

export type Props = FieldProps & {
  network: Network
}
