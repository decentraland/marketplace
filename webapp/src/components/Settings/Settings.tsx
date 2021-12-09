import React from 'react'
import { Header, Row, Column } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import styles from './Settings.module.css'
import Element from './Element'
import CoverElement from './CoverElement'

const Settings = () => {
  return (
    <div>
      <Row className={styles.top}>
        <Column>
          <Header>Settings</Header>
        </Column>
        <Column align="right">
          <Link to="#">SEE STORE AS GUEST</Link>
        </Column>
      </Row>
      <div className={styles.elements}>
        <CoverElement title="Store cover" src="" onChange={() => {}} />
        <Element
          inputType="textarea"
          title="Description"
          input="I’m mat, here are my awesome creations, pls buy them so i can get more video games"
          onChange={() => {}}
        />
        <Element
          inputType="input"
          title="Website"
          input="matstore.com"
          onChange={() => {}}
        />
        <Element
          inputType="input"
          title="Facebook"
          input="facebook.com/matstore"
          onChange={() => {}}
        />
        <Element
          inputType="input"
          title="Twitter"
          input="twitter.com/matstore"
          onChange={() => {}}
        />
        <Element
          inputType="input"
          title="Discord"
          input="discord.com/matstore"
          onChange={() => {}}
        />
      </div>
    </div>
  )
}

export default React.memo(Settings)
