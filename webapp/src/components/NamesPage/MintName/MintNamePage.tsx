import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Field, Form, Popup, Row, Section } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import NetworkButton from 'decentraland-dapps/dist/containers/NetworkButton'
import { NavigationTab } from '../../Navigation/Navigation.types'
import { builderUrl } from '../../../lib/environment'
import { Navbar } from '../../Navbar'
import { Footer } from '../../Footer'
import { Navigation } from '../../Navigation'
import { Props } from './MintNamePage.types'
import styles from './MintNamePage.module.css'
import {
  MAX_NAME_SIZE,
  PRICE,
  hasNameMinLength,
  isEnoughClaimMana,
  isNameAvailable,
  isNameValid
} from '../../../modules/ens/utils'
import { Mana } from '../../Mana'
import { useInput } from '../../../lib/input'
import { Network } from '@dcl/schemas'

const MintNamePage = (props: Props) => {
  const { onBrowse, currentMana } = props
  const [showMintFlow, setShowMintFlow] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNameChange = useCallback(async text => {
    try {
      console.log('checking if available')
      console.log('text: ', text)
      const isAvailable = await isNameAvailable(text)
      console.log('isAvailable result: ', isAvailable)
      setIsAvailable(isAvailable)
    } catch (error) {
      console.log('error: ', error)
      setIsError(true)
    }
  }, [])

  const [name, setName] = useInput('', handleNameChange, 1000)
  console.log('name: ', name)

  const [isAvailable, setIsAvailable] = useState(false)
  console.log('isAvailable: ', isAvailable)

  useEffect(() => {
    ;(async () => {})()
  }, [name])

  const handleClaim = useCallback(() => {
    setIsLoading(true)
  }, [])

  const isEnoughMana = useMemo(() => {
    return currentMana && isEnoughClaimMana(currentMana)
  }, [currentMana])
  console.log('isEnoughMana: ', isEnoughMana)

  const isValid = useMemo(() => {
    return isNameValid(name)
  }, [name])

  const isDisabled = !isValid || !isAvailable || !isEnoughMana

  const renderMintFlow = useCallback(() => {
    let message = ''
    if (isError) {
      message = t('names_page.error_message')
    } else if (!isAvailable) {
      message = t('names_page.repeated_message')
    } else if (name.length <= 2) {
      message = ''
    } else if (!isValid) {
      message = t('names_page.name_message')
    }

    return (
      <Form onSubmit={handleClaim}>
        <Section className={name.length === MAX_NAME_SIZE ? 'red' : ''}>
          <Field
            label={t('names_page.name_label')}
            value={name}
            message={message}
            placeholder={t('names_page.name_placeholder')}
            action={`${name.length}/${MAX_NAME_SIZE}`}
            error={
              isError || (hasNameMinLength(name) && !isValid) || !isAvailable
            }
            onChange={(_event: React.ChangeEvent<HTMLInputElement>) =>
              setName(_event)
            }
          />
        </Section>
        <Row className="actions">
          <Button
            className="cancel"
            onClick={() => setShowMintFlow(false)}
            type="button"
          >
            {t('global.cancel')}
          </Button>
          {!isLoading && !isEnoughMana ? (
            <Popup
              className="modal-tooltip"
              content={t('claim_ens_page.not_enough_mana')}
              position="top center"
              trigger={
                <div className="popup-button">
                  <NetworkButton
                    type="submit"
                    primary
                    disabled={isDisabled}
                    loading={isLoading}
                    network={Network.ETHEREUM}
                  >
                    {t('names_page.claim_button')}{' '}
                    <Mana inline>{PRICE.toLocaleString()}</Mana>
                  </NetworkButton>
                </div>
              }
              hideOnScroll={true}
              on="hover"
              inverted
            />
          ) : (
            <NetworkButton
              type="submit"
              primary
              disabled={isDisabled}
              loading={isLoading}
              network={Network.ETHEREUM}
            >
              {t('claim_ens_page.claim_button')}{' '}
              <Mana inline>{PRICE.toLocaleString()}</Mana>
            </NetworkButton>
          )}
        </Row>
      </Form>
    )
  }, [
    handleClaim,
    isAvailable,
    isDisabled,
    isEnoughMana,
    isError,
    isLoading,
    isValid,
    name,
    setName
  ])

  return (
    <div className={styles.mintNamePageContainer}>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.NAMES} />
      <div className={styles.mintNamePage}>
        {showMintFlow ? (
          renderMintFlow()
        ) : (
          <>
            <h2>{t('names_page.title')}</h2>
            <span>{t('names_page.subtitle')}</span>
            <div className={styles.buttons}>
              <Button primary onClick={() => setShowMintFlow(true)}>
                {t('names_page.claim_a_name')}
              </Button>
              <Button onClick={() => onBrowse()}>
                {t('names_page.browse_names_being_resold')}
              </Button>
              <Button inverted as={'a'} href={`${builderUrl}/claim-name`}>
                {t('names_page.manage_your_names')}
              </Button>
            </div>
          </>
        )}
      </div>

      <Footer isFullscreen />
    </div>
  )
}

export default React.memo(MintNamePage)
