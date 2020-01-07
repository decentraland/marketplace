import { spawn, SpawnOptions } from 'child_process'
import * as https from 'https'
import * as url from 'url'
import * as fs from 'fs'
import * as path from 'path'

enum Network {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten'
}
enum ContractName {
  MANACrowdsale = 'MANACrowdsale',
  MANAToken = 'MANAToken',
  LANDProxy = 'LANDProxy',
  EstateProxy = 'EstateProxy',
  MarketplaceProxy = 'MarketplaceProxy'
}
type ContractsResponse = Record<Network, Record<ContractName, string>>

const graphByNetwork: Record<Network, string> = {
  [Network.MAINNET]: 'decentraland/marketplace',
  [Network.ROPSTEN]: `decentraland/marketplace-ropsten`
}

const startBlockByNetwork: Record<Network, Record<ContractName, number>> = {
  [Network.MAINNET]: {
    MANACrowdsale: 4162059,
    MANAToken: 4162059,
    LANDProxy: 4944642,
    EstateProxy: 6236547,
    MarketplaceProxy: 6496012
  },
  [Network.ROPSTEN]: {
    MANACrowdsale: 0,
    MANAToken: 0,
    LANDProxy: 0,
    EstateProxy: 0,
    MarketplaceProxy: 0
  }
}

const contractNameToProxy: Record<string, ContractName> = {
  MANACrowdsale: ContractName.MANACrowdsale,
  MANAToken: ContractName.MANAToken,
  LANDRegistry: ContractName.LANDProxy,
  EstateRegistry: ContractName.EstateProxy,
  Marketplace: ContractName.MarketplaceProxy
}

// TODO: Handle ctrl+C
async function deploy() {
  const network = getNetwork()
  const contractsByNetwork: ContractsResponse = await fetch(
    'https://contracts.decentraland.org/addresses.json'
  )
  const contractAddresses = contractsByNetwork[network]
  const startBlocks = startBlockByNetwork[network]

  // TODO: ugly PATCH
  contractAddresses.MANACrowdsale =
    network == Network.MAINNET
      ? '0xa66d83716c7cfe425b44d0f7ef92de263468fb3d'
      : '0xca80041b1978bd0a9509b6bf41fbb708a0a54874'

  const basePath = path.resolve(__dirname, '../')
  const addressesPath = path.resolve(basePath, './src/modules/contract')

  const addressesFile = await readFile(`${addressesPath}/addresses.ts`)
  const subgraphFile = await readFile(`${basePath}/subgraph.yaml`)

  try {
    await moveFile(
      `${addressesPath}/addresses.ts`,
      `${addressesPath}/.addresses.ts`
    )

    const addressesToReplace = addressesFile.match(/{{\w+}}/g)

    let newAddressesFile = addressesFile
    for (const match of addressesToReplace) {
      // Example: {{LANDRegistry}}
      const contractName = match.replace(/{|}/g, '')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const address =
        contractAddresses[finalContractName] ||
        '0x0000000000000000000000000000000000000000'
      newAddressesFile = newAddressesFile.replace(match, address)
    }

    await writeFile(`${addressesPath}/addresses.ts`, newAddressesFile)

    // ============================================================

    await moveFile(`${basePath}/subgraph.yaml`, `${basePath}/.subgraph.yaml`)

    let newSubgraphFile = subgraphFile

    newSubgraphFile = newSubgraphFile.replace(/{{network}}/g, network) // TODO: this shouldn't be necessary here, the {{[a-zA-Z]+}} is too broad

    const addressesToReplace2 = newSubgraphFile.match(/{{[a-zA-Z]+}}/g)
    for (const match of addressesToReplace2) {
      // Example: {{LANDRegistry}}
      const contractName = match.replace(/{|}/g, '')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const address =
        contractAddresses[finalContractName] ||
        '0x0000000000000000000000000000000000000000'
      newSubgraphFile = newSubgraphFile.replace(match, address)
    }

    const startBlocksToReplace = newSubgraphFile.match(
      /{{[a-zA-Z]+_startBlock}}/g
    )

    for (const match of startBlocksToReplace) {
      // Example: {{LANDRegistry_startBlock}}
      const key = match.replace(/{|}/g, '')
      const [contractName] = key.split('_')
      const finalContractName =
        contractNameToProxy[contractName] || contractName
      const startBlock = startBlocks[finalContractName] || 0
      newSubgraphFile = newSubgraphFile.replace(match, startBlock.toString())
    }

    await writeFile(`${basePath}/subgraph.yaml`, newSubgraphFile)

    await run(
      `npx`,
      [
        'graph',
        'deploy',
        graphByNetwork[network],
        '--ipfs',
        'https://api.thegraph.com/ipfs/',
        '--node',
        'https://api.thegraph.com/deploy/'
      ],
      {
        stdio: 'inherit'
      }
    )

    await moveFile(
      `${addressesPath}/.addresses.ts`,
      `${addressesPath}/addresses.ts`
    )
    await moveFile(`${basePath}/.subgraph.yaml`, `${basePath}/subgraph.yaml`)
  } catch (error) {
    // await deleteFile(`${addressesPath}/.addresses.ts`)
    // await writeFile(`${addressesPath}/addresses.ts`, addressesFile)

    // await deleteFile(`${basePath}/.subgraph.yaml`)
    // await writeFile(`${basePath}/subgraph.yaml`, subgraphFile)
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
// Bash -------------------------------------------------------------

async function run(command: string, args: string[], options?: SpawnOptions) {
  return new Promise((resolve, reject) => {
    const program = spawn(command, args, options)

    program.on(
      'close',
      code => (code === 0 ? resolve() : reject(`Error: ${code}`))
    )
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
      "Supply a valid network using --network. Use `npm run deploy -- --network mainnet` if you're using npm"
    )
  }
  return network
}

deploy().then(() => console.log('All done'))
