import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Header, Row, Column, Button, Loader } from 'decentraland-ui'
import { Link, Prompt } from 'react-router-dom'
import { Location } from 'history'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import InputContainer from './InputContainer'
import CoverPicker from './CoverPicker'
import TextInput from './TextInput'
import { Props } from './StoreSettings.types'
import { locations } from '../../modules/routing/locations'
import { LinkType, Store } from '../../modules/store/types'
import {
  getIsValidLink,
  getPrefixedCoverName,
  linkStartsWith
} from '../../modules/store/utils'
import './StoreSettings.css'

const MAX_FILE_SIZE = 1000000

const StoreSettings = ({
  address,
  store,
  canSubmit,
  error,
  isLoading,
  isSaving,
  onChange,
  onRevert,
  onSave,
  onFetchStore
}: Props) => {
  const { cover, description, website, facebook, twitter, discord } = store

  const [coverSize, setCoverSize] = useState<number>()

  const [errors, setErrors] = useState<
    { [key in keyof Store]?: string } & { size?: string }
  >({})

  useEffect(() => {
    onFetchStore(address)
  }, [onFetchStore, address])

  useEffect(() => {
    const newErrors: typeof errors = {}

    if (website && !getIsValidLink(LinkType.WEBSITE, website)) {
      newErrors[LinkType.WEBSITE] = t('store_settings.link_start_with_error', {
        value: linkStartsWith[LinkType.WEBSITE]
      })
    }

    if (coverSize !== undefined && coverSize > MAX_FILE_SIZE) {
      newErrors.size = t(`store_settings.size_error`, {
        max: sizeInMbs(MAX_FILE_SIZE),
        current: sizeInMbs(coverSize)
      })
    }

    setErrors(newErrors)

    function sizeInMbs(size: number) {
      return (
        (size / 1000000).toLocaleString(undefined, {
          maximumFractionDigits: 2
        }) + 'MB'
      )
    }
  }, [coverSize, website])

  const hasErrors = useMemo(
    () => Object.values(errors).some(error => !!error),
    [errors]
  )

  const getInputValue = useCallback(
    (type: LinkType) => store[type].replace(linkStartsWith[type], ''),
    [store]
  )

  const handleInputOnChange = useCallback(
    (type: LinkType, value: string) =>
      onChange({
        ...store,
        [type]: (!value ? '' : linkStartsWith[type] + value).replaceAll(' ', '')
      }),
    [store, onChange]
  )

  useEffect(() => {
    if (canSubmit) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = null
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [canSubmit])

  // returns true to allow the navigation to the next location
  const getPromptMessage = (location: Location<unknown>) => {
    if (location.search.includes('viewAsGuest=true')) return true
    return t('store_settings.unsaved_changes')
  }

  return (
    <div className="StoreSettings">
      <Prompt when={canSubmit} message={getPromptMessage} />
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
      {isLoading ? (
        <Loader size="massive" active />
      ) : (
        <>
          <div className="elements">
            <InputContainer title={t('store_settings.store_cover')}>
              <CoverPicker
                src={cover}
                onChange={(src, name, size) => {
                  setCoverSize(size)
                  onChange({
                    ...store,
                    cover: src || '',
                    coverName: name ? getPrefixedCoverName(name) : ''
                  })
                }}
              />
              {errors.size && <div className="error">{errors.size}</div>}
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
                onChange={value =>
                  handleInputOnChange(LinkType.FACEBOOK, value)
                }
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
              disabled={!canSubmit || hasErrors || isSaving}
              loading={isSaving}
            >
              {t('store_settings.save')}
            </Button>
            <Button
              onClick={() => {
                setErrors({})
                onRevert(address)
              }}
              disabled={isSaving || !canSubmit}
            >
              {t('store_settings.revert')}
            </Button>
          </div>
          {error && <div className="store-request-error">{error}</div>}
        </>
      )}
    </div>
  )
}

export default React.memo(StoreSettings)
