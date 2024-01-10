const { override, babelInclude } = require('customize-cra')
const path = require('path')

const overridedConfig = override(
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-virtualized-auto-sizer'),
    path.resolve(
      __dirname,
      'node_modules/decentraland-connect/node_modules/@walletconnect'
    ),
    path.resolve('node_modules/@metamask/utils/node_modules/superstruct'),
    path.resolve(__dirname, 'node_modules/@walletconnect'),
    path.resolve(__dirname, 'node_modules/@dcl/single-sign-on-client'),
    path.resolve(__dirname, 'node_modules/@0xsquid/sdk'),
    path.resolve(__dirname, 'node_modules/@cosmjs'),
    path.resolve(__dirname, 'node_modules/cosmjs-types'),
    path.resolve(__dirname, 'node_modules/ethers-multicall-provide'),
    path.resolve(__dirname, 'node_modules/@noble'),
    path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/ethers')
  ])
)

const jestConfig = config => {
  config.transformIgnorePatterns = [
    'node_modules/?!@0xsquid|eccrypto|libsodium-wrappers-sumo'
  ]
  config.moduleNameMapper = {
    ...config.moduleNameMapper,
    '@dcl/single-sign-on-client': 'identity-obj-proxy',
  }
  return config
}

overridedConfig.jest = jestConfig // looks counter-intuitive, but it works

module.exports = overridedConfig
