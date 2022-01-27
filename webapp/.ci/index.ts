import * as pulumi from '@pulumi/pulumi'
import * as cloudflare from '@pulumi/cloudflare'
import { env, envTLD } from 'dcl-ops-lib/domain'
import { buildStatic } from 'dcl-ops-lib/buildStatic'

async function main() {
  const domain = `market.decentraland.${env === 'prd' ? 'org' : envTLD}`

  const market = buildStatic({
    domain,
    defaultPath: 'index.html',
  })

  if (env === 'prd') {
    const config = new pulumi.Config()
    const hostHeaderOverride = config.requireSecret('sitemaps_target')
    const zoneId = config.requireSecret('cloudflare_zone_id')
    new cloudflare.PageRule(`marketplace-sitemaps-proxy`, {
      zoneId,
      target: domain + '/sitemap/*',
      actions: {
        ssl: 'flexible',
        alwaysOnline: 'on',
        hostHeaderOverride
      }
    })
  }

  return {
    cloudfrontDistribution: market.cloudfrontDistribution,
    bucketName: market.contentBucket,
  }
}
export = main
