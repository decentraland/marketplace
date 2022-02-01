import React, { useState } from 'react'
import { utils } from 'ethers'
import { Network } from '@dcl/schemas'
import {
  ModalNavigation,
  ModalContent,
  ModalActions,
  Form,
  Field,
  Button,
  InputOnChangeData,
  FieldProps,
  Mana
} from 'decentraland-ui'
import { NetworkButton } from 'decentraland-dapps/dist/containers'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import Info from '../Info'
import { Props } from './EditPriceAndBeneficiaryModal.types'
import './EditPriceAndBeneficiaryModal.css'

interface ModalState {
  price: string
  beneficiary: string
  isOnSale: boolean
}

export default function EditPriceAndBeneficiaryModal({
  item,
  isLoading,
  onSetPriceAndBeneficiary,
  onClose
}: Props) {
  const [itemProps, setItemProps] = useState<ModalState>({
    price: Number(utils.formatEther(item.price)).toFixed(0),
    beneficiary: item.beneficiary || item.creator,
    isOnSale: +item.price > 0
  })

  const handleIsNotForSaleToggle = () => {
    setItemProps(prevItemProps => {
      const isItemOnSale = !prevItemProps.isOnSale
      return {
        beneficiary: isItemOnSale ? '' : item.creator,
        price: isItemOnSale ? '' : '0',
        isOnSale: isItemOnSale
      }
    })
  }

  const isGift = itemProps.beneficiary !== item.creator

  const handleIsGiftToggle = () => {
    setItemProps(prevProps => ({
      ...prevProps,
      beneficiary: isGift ? item.creator : '',
      isOnSale: true
    }))
  }

  const registerHandleFieldChange = (field: 'price' | 'beneficiary') => (
    _event: React.ChangeEvent<HTMLInputElement>,
    props: InputOnChangeData
  ) => {
    setItemProps(prevItemProps => ({ ...prevItemProps, [field]: props.value }))
  }

  const handleSubmit = () => {
    const { price, beneficiary } = itemProps
    const priceInWei = utils.parseEther(price!).toString()

    onSetPriceAndBeneficiary(item.id, priceInWei, beneficiary!)
  }

  const isValidBeneficiary = () => {
    return utils.isAddress(itemProps.beneficiary)
  }

  const isValidPrice = () => {
    const { price, beneficiary } = itemProps
    const numberPrice = Number(price)
    return (
      Number(numberPrice) > 0 ||
      (numberPrice === 0 && beneficiary === item.creator)
    )
  }

  const isButtonDisabled = () => {
    return !isValidPrice() || !isValidBeneficiary() || isLoading
  }

  const { price, isOnSale, beneficiary } = itemProps

  return (
    <Modal
      size="tiny"
      onClose={onClose}
      className="EditPriceAndBeneficiaryModal"
    >
      <ModalNavigation
        title={t('edit_price_and_beneficiary_modal.title', { name: item.name })}
        subtitle={
          <div className="actions">
            <Button size="mini" onClick={handleIsGiftToggle} active={!isGift}>
              {t('edit_price_and_beneficiary_modal.for_me')}
            </Button>
            <Button
              size="mini"
              onClick={handleIsNotForSaleToggle}
              active={!isOnSale}
            >
              {t('edit_price_and_beneficiary_modal.not_for_sale')}
            </Button>
          </div>
        }
        onClose={onClose}
      />

      <Form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="price-field">
            <Field
              label={t('edit_price_and_beneficiary_modal.price_label')}
              placeholder={100}
              value={price}
              onChange={registerHandleFieldChange('price')}
              disabled={!isOnSale}
              error={!!price && isOnSale && !isValidPrice()}
            />
            <Mana network={Network.MATIC} inline />
          </div>
          <Field
            label={
              (
                <>
                  {t('edit_price_and_beneficiary_modal.beneficiary_label')}
                  <Info
                    content={t(
                      'edit_price_and_beneficiary_modal.beneficiary_popup'
                    )}
                  />
                </>
              ) as FieldProps['label']
            }
            type="address"
            placeholder="0x..."
            value={beneficiary}
            disabled={!isOnSale}
            onChange={registerHandleFieldChange('beneficiary')}
            error={!!beneficiary && !isValidBeneficiary()}
          />
        </ModalContent>
        <ModalActions>
          <NetworkButton
            primary
            disabled={isButtonDisabled()}
            loading={isLoading}
            network={Network.MATIC}
          >
            {t('global.submit')}
          </NetworkButton>
        </ModalActions>
      </Form>
    </Modal>
  )
}
