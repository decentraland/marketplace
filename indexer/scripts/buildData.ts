import * as https from 'https'
import * as url from 'url'
import * as fs from 'fs'
import * as path from 'path'

enum Network {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten'
}
enum ContractName {
  MANAToken = 'MANAToken',
  LANDProxy = 'LANDProxy',
  EstateProxy = 'EstateProxy',
  MarketplaceProxy = 'MarketplaceProxy'
}
type ContractsResponse = Record<Network, Record<ContractName, string>>

const startBlockByNetwork: Record<Network, Record<ContractName, number>> = {
  [Network.MAINNET]: {
    MANAToken: 4162050,
    LANDProxy: 4944642,
    EstateProxy: 6236547,
    MarketplaceProxy: 6496012
  },
  [Network.ROPSTEN]: {
    MANAToken: 1891200,
    LANDProxy: 2482847,
    EstateProxy: 3890399,
    MarketplaceProxy: 4202120
  }
}

const contractNameToProxy: Record<string, ContractName> = {
  MANAToken: ContractName.MANAToken,
  LANDRegistry: ContractName.LANDProxy,
  EstateRegistry: ContractName.EstateProxy,
  Marketplace: ContractName.MarketplaceProxy
}

// TODO: Handle ctrl+C
async function build() {
  const network = getNetwork()
  const contractsByNetwork: ContractsResponse = await fetch(
    'https://contracts.decentraland.org/addresses.json'
  )
  const contractAddresses = contractsByNetwork[network]
  const startBlocks = startBlockByNetwork[network]

  const basePath = path.resolve(__dirname, '../')
  const addressesPath = path.resolve(basePath, './src/data')

  const addressesFile = await readFile(`${addressesPath}/.addresses.ts`)
  const subgraphFile = await readFile(`${basePath}/.subgraph.yaml`)

  try {
    const addressesToReplace = addressesFile.match(/{{address\:[a-zA-Z0-9]+}}/g)

    let newAddressesFile = addressesFile
    for (const match of addressesToReplace) {
      // Example: {{address:LANDRegistry}}
      const [_, contractName] = match.replace(/{|}/g, '').split(':')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const address =
        contractAddresses[finalContractName] ||
        '0x0000000000000000000000000000000000000000'
      newAddressesFile = newAddressesFile.replace(match, address)
    }

    await writeFile(`${addressesPath}/addresses.ts`, newAddressesFile)

    // ============================================================

    const addressesToReplace2 = subgraphFile.match(/{{address\:[a-zA-Z0-9]+}}/g)

    let newSubgraphFile = subgraphFile
    for (const match of addressesToReplace2) {
      // Example: {{address:LANDRegistry}}
      const [_, contractName] = match.replace(/{|}/g, '').split(':')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const address =
        contractAddresses[finalContractName] ||
        '0x0000000000000000000000000000000000000000'
      newSubgraphFile = newSubgraphFile.replace(match, address)
    }

    const startBlocksToReplace = newSubgraphFile.match(
      /{{startBlock\:[a-zA-Z0-9]+}}/g
    )

    for (const match of startBlocksToReplace) {
      // Example: {{startBlock:LANDRegistry}}
      const [_, contractName] = match.replace(/{|}/g, '').split(':')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const startBlock = startBlocks[finalContractName] || 0
      newSubgraphFile = newSubgraphFile.replace(match, startBlock.toString())
    }

    newSubgraphFile = newSubgraphFile.replace(/{{network}}/g, network)

    await writeFile(`${basePath}/subgraph.yaml`, newSubgraphFile)
  } catch (error) {
    await deleteFile(`${addressesPath}/addresses.ts`)
    await deleteFile(`${basePath}/subgraph.yaml`)

    throw error
  }
}

// ------------------------------------------------------------------
// HTTPS ------------------------------------------------------------

async function fetch(uri: string, method = 'GET'): Promise<any> {
  const { protocol, hostname, path } = url.parse(uri)

  if (protocol !== 'https:') {
    throw new Error('Only https is supported')
  }

  const options = {
    hostname,
    method,
    port: 443,
    path
  }
  return new Promise(function(resolve, reject) {
    const req = https.request(options, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Invalid request: ${res.statusCode}`))
      }

      let body = []
      res.on('data', chunk => body.push(chunk))

      res.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
          resolve(body)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', err => reject(err))
    req.end()
  })
}

// ------------------------------------------------------------------
// File -------------------------------------------------------------

async function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path,
      'utf-8',
      (err, data) => (err ? reject(err) : resolve(data))
    )
  })
}

async function moveFile(src: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.rename(src, destination, err => (err ? reject(err) : resolve()))
  })
}

async function deleteFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      resolve()
    }
    fs.unlink(path, err => (err ? reject(err) : resolve()))
  })
}

async function writeFile(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf-8', err => (err ? reject(err) : resolve()))
  })
}

// ------------------------------------------------------------------
// Args -------------------------------------------------------------

function getNetwork() {
  let network: Network
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--network') {
      network = process.argv[i + 1] as Network
      break
    }
  }

  if (!network || !Object.values(Network).includes(network)) {
    throw new Error(
      "Supply a valid network using --network. Use `npm run build -- --network mainnet` if you're using npm"
    )
  }
  return network
}

build().then(() => console.log('All done'))
