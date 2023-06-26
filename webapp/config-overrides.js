const { override, babelInclude } = require('customize-cra')
const path = require('path')

module.exports = override(
  babelInclude([
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/react-virtualized-auto-sizer'),
    path.resolve(__dirname, 'node_modules/decentraland-connect/node_modules/@walletconnect'),
    path.resolve(__dirname, 'node_modules/@walletconnect')
  ])
)
