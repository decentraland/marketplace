import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import stg from './env/stg.json'
import prod from './env/prod.json'

export const config = createConfig(
  {
    [Env.DEVELOPMENT]: dev,
    [Env.STAGING]: stg,
    [Env.PRODUCTION]: prod
  },
  {
    systemEnvVariables: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      REACT_APP_DCL_DEFAULT_ENV:
        process.env.VITE_REACT_APP_DCL_DEFAULT_ENV ?? 'dev'
    }
  }
)
