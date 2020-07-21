import { env, envTLD } from 'dcl-ops-lib/domain'
import { buildStatic } from 'dcl-ops-lib/buildStatic'

async function main() {
  const market = buildStatic({
    domain: `market.decentraland.${env === 'prd' ? 'org' : envTLD}`,
    defaultPath: 'index.html',
  })

  return {
    cloudfrontDistribution: market.cloudfrontDistribution,
    bucketName: market.contentBucket,
  }
}
export = main
