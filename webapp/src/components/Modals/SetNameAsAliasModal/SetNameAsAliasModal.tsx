import { ModalNavigation, Button, Form, Icon } from 'decentraland-ui'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './SetNameAsAliasModal.types'
import './SetNameAsAliasModal.css'

const SetNameAsAliasModal = ({
  address,
  profile,
  metadata: { name },
  isLoading,
  onSubmit,
  onClose
}: Props) => {
  const successOnSetAlias =
    name === profile?.avatars[0].name &&
    profile?.avatars[0].hasClaimedName &&
    !isLoading
  return (
    <Modal
      name={name}
      onClose={isLoading ? undefined : onClose}
      className="SetNameAsAliasModal"
    >
      <ModalNavigation
        title={
          successOnSetAlias
            ? t('set_name_as_alias_modal.success_title')
            : t('set_name_as_alias_modal.title')
        }
        onClose={isLoading ? undefined : onClose}
      />
      <Form onSubmit={() => !!address && onSubmit(address, name)}>
        <Modal.Content>
          <div className="details">
            <T
              id={
                successOnSetAlias
                  ? 'set_name_as_alias_modal.success_description'
                  : 'set_name_as_alias_modal.description'
              }
              values={{ name: <strong>{name}</strong> }}
            />
          </div>
          <div className="card">
            {profile ? (
              successOnSetAlias ? (
                <>
                  <span>{profile.avatars[0].name}</span>
                </>
              ) : (
                <>
                  <span>{profile.avatars[0].name}</span>
                  <Icon name="chevron right" />
                  <span>{name}</span>
                </>
              )
            ) : null}
          </div>
        </Modal.Content>
        <Modal.Actions>
          {successOnSetAlias ? (
            <>
              <Button primary onClick={onClose} type="button">
                {t('global.finish')}
              </Button>
            </>
          ) : (
            <>
              <Button
                secondary
                onClick={onClose}
                disabled={isLoading}
                type="button"
              >
                {t('global.cancel')}
              </Button>
              <Button primary type="submit" loading={isLoading}>
                {t('global.confirm')}
              </Button>
            </>
          )}
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default SetNameAsAliasModal
