import { spawn, SpawnOptions } from 'child_process'

enum Network {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
  GOERLI = 'goerli',
  SEPOLIA = 'sepolia',
  TEMP = 'temp'
}

const graphByNetwork: Record<Network, string> = {
  [Network.MAINNET]: process.env.GRAPH_NAME || 'decentraland/marketplace',
  [Network.ROPSTEN]: process.env.GRAPH_NAME || 'decentraland/marketplace-ropsten',
  [Network.GOERLI]:  process.env.GRAPH_NAME || 'decentraland/marketplace-goerli',
  [Network.SEPOLIA]:  process.env.GRAPH_NAME || 'marketplace-sepolia',
  [Network.TEMP]:  process.env.GRAPH_NAME || 'decentraland/marketplace-temp'
}

// TODO: Handle ctrl+C
async function deploy() {
  const network = getNetwork()

  if (network !== Network.SEPOLIA) {
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
  } else {
    await run(
      'npx', 
      [
        'graph',
        'deploy',
        '--studio', 
        graphByNetwork[network]
      ], {
        stdio: 'inherit'
      }
    )
  }
}

// ------------------------------------------------------------------
// Bash -------------------------------------------------------------

async function run(command: string, args: string[], options?: SpawnOptions) {
  return new Promise((resolve, reject) => {
    const program = spawn(command, args, options)

    program.on('close', code =>
      code === 0 ? resolve() : reject(`Error: ${code}`)
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
