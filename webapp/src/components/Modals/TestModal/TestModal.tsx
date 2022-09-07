import { Modal } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, ModalNavigation } from 'decentraland-ui'
import React from 'react'
import { Props } from './TestModal.types'

const TestModal = ({ name, metadata, address, onConfirm, onClose }: Props) => {
  const { title, subtitle } = metadata

  return (
    <Modal name={name} onClose={onClose}>
      <ModalNavigation title={title} onClose={onClose} />
      <Modal.Content>
        <p>{address}</p>
        <p>{subtitle}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button secondary onClick={onClose}>
          {t('global.cancel')}
        </Button>
        <Button primary onClick={onConfirm}>
          {t('global.confirm')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(TestModal)

// export default class ClaimNameFatFingerModal extends React.PureComponent<
//   Props,
//   State
// > {
//   state: State = {
//     currentName: ''
//   }

//   handleClaim = () => {
//     const { onClaim } = this.props
//     const { currentName } = this.state

//     onClaim(currentName)
//   }

//   handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const name = event.target.value
//     this.setState({ currentName: name.replace(/\s/g, '') })
//   }

//   handleClose = () => {
//     const { onClose } = this.props
//     onClose()
//   }

//   render() {
//     const { name, metadata, isLoading } = this.props
//     const { originalName } = metadata
//     const { currentName } = this.state
//     const areNamesDifferent = currentName !== originalName
//     const hasError = areNamesDifferent && currentName.length > 0
//     return (
//       <Modal name={name} onClose={this.handleClose}>
//         <ModalNavigation
//           title={t('claim_name_fat_finger_modal.title')}
//           onClose={this.handleClose}
//         />
//         <Form onSubmit={this.handleClaim}>
//           <Modal.Content>
//             <div className="details">
//               <T
//                 id="claim_name_fat_finger_modal.description"
//                 values={{ name: <strong>{originalName}</strong> }}
//               />
//             </div>
//             <Field
//               placeholder={t('claim_name_fat_finger_modal.name_placeholder')}
//               value={currentName}
//               error={hasError}
//               message={
//                 hasError ? t('claim_name_fat_finger_modal.names_different') : ''
//               }
//               onChange={this.handleChangeName}
//             />
//           </Modal.Content>
//           <Modal.Actions>
//             <Button secondary onClick={this.handleClose} type="button">
//               {t('global.cancel')}
//             </Button>
//             <Button
//               primary
//               type="submit"
//               disabled={areNamesDifferent || isLoading}
//               loading={isLoading}
//             >
//               {t('global.confirm')}
//             </Button>
//           </Modal.Actions>
//         </Form>
//       </Modal>
//     )
//   }
// }
