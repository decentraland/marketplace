const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

// read .env 
const ENV_CONTENT = async () => {
  if (fs.existsSync('.env')) {
    return dotenv.parse(await fs.promises.readFile('.env'))
  } else {
    return {}
  }
}

// read package.json
const { version: packageVersion } = JSON.parse(
  await fs.promises.readFile('./package.json')
)

// read public/package.json 
const { version: publicPackageVersion } = JSON.parse(
  await fs.promises.readFile('./public/package.json')
)

// set version
ENV_CONTENT['REACT_APP_WEBSITE_VERSION'] = packageJson.version
publicPackageJson.version = packageJson.version

// set public url
Object.assign(ENV_CONTENT, getPublicUrls())
packageJson.homepage = ENV_CONTENT['PUBLIC_URL']
publicPackageJson.homepage = packageJson.homepage
if (packageJson.homepage) {
  // github action outputs. Do not touch.
  console.log('::set-output name=public_url::' + packageJson.homepage)
  console.log(
    '::set-output name=public_path::' + new URL(packageJson.homepage).pathname
  )
}

// log stuff
console.log('VERSIONS: ', Object.entries(ENV_CONTENT), '\n')

// save files
fs.writeFileSync(
  '.env',
  Object.entries(ENV_CONTENT)
    .map(e => e[0] + '=' + JSON.stringify(e[1]))
    .join('\n') + '\n'
)
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
fs.writeFileSync(
  './public/package.json',
  JSON.stringify(publicPackageJson, null, 2)
)

// public url logic
function getPublicUrls() {
  const isStatic = !!process.env.GEN_STATIC_LOCAL
  const isCI = !!process.env.CI
  const isVercel = isCI && !!process.env.VERCEL
  const isCDN = !isStatic && isCI && !isVercel
  console.log('is static', isStatic)
  console.log('is CI', isCI)
  console.log('is Vercel', isVercel)
  console.log('is CDN', isCDN)
  if (isCDN) {
    // master/main branch, also releases
    const cdnUrl = `https://cdn.decentraland.org/${publicPackageJson.name}/${publicPackageJson.version}`
    console.log(`Using CDN as public url: "${cdnUrl}"`)
    return {
      PUBLIC_URL: cdnUrl
    }
  }
  // localhost
  console.log(`Using empty pubic url`)
  return {
    PUBLIC_URL: ``
  }
}
