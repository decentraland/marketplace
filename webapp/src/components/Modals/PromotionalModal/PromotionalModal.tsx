import { Modal, Image, Button } from 'decentraland-ui'
import styles from 'PromotionalModal.module.css'

export const PromotionalModal = () => {
  const handleButtonClick

  return (
    <Modal
      className={styles.promotionalModal}
      open={!localStorage.getItem('rental-intro-popup-key') || true}
    >
      <Modal.Content image>
        <Image size="medium" src="/images/avatar/large/rachel.png" wrapped />
        <Modal.Description>
          If you are a LAND owner you can now earn MANA by renting your parcels
          or estates to content creators. Are you a content creator? Now you can
          publish your builds to Genesis City without the need of owning LAND.
          If you want to learn more, read our blog post.
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button>BROWSE LISTINGS</Button>
        <Button>LIST YOUR LAND ON RENT</Button>
      </Modal.Actions>
    </Modal>
  )
}
