import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './CardPaymentsExplanation.types'

const CardPaymentsExplanation = (props: Props) => {
  const { translationPageDescriptorId } = props

  return (
    <div className="card-payments-explanation">
      <p className="explanation">
        {t(`${translationPageDescriptorId}.explanation`, {
          link_to_transak: (
            <a href="https://transak.com/" target="_blank" rel="noopener noreferrer">
              Transak
            </a>
          ),
          regions: <span className="regions">{t(`${translationPageDescriptorId}.regions_where_operates`)}</span>
        })}
      </p>
      <a className="learn-more" href="https://transak.com/nft-checkout" target="_blank" rel="noopener noreferrer">
        {t('global.learn_more')}
      </a>
    </div>
  )
}

export default React.memo(CardPaymentsExplanation)
