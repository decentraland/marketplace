import type { Network } from "@dcl/schemas"
import type { ButtonProps } from "decentraland-ui/dist/components/Button/Button"

export type Props = ButtonProps & {
  assetNetwork: Network
}
