import React, { useState } from 'react'
import { Header, Row, Column } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import DataContainer from './DataContainer'
import Cover from './Cover'
import Input from './Input'
import './Settings.css'

const Settings = () => {
  const [src, setSrc] = useState<string>()

  return (
    <div className="Settings">
      <Row className="top">
        <Column>
          <Header>Settings</Header>
        </Column>
        <Column align="right">
          <Link to="#">SEE STORE AS GUEST</Link>
        </Column>
      </Row>
      <div className="elements">
        <DataContainer title="Store cover">
          <Cover src={src} onChange={setSrc} />
        </DataContainer>
        <DataContainer title="Description">
          <Input
            type="textarea"
            value="I’m mat, here are my awesome creations, pls buy them so i can get more video games"
            onChange={() => {}}
          />
        </DataContainer>
        <DataContainer title="Website">
          <Input type="input" value="matstore.com" onChange={() => {}} />
        </DataContainer>
        <DataContainer title="Facebook">
          <Input
            type="input"
            value="facebook.com/matstore"
            onChange={() => {}}
          />
        </DataContainer>
        <DataContainer title="Twitter">
          <Input
            type="input"
            value="twitter.com/matstore"
            onChange={() => {}}
          />
        </DataContainer>
        <DataContainer title="Discord">
          <Input
            type="input"
            value="discord.com/matstore"
            onChange={() => {}}
          />
        </DataContainer>
      </div>
    </div>
  )
}

export default React.memo(Settings)
