import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  Button,
  Close,
  Container,
  Field,
  Icon,
  Loader,
  Popup,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import infoIcon from '../../../images/infoIcon.png'
import ClaimNameImage from '../../../images/claim-name.svg'
import ClaimNameBanner from '../../../images/claim-name-banner.png'
import CreateImg from '../../../images/names/create.png'
import GovernanceImg from '../../../images/names/governance.png'
import LandmarkImg from '../../../images/names/landmark.png'
import OwnSpaceImg from '../../../images/names/own-space.png'
import Chest from '../../../images/names/chest.png'
import Passports from '../../../images/names/passports.png'
import { lists } from '../../../modules/vendor/decentraland/lists/api'
import { SortBy } from '../../../modules/routing/types'
import {
  MAX_NAME_SIZE,
  NameInvalidType,
  getNameInvalidType,
  hasNameMinLength,
  isEnoughClaimMana,
  isNameAvailable,
  isNameValid
} from '../../../modules/ens/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import { NavigationTab } from '../../Navigation/Navigation.types'
import { builderUrl } from '../../../lib/environment'
import { Mana } from '../../Mana'
import { Props } from './ClaimNamePage.types'
import styles from './ClaimNamePage.module.css'
import { PageLayout } from '../../PageLayout'

const PLACEHOLDER_WIDTH = '94px'

