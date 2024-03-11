import { Card } from 'decentraland-ui'
import { Network } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import ChainProvider from 'decentraland-dapps/dist/containers/ChainProvider'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../../Mana'
import { Props } from './PartiallySupportedNetworkCard.types'
import styles from './PartiallySupportedNetworkCard.module.css'

export const PartiallySupportedNetworkCard = ({ asset }: Props) => (
  <ChainProvider>
    {({ chainId }) =>
      chainId && asset.network === Network.MATIC && getNetwork(chainId) === Network.MATIC ? (
        <Card className={styles.card}>
          <Card.Content>
            <p>
              {t('partially_supported_network_card.content', {
                mana: (children: React.ReactElement) => (
                  <Mana network={asset.network} inline withTooltip>
                    {children}
                  </Mana>
                )
              })}
            </p>
          </Card.Content>
        </Card>
      ) : null
    }
  </ChainProvider>
)
