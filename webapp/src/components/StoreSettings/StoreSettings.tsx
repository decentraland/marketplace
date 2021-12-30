import React, { useEffect, useMemo, useState } from 'react'
import { Header, Row, Column, Button } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import InputContainer from './InputContainer'
import CoverPicker from './CoverPicker'
import TextInput from './TextInput'
import { Props } from './StoreSettings.types'
import { locations } from '../../modules/routing/locations'
import { LinkType, Store } from '../../modules/store/types'
import { isValidLink, linkStartWiths } from '../../modules/store/utils'
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

  const [errors, setErrors] = useState<{ [key in keyof Store]?: string }>({})

  const hasErrors = useMemo(
    () => Object.values(errors).some(error => !!error),
    [errors]
  )

  useEffect(() => {
    const newErrors: typeof errors = {}

    const validateSocialUrl = (type: LinkType) => {
      if (store[type] && !isValidLink(type, store[type])) {
        newErrors[type] = `Link must start with ${linkStartWiths[type]}`
      }
    }

    validateSocialUrl(LinkType.WEBSITE)
    validateSocialUrl(LinkType.FACEBOOK)
    validateSocialUrl(LinkType.TWITTER)
    validateSocialUrl(LinkType.DISCORD)

    setErrors(newErrors)
  }, [store])

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
            className={'see-store-as-guest'}
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
          {errors.website && <div className="error">{errors.website}</div>}
        </InputContainer>
        <InputContainer title={t('store_settings.facebook')}>
          <TextInput
            type="input"
            value={facebook}
            onChange={facebook => onChange({ ...store, facebook })}
          />
          {errors.facebook && <div className="error">{errors.facebook}</div>}
        </InputContainer>
        <InputContainer title={t('store_settings.twitter')}>
          <TextInput
            type="input"
            value={twitter}
            onChange={twitter => onChange({ ...store, twitter })}
          />
          {errors.twitter && <div className="error">{errors.twitter}</div>}
        </InputContainer>
        <InputContainer title={t('store_settings.discord')}>
          <TextInput
            type="input"
            value={discord}
            onChange={discord => onChange({ ...store, discord })}
          />
          {errors.discord && <div className="error">{errors.discord}</div>}
        </InputContainer>
      </div>
      <div className="bottom">
        <Button
          onClick={() => onSave(store)}
          primary
          disabled={!canSubmit || hasErrors}
        >
          {t('store_settings.save')}
        </Button>
        <Button onClick={() => onRevert(address)} disabled={!canSubmit}>
          {t('store_settings.revert')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(StoreSettings)
