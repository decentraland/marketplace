import React from 'react'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Props = ModalProps & {
  title: string
  confirm_transaction_message: string
  action_message: string
  children: React.ReactNode
  isTransactionBeingConfirmed: boolean
  isSubmittingTransaction: boolean
  className?: string
  error: string | null
  onSubmitTransaction: () => void
}
