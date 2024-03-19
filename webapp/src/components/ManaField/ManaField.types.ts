import { Network } from '@dcl/schemas'
import { FieldProps, InputOnChangeData } from 'decentraland-ui'

export type Props = Omit<FieldProps, 'value'> & {
  network: Network
  value: string | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => unknown
}
