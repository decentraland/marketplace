import { action } from 'typesafe-actions'
import { Profile } from './types'

// Load project profile

export const LOAD_PROFILE_REQUEST = '[Request] Load profile'
export const LOAD_PROFILE_SUCCESS = '[Success] Load profile'
export const LOAD_PROFILE_FAILURE = '[Failure] Load profile'

export const loadProfileRequest = (address: string) => action(LOAD_PROFILE_REQUEST, { address })
export const loadProfileSuccess = (address: string, profile: Profile) => action(LOAD_PROFILE_SUCCESS, { address, profile })
export const loadProfileFailure = (address: string, error: string) => action(LOAD_PROFILE_FAILURE, { address, error })

export type LoadProfileRequestAction = ReturnType<typeof loadProfileRequest>
export type LoadProfileSuccessAction = ReturnType<typeof loadProfileSuccess>
export type LoadProfileFailureAction = ReturnType<typeof loadProfileFailure>

// Change Profile
export const CHANGE_PROFILE = 'Change Profile'
export const changeProfile = (address: string, profile: Profile) => action(CHANGE_PROFILE, { address, profile })
export type ChangeProfileAction = ReturnType<typeof changeProfile>
