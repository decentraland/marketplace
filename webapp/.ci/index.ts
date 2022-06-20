import { env, envTLD } from 'dcl-ops-lib/domain'
import { buildStatic } from 'dcl-ops-lib/buildStatic'

async function main() {
  const domain = `market.decentraland.${env === 'prd' ? 'org' : envTLD}`

  const market = buildStatic({
    domain,
    defaultPath: 'index.html',
    unprotect: true,
    destroy: true
  })

  return {
    cloudfrontDistribution: market.cloudfrontDistribution,
    bucketName: market.contentBucket
  }
}
export = main
