import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import prod from './env/prod.json'
import stg from './env/stg.json'

export const config = createConfig(
  {
    [Env.DEVELOPMENT]: dev,
    [Env.STAGING]: stg,
    [Env.PRODUCTION]: prod
  },
  {
    systemEnvVariables: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      VITE_DCL_DEFAULT_ENV: process.env.VITE_DCL_DEFAULT_ENV ?? 'dev'
    }
  }
)
