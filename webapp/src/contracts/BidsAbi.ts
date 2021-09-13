import { ContractAbi } from 'web3x/contract'
export default new ContractAbi([
  {
    constant: true,
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_bidder',
        type: 'address'
      }
    ],
    name: 'getBidByBidder',
    outputs: [
      {
        name: 'bidIndex',
        type: 'uint256'
      },
      {
        name: 'bidId',
        type: 'bytes32'
      },
      {
        name: 'bidder',
        type: 'address'
      },
      {
        name: 'price',
        type: 'uint256'
      },
      {
        name: 'expiresAt',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ERC721Composable_ValidateFingerprint',
    outputs: [
      {
        name: '',
        type: 'bytes4'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'onERC721Received',
    outputs: [
      {
        name: '',
        type: 'bytes4'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_ownerCutPerMillion',
        type: 'uint256'
      }
    ],
    name: 'setOwnerCutPerMillion',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'bidIdByTokenAndBidder',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      },
      {
        name: '',
        type: 'uint256'
      }
    ],
    name: 'bidCounterByToken',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ERC721_Interface',
    outputs: [
      {
        name: '',
        type: 'bytes4'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'cancelBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'getBidByToken',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      },
      {
        name: '',
        type: 'address'
      },
      {
        name: '',
        type: 'uint256'
      },
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'account',
        type: 'address'
      }
    ],
    name: 'isPauser',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ERC721_Received',
    outputs: [
      {
        name: '',
        type: 'bytes4'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renouncePauser',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'manaToken',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_price',
        type: 'uint256'
      },
      {
        name: '_duration',
        type: 'uint256'
      }
    ],
    name: 'placeBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'account',
        type: 'address'
      }
    ],
    name: 'addPauser',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ONE_MILLION',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ownerCutPerMillion',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAX_BID_DURATION',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenAddress',
        type: 'address'
      },
      {
        name: '_tokenId',
        type: 'uint256'
      },
      {
        name: '_price',
        type: 'uint256'
      },
      {
        name: '_duration',
        type: 'uint256'
      },
      {
        name: '_fingerprint',
        type: 'bytes'
      }
    ],
    name: 'placeBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'bidIndexByBidId',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenAddresses',
        type: 'address[]'
      },
      {
        name: '_tokenIds',
        type: 'uint256[]'
      },
      {
        name: '_bidders',
        type: 'address[]'
      }
    ],
    name: 'removeExpiredBids',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MIN_BID_DURATION',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_manaToken',
        type: 'address'
      },
      {
        name: '_owner',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_id',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: '_tokenAddress',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_bidder',
        type: 'address'
      },
      {
        indexed: false,
        name: '_price',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_expiresAt',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_fingerprint',
        type: 'bytes'
      }
    ],
    name: 'BidCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_id',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: '_tokenAddress',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_bidder',
        type: 'address'
      },
      {
        indexed: true,
        name: '_seller',
        type: 'address'
      },
      {
        indexed: false,
        name: '_price',
        type: 'uint256'
      },
      {
        indexed: false,
        name: '_fee',
        type: 'uint256'
      }
    ],
    name: 'BidAccepted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_id',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: '_tokenAddress',
        type: 'address'
      },
      {
        indexed: true,
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_bidder',
        type: 'address'
      }
    ],
    name: 'BidCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_ownerCutPerMillion',
        type: 'uint256'
      }
    ],
    name: 'ChangedOwnerCutPerMillion',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address'
      }
    ],
    name: 'PauserAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address'
      }
    ],
    name: 'PauserRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  }
])
