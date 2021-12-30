import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    onFetchStore(address)
  }, [onFetchStore, address])

  useEffect(() => {
    const newErrors: typeof errors = {}

    const validateSocialUrl = (type: LinkType) => {
      if (store[type] && !isValidLink(type, store[type])) {
        newErrors[type] = t('store_settings.link_start_with_error', {
          value: linkStartWiths[type]
        })
      }
    }

    validateSocialUrl(LinkType.WEBSITE)

    setErrors(newErrors)
  }, [store])

  const hasErrors = useMemo(
    () => Object.values(errors).some(error => !!error),
    [errors]
  )

  const getInputValue = useCallback(
    (type: LinkType) => store[type].replace(linkStartWiths[type], ''),
    [store]
  )

  const handleInputOnChange = useCallback(
    (type: LinkType, value: string) =>
      onChange({
        ...store,
        [type]: (!value ? '' : linkStartWiths[type] + value).replaceAll(' ', '')
      }),
    [store, onChange]
  )

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
            value={getInputValue(LinkType.FACEBOOK)}
            onChange={value => handleInputOnChange(LinkType.FACEBOOK, value)}
          />
          <div className="info">{facebook}</div>
        </InputContainer>
        <InputContainer title={t('store_settings.twitter')}>
          <TextInput
            type="input"
            value={getInputValue(LinkType.TWITTER)}
            onChange={value => handleInputOnChange(LinkType.TWITTER, value)}
          />
          <div className="info">{twitter}</div>
        </InputContainer>
        <InputContainer title={t('store_settings.discord')}>
          <TextInput
            type="input"
            value={getInputValue(LinkType.DISCORD)}
            onChange={value => handleInputOnChange(LinkType.DISCORD, value)}
          />
          <div className="info">{discord}</div>
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