const ClaimNamePage = (props: Props) => {
  const PLACEHOLDER_NAME = t('names_page.your_name')
  const {
    wallet,
    isConnecting,
    currentMana,
    onClaim,
    onBrowse,
    onRedirect
  } = props
  const location = useLocation()
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [bannedNames, setBannedNames] = useState<string[]>()
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobileOrTable = useTabletAndBelowMediaQuery()

  useEffect(() => {
    ;(async () => {
      try {
        const bannedNames = await lists.fetchBannedNames()
        setBannedNames(bannedNames)
      } catch (error) {}
    })()
  }, [])

  const [name, setName] = useState(PLACEHOLDER_NAME)

  const handleNameChange = useCallback(
    async text => {
      const valid = isNameValid(text)
      const minLength = hasNameMinLength(text)
      if (valid && minLength) {
        try {
          if (bannedNames?.includes(text.toLocaleLowerCase())) {
            setIsAvailable(undefined)
          } else {
            const isAvailable = await isNameAvailable(text)
            setIsAvailable(isAvailable)
          }
          setIsLoadingStatus(false)
        } catch (error) {
          console.log('error: ', error)
          setIsLoadingStatus(false)
        }
      }
    },
    [bannedNames]
  )

  const handleDebouncedChange = useCallback(
    text => {
      setName(text)
      const timeoutId = setTimeout(() => {
        if (debounceRef.current === timeoutId) {
          handleNameChange(text)
        }
      }, 1000)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = timeoutId
    },
    [handleNameChange]
  )

  useEffect(() => {
    if (
      name !== PLACEHOLDER_NAME &&
      name.length &&
      hasNameMinLength(name) &&
      isNameValid(name)
    ) {
      setIsLoadingStatus(true)
    } else if (!isNameValid(name)) {
      // turn off loading if an invalid character is typed
      setIsLoadingStatus(false)
    }
  }, [PLACEHOLDER_NAME, name])

  const handleClaim = useCallback(() => {
    if (!isConnecting && !wallet) {
      onRedirect(locations.signIn(`${location.pathname}`))
    } else {
      const isValid = isNameValid(name)
      const isEnoughMana =
        wallet && currentMana && isEnoughClaimMana(currentMana)

      if (!isValid || !isEnoughMana) return

      onClaim(name)
    }
  }, [
    isConnecting,
    wallet,
    name,
    currentMana,
    onClaim,
    onRedirect,
    location.pathname
  ])

  const inputRef = useRef<HTMLInputElement>(null)

  const [inputWidth, setInputWidth] = useState(PLACEHOLDER_WIDTH)

  // this fn is used to update the width of the input field so it has the suffix in the right place
  const updateWidth = (value: string) => {
    if (inputRef.current) {
      // Use a temporary span to measure the width of the input's content
      const tempSpan = document.createElement('span')
      tempSpan.innerHTML = value
      // Apply same font properties to the span
      tempSpan.style.fontSize = getComputedStyle(inputRef.current).fontSize
      tempSpan.style.fontFamily = getComputedStyle(inputRef.current).fontFamily
      tempSpan.style.visibility = 'hidden' // Hide the span element
      document.body.appendChild(tempSpan)
      // Update the width state to the width of the content plus a little extra space
      setInputWidth(`${tempSpan.offsetWidth + 2}px`)
      document.body.removeChild(tempSpan) // Clean up
    }
  }

  const [isInputFocus, setIsInputFocus] = useState(false)

  const onFieldClick = useCallback(() => {
    inputRef.current?.focus()
    setIsInputFocus(true)
  }, [])

  const onFieldFocus = useCallback(() => {
    const inputValue = inputRef.current?.value
    if (inputValue === PLACEHOLDER_NAME) {
      setName('')
    }
  }, [PLACEHOLDER_NAME])

  const renderRemainingCharacters = useCallback(() => {
    if (name !== PLACEHOLDER_NAME) {
      return (
        <span
          className={styles.remainingCharacters}
        >{`${name.length}/${MAX_NAME_SIZE}`}</span>
      )
    }
  }, [PLACEHOLDER_NAME, name])

  const nameInvalidType = useMemo(() => {
    return getNameInvalidType(name)
  }, [name])

  const onFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleDebouncedChange(event.target.value)
      updateWidth(event.target.value)
    },
    [handleDebouncedChange]
  )

  const cards = useMemo(() => {
    return [
      {
        image: CreateImg,
        title: t('names_page.why.stand_out.title'),
        description: t('names_page.why.stand_out.description'),
        className: styles.standOut
      },
      {
        image: OwnSpaceImg,
        title: t('names_page.why.unlock.title'),
        description: t('names_page.why.unlock.description', {
          link: (
            <a
              href="https://decentraland.org/blog/about-decentraland/decentraland-worlds-your-own-virtual-space"
              className={styles.learnMore}
            >
              {t('global.learn_more')}
            </a>
          )
        })
      },
      {
        image: GovernanceImg,
        title: t('names_page.why.governance.title'),
        description: t('names_page.why.governance.description', {
          b: (children: React.ReactChildren) => (
            <b className={styles.voting}>{children}</b>
          ),
          link: (
            <a
              href="https://docs.decentraland.org/player/general/dao/overview/what-is-the-dao"
              className={styles.learnMore}
            >
              {t('global.learn_more')}
            </a>
          )
        })
      },
      {
        image: LandmarkImg,
        title: t('names_page.why.get_url.title'),
        description: t('names_page.why.get_url.description', {
          b: (children: React.ReactChildren) => (
            <b className={styles.nameLink}>{children}</b>
          )
        })
      }
    ]
  }, [])

  return (
    <PageLayout activeTab={NavigationTab.NAMES}>
      <div className={styles.claimNamePageContainer}>
        <div className={styles.claimNamePage}>
          <Container className={styles.mainContainer}>
            <div className={styles.gradient}>
              <div className={classNames(styles.claimContainer, styles.card)}>
                {isInputFocus ? (
                  <Close onClick={() => setIsInputFocus(false)} />
                ) : null}
                <div className={styles.imageContainer}>
                  <div className={styles.imagePassportContainer}>
                    <img
                      className={classNames(
                        !isInputFocus && styles.visible,
                        styles.passportLogo
                      )}
                      src={ClaimNameImage}
                      alt="Claim name"
                    />
                    <h2 className={classNames(isInputFocus && styles.fadeOut)}>
                      {t('names_page.title')}
                    </h2>
                  </div>
                  <img
                    className={classNames(
                      styles.banner,
                      isInputFocus && styles.visible
                    )}
                    src={ClaimNameBanner}
                    alt="Banner"
                  />
                </div>

                <span className={styles.subtitle}>
                  {t('names_page.subtitle')}
                </span>
                <div className={styles.claimInput} onClick={onFieldClick}>
                  <Field
                    onClick={onFieldClick}
                    value={name}
                    placeholder={t('names_page.name_placeholder')}
                    action={`${name.length}/${MAX_NAME_SIZE}`}
                    children={
                      <>
                        <input
                          ref={inputRef}
                          value={name}
                          style={{
                            maxWidth: name.length ? inputWidth : '1px'
                          }}
                          onFocus={onFieldFocus}
                          onChange={onFieldChange}
                        />
                        <span className={styles.inputSuffix}>.dcl.eth</span>
                      </>
                    }
                  />
                  <div className={styles.remainingCharactersContainer}>
                    {isLoadingStatus ? (
                      <Loader active inline size="tiny" />
                    ) : null}
                    {renderRemainingCharacters()}
                  </div>
                  <Popup
                    className="modal-tooltip"
                    content={t('names_page.not_enough_mana')}
                    position="top center"
                    trigger={
                      <div className="popup-button">
                        <Button
                          primary
                          onClick={handleClaim}
                          disabled={
                            !isAvailable ||
                            nameInvalidType !== null ||
                            (currentMana !== undefined &&
                              !isEnoughClaimMana(currentMana))
                          }
                        >
                          {t('names_page.claim_a_name')}
                        </Button>
                      </div>
                    }
                    disabled={
                      !!(
                        wallet &&
                        currentMana &&
                        isEnoughClaimMana(currentMana)
                      )
                    }
                    hideOnScroll={true}
                    on="hover"
                    inverted
                  />

                  {name &&
                  hasNameMinLength(name) &&
                  isNameValid(name) &&
                  isInputFocus &&
                  name !== PLACEHOLDER_NAME &&
                  isAvailable !== undefined &&
                  bannedNames !== undefined &&
                  !isLoadingStatus ? (
                    <div className={styles.availableContainer}>
                      {isAvailable ? (
                        <>
                          <Icon name="check" />
                          {t('names_page.available')}
                        </>
                      ) : (
                        <>
                          <Icon name="close" />
                          {t('names_page.not_available', {
                            link: (
                              <a
                                className={styles.marketplaceLinkContainer}
                                href={locations.names({
                                  search: name,
                                  onlyOnSale: false,
                                  sortBy: SortBy.NEWEST,
                                  section: Section.ENS
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t('names_page.marketplace')}
                                <Icon name="external" />
                              </a>
                            )
                          })}
                        </>
                      )}
                    </div>
                  ) : name &&
                    (!hasNameMinLength(name) || !isNameValid(name)) ? (
                    <div className={styles.availableContainer}>
                      <Icon
                        className={styles.warningIcon}
                        name={
                          nameInvalidType === NameInvalidType.TOO_SHORT
                            ? 'exclamation triangle'
                            : 'close'
                        }
                      />
                      {nameInvalidType === NameInvalidType.TOO_SHORT
                        ? t('names_page.name_too_short')
                        : nameInvalidType === NameInvalidType.TOO_LONG
                        ? t('names_page.name_too_long')
                        : nameInvalidType === NameInvalidType.HAS_SPACES
                        ? t('names_page.has_spaces')
                        : t('names_page.invalid_characters')}
                    </div>
                  ) : null}
                </div>

                <span
                  className={classNames(
                    styles.nameCost,
                    isInputFocus && styles.fadeOut
                  )}
                >
                  {t('names_page.name_cost', {
                    mana: (
                      <>
                        <Mana inline /> 100 MANA
                      </>
                    ),
                    network: (
                      <span className={styles.nameCostNetwork}>
                        {t('names_page.ethereum_mainnet_network')}
                      </span>
                    )
                  })}
                  <Popup
                    content={t('names_page.dao_tooltip', {
                      link: (
                        <a
                          href="https://decentraland.zone/governance/proposal/?id=a3bdc100-9b34-11ed-ae61-5f6dd0bf8358"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('global.learn_more')}
                        </a>
                      )
                    })}
                    position="top center"
                    hoverable
                    mouseLeaveDelay={500}
                    trigger={
                      <img
                        src={infoIcon}
                        alt="info"
                        className={styles.informationTooltip}
                      />
                    }
                    on="hover"
                  />
                </span>
              </div>
            </div>
            <div className={styles.ctasContainer}>
              <h1>{t('names_page.why_names')}</h1>
              <div className={styles.cardsContainer}>
                {cards.map((card, index) => (
                  <div key={index} className={styles.card}>
                    <div
                      className={classNames(
                        styles.whyImgContainer,
                        card.className
                      )}
                    >
                      <img src={card.image} alt={card.title} />
                    </div>
                    <div className={styles.whyTextContainer}>
                      <span>{card.title}</span>
                      <p>{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.cardsContainer}>
                <div className={styles.nameTakenCard}>
                  <div className={styles.buttons}>
                    <div>
                      <img src={Chest} alt="Chest" />
                    </div>
                    <div>
                      <h2> {t('names_page.ctas.name_taken.title')}</h2>
                      <span>
                        {' '}
                        {t('names_page.ctas.name_taken.description')}
                      </span>
                      <Button onClick={() => onBrowse()}>
                        {t('names_page.browse_names_being_resold')}
                      </Button>
                    </div>
                  </div>
                </div>
                {!isMobileOrTable ? (
                  <div className={styles.manageNames}>
                    <div className={styles.buttons}>
                      <div>
                        <img src={Passports} alt="passports" />
                      </div>
                      <div style={{ justifyContent: 'center' }}>
                        <h2> {t('names_page.ctas.manage.title')}</h2>
                        <Button
                          inverted
                          as={'a'}
                          target="_blank"
                          href={`${builderUrl}/names`}
                        >
                          {t('names_page.manage_your_names')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </PageLayout>
  )
}

export default React.memo(ClaimNamePage)
