import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Badge, Color } from 'decentraland-ui'
import styles from './WarningBadge.module.css'

type Props = {
  className?: string
}

const WarningBadge = ({ className }: Props) => (
  <Badge
    className={classNames(styles.WarningIcon, styles.badge, className)}
    color={Color.OJ_NOT_SIMPSON}
  >
    {t('global.action_required')}
  </Badge>
)

export default WarningBadge
