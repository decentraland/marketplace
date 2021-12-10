import React, { useState } from 'react'
import { Header, Row, Column, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import DataContainer from './DataContainer'
import Cover from './Cover'
import Input from './Input'
import './StoreSettings.css'

const StoreSettings = () => {
  const [src, setSrc] = useState<string>()
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [discord, setDiscord] = useState('')

  return (
    <div className="StoreSettings">
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
            value={description}
            onChange={setDescription}
          />
        </DataContainer>
        <DataContainer title="Website">
          <Input type="input" value={website} onChange={setWebsite} />
        </DataContainer>
        <DataContainer title="Facebook">
          <Input type="input" value={facebook} onChange={setFacebook} />
        </DataContainer>
        <DataContainer title="Twitter">
          <Input type="input" value={twitter} onChange={setTwitter} />
        </DataContainer>
        <DataContainer title="Discord">
          <Input type="input" value={discord} onChange={setDiscord} />
        </DataContainer>
      </div>
      <div className="bottom">
        <Button primary>Save</Button>
        <Button>Revert</Button>
      </div>
    </div>
  )
}

export default React.memo(StoreSettings)
