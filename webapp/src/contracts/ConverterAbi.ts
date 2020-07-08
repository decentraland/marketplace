import { ContractAbi} from 'web3x-es/contract';
export default new ContractAbi([
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_uniswapV2Router",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_dstToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_etherAmount",
        "type": "uint256"
      }
    ],
    "name": "calcNeededTokensForEther",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrader",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_dstToken",
        "type": "address"
      }
    ],
    "name": "swapEtherToToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_srcToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_srcAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxDstAmount",
        "type": "uint256"
      }
    ],
    "name": "swapTokenToEther",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "dstAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "srcRemainder",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]);