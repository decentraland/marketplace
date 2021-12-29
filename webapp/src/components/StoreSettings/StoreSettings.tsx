import React, { useEffect } from 'react'
import { Header, Row, Column, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import InputContainer from './InputContainer'
import CoverPicker from './CoverPicker'
import TextInput from './TextInput'
import { Props } from './StoreSettings.types'
import { locations } from '../../modules/routing/locations'
import './StoreSettings.css'

const StoreSettings = ({
  address,
  store,
  canSubmit,
  onChange,
  onRevert,
  onSave,
  onFetchStore
}: Props) => {
  const { cover, description, website, facebook, twitter, discord } = store

  useEffect(() => {
    onFetchStore(address)
  }, [onFetchStore, address])

  return (
    <div className="StoreSettings">
      <Row className="top">
        <Column>
          <Header>{t('store_settings.settings')}</Header>
        </Column>
        <Column align="right">
          <Link
            className="see-store-as-guest"
            to={locations.currentAccount({ viewAsGuest: true })}
          >
            {t('store_settings.see_store_as_guest')}
          </Link>
        </Column>
      </Row>
      <div className="elements">
        <InputContainer title={t('store_settings.store_cover')}>
          <CoverPicker
            src={cover}
            onChange={(src, name) =>
              onChange({
                ...store,
                cover: src || '',
                coverName: name || ''
              })
            }
          />
        </InputContainer>
        <InputContainer title={t('store_settings.description')}>
          <TextInput
            type="textarea"
            value={description}
            onChange={description => onChange({ ...store, description })}
          />
        </InputContainer>
        <InputContainer title={t('store_settings.website')}>
          <TextInput
            type="input"
            value={website}
            onChange={website => onChange({ ...store, website })}
          />
        </InputContainer>
        <InputContainer title={t('store_settings.facebook')}>
          <TextInput
            type="input"
            value={facebook}
            onChange={facebook => onChange({ ...store, facebook })}
          />
        </InputContainer>
        <InputContainer title={t('store_settings.twitter')}>
          <TextInput
            type="input"
            value={twitter}
            onChange={twitter => onChange({ ...store, twitter })}
          />
        </InputContainer>
        <InputContainer title={t('store_settings.discord')}>
          <TextInput
            type="input"
            value={discord}
            onChange={discord => onChange({ ...store, discord })}
          />
        </InputContainer>
      </div>
      <div className="bottom">
        <Button onClick={() => onSave(store)} primary disabled={!canSubmit}>
          {t('store_settings.save')}
        </Button>
        <Button onClick={onRevert} disabled={!canSubmit}>
          {t('store_settings.revert')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(StoreSettings)
