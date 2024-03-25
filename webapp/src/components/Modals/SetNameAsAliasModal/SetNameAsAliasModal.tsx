import classNames from 'classnames'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ModalNavigation, Button, Form, Icon, Profile } from 'decentraland-ui'
import UserIcon from '../../../images/user-circle.svg'
import VerifiedIcon from '../../../images/verified.svg'
import { Props } from './SetNameAsAliasModal.types'
import './SetNameAsAliasModal.css'

const SetNameAsAliasModal = ({ address, profile, metadata: { name }, isLoading, onSubmit, onClose }: Props) => {
  const successOnSetAlias = name === profile?.avatars[0].name && profile?.avatars[0].hasClaimedName && !isLoading

  return (
    <Modal name={name} onClose={isLoading ? undefined : onClose} className="SetNameAsAliasModal">
      <ModalNavigation
        title={successOnSetAlias ? t('set_name_as_alias_modal.success_title') : t('set_name_as_alias_modal.title')}
        onClose={isLoading ? undefined : onClose}
      />
      <Form onSubmit={() => !!address && onSubmit(address, name)}>
        <Modal.Content>
          <div className="details">
            <T
              id={successOnSetAlias ? 'set_name_as_alias_modal.success_description' : 'set_name_as_alias_modal.description'}
              values={{ name: <strong>{name}</strong> }}
            />
          </div>
          <div className="card">
            {profile && successOnSetAlias && address ? (
              <div className="successContainer">
                <Profile address={address} avatar={profile.avatars[0]} inline={false} size="massive" imageOnly />
                <div className="verified">
                  <span>{profile.avatars[0].name}</span>
                  <img src={VerifiedIcon} alt="verified icon" />
                </div>
              </div>
            ) : null}
            {!successOnSetAlias ? (
              <>
                <div className={classNames(profile?.avatars[0].hasClaimedName ? 'verified' : 'unverified')}>
                  <span>
                    {profile
                      ? profile.avatars[0].hasClaimedName
                        ? profile.avatars[0].name
                        : `${profile.avatars[0].name}#${address?.slice(-4)}`
                      : `${t('global.guest')}#4567`}
                  </span>

                  {profile?.avatars[0].hasClaimedName ? (
                    <img src={VerifiedIcon} alt="verified icon" />
                  ) : (
                    <img src={UserIcon} alt="user icon" />
                  )}
                </div>
                <Icon name="chevron right" />
                <Icon name="chevron right" />
                <Icon name="chevron right" />
                <div className="verified">
                  <span>{name}</span>
                  <img src={VerifiedIcon} alt="verified icon" />
                </div>
              </>
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
              <Button secondary onClick={onClose} disabled={isLoading} type="button">
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
