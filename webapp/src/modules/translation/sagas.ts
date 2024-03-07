import { createTranslationSaga } from 'decentraland-dapps/dist/modules/translation/sagas'
import * as translations from './locales'

export const translationSaga = createTranslationSaga({
  translations: translations as any
})
