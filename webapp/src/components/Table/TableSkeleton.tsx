import React from 'react'
import { Table } from 'decentraland-ui'

import { Props } from './TableSkeleton.types'
import styles from './TableSkeleton.module.css'

const TableSkeleton = (props: Props) => {
  return (
    <div className={styles.TableSkeleton}>
      <Table basic="very" data-testid="listings-table"></Table>
    </div>
  )
}

export default React.memo(TableSkeleton)
