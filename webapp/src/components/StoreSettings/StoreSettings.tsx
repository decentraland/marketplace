import React, { useState } from 'react'
import { Header, Row, Column, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import InputContainer from './InputContainer'
import CoverPicker from './CoverPicker'
import TextInput from './TextInput'
import './StoreSettings.css'

const StoreSettings = () => {
  const [cover, setCover] = useState<{ src: string; file: File }>()
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [discord, setDiscord] = useState('')

  return (
    <div className="StoreSettings">
      <Row className="top">
        <Column>
          <Header>{t('store_settings.settings')}</Header>
        </Column>
        <Column align="right">
          <Link className="see-store-as-guest" to="#">
            {t('store_settings.see_store_as_guest')}
          </Link>
        </Column>
      </Row>
      <div className="elements">
        <InputContainer title={t('store_settings.store_cover')}>
          <CoverPicker src={cover?.src} onChange={setCover} />
        </InputContainer>
        <InputContainer title={t('store_settings.description')}>
          <TextInput
            type="textarea"
            value={description}
            onChange={setDescription}
          />
        </InputContainer>
        <InputContainer title={t('store_settings.website')}>
          <TextInput type="input" value={website} onChange={setWebsite} />
        </InputContainer>
        <InputContainer title={t('store_settings.facebook')}>
          <TextInput type="input" value={facebook} onChange={setFacebook} />
        </InputContainer>
        <InputContainer title={t('store_settings.twitter')}>
          <TextInput type="input" value={twitter} onChange={setTwitter} />
        </InputContainer>
        <InputContainer title={t('store_settings.discord')}>
          <TextInput type="input" value={discord} onChange={setDiscord} />
        </InputContainer>
      </div>
      <div className="bottom">
        <Button primary>{t('store_settings.save')}</Button>
        <Button>{t('store_settings.revert')}</Button>
      </div>
    </div>
  )
}

export default React.memo(StoreSettings)
