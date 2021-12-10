import React, { useState } from 'react'
import { Header, Row, Column, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import InputContainer from './InputContainer'
import CoverPicker from './CoverPicker'
import TextInput from './TextInput'
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
        <InputContainer title="Store cover">
          <CoverPicker src={src} onChange={setSrc} />
        </InputContainer>
        <InputContainer title="Description">
          <TextInput
            type="textarea"
            value={description}
            onChange={setDescription}
          />
        </InputContainer>
        <InputContainer title="Website">
          <TextInput type="input" value={website} onChange={setWebsite} />
        </InputContainer>
        <InputContainer title="Facebook">
          <TextInput type="input" value={facebook} onChange={setFacebook} />
        </InputContainer>
        <InputContainer title="Twitter">
          <TextInput type="input" value={twitter} onChange={setTwitter} />
        </InputContainer>
        <InputContainer title="Discord">
          <TextInput type="input" value={discord} onChange={setDiscord} />
        </InputContainer>
      </div>
      <div className="bottom">
        <Button primary>Save</Button>
        <Button>Revert</Button>
      </div>
    </div>
  )
}

export default React.memo(StoreSettings)
