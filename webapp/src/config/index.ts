import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import stg from './env/stg.json'
import prod from './env/prod.json'

export const config = createConfig({
  [Env.DEVELOPMENT]: dev,
  [Env.STAGING]: stg,
  [Env.PRODUCTION]: prod
})
