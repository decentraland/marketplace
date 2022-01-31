import React, { useState } from 'react'
import { Address } from 'web3x/address'
import { fromWei, toWei } from 'web3x/utils'
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
import { utils } from 'ethers'
import Info from '../Info'
import { Props } from './EditPriceAndBeneficiaryModal.types'
import './EditPriceAndBeneficiaryModal.css'

interface ModalState {
  price?: string
  beneficiary?: string
  isFree: boolean
}

export default function EditPriceAndBeneficiaryModal({
  item,
  isLoading,
  onSetPriceAndBeneficiary,
  onClose
}: Props) {
  const [itemProps, setItemProps] = useState<ModalState>({
    price: item.price ? fromWei(item.price, 'ether') : undefined,
    beneficiary: item.beneficiary || item.creator,
    isFree: false
  })

  const getItemPrice = () => {
    return item.price ? fromWei(item.price, 'ether') : undefined
  }

  const handleIsFreeToggle = () => {
    setItemProps(prevItemProps => ({
      beneficiary: prevItemProps.isFree ? undefined : Address.ZERO.toString(),
      price: prevItemProps.isFree ? undefined : '0',
      isFree: !prevItemProps.isFree
    }))
  }

  const isGift = itemProps.beneficiary !== item.creator

  const handleIsGiftToggle = () => {
    setItemProps({
      beneficiary: isGift ? item.creator : '',
      price: getItemPrice(),
      isFree: false
    })
  }

  const registerHandleFieldChange = (field: 'price' | 'beneficiary') => (
    _event: React.ChangeEvent<HTMLInputElement>,
    props: InputOnChangeData
  ) => {
    setItemProps(prevItemProps => ({ ...prevItemProps, [field]: props.value }))
  }

  const handleSubmit = () => {
    const { price, beneficiary } = itemProps
    const priceInWei = toWei(price!, 'ether')

    onSetPriceAndBeneficiary(item.id, priceInWei, beneficiary!)
  }

  const isValidBeneficiary = () => {
    return utils.isAddress(itemProps.beneficiary || '')
  }

  const isValidPrice = () => {
    const { price, beneficiary } = itemProps
    const numberPrice = Number(price)
    return (
      Number(numberPrice) > 0 ||
      (numberPrice === 0 && beneficiary === Address.ZERO.toString())
    )
  }

  const isButtonDisabled = () => {
    return !isValidPrice() || !isValidBeneficiary() || isLoading
  }

  const { price, isFree, beneficiary } = itemProps

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
            <Button size="mini" onClick={handleIsFreeToggle} active={isFree}>
              {t('edit_price_and_beneficiary_modal.free')}
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
              disabled={isFree}
              error={!!price && !isValidPrice()}
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
            disabled={isFree}
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
