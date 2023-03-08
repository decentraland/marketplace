import React, { useState } from 'react'
import { Table, Loader, Icon, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './OwnersTable.types'
import styles from './OwnersTable.module.css'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'


const OwnersTable = (props: Props) => {
  const { owners } = props

  const [isLoading] = useState(false)

  return (
    <div className={styles.OwnersTable}>
      {!isLoading ? (
        <>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className={styles.headerMargin}>
                    {t('owners_table.owner')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('owners_table.issue_number')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body className={isLoading ? 'is-loading' : ''}>
                {owners?.map((owner, index) => (
                  <Table.Row key={owner.issuedId}>
                    <Table.Cell>
                      <LinkedProfile
                        className={styles.linkedProfileRow}
                        address={owner.ownerId}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className={styles.issuedIdContainer}>
                        <div className={styles.row}>
                          <span>
                            <span className={styles.issuedId}>
                              {owner.issuedId}
                            </span>
                            /{owners?.length}
                          </span>
                          {index % 2 ? (
                            <ListedBadge className={styles.badge} />
                          ) : null}
                        </div>
                        <Button basic >
                          <Icon name="arrow right" className={styles.gotToNFT} />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {isLoading ? <Loader active /> : null}
              </Table.Body>
            </Table>
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default React.memo(OwnersTable)
