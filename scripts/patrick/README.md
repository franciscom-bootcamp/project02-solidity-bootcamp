# Ballot Contract Scripts

Scripts for interacting with Ballot smart contract. Development purposes only.

## Prerequisites

The following .env variables are required

- `MNEMONIC` # Main account mnemonic
- `INFURA_API_KEY` # Infura api key
- `ALCHEMY_API_KEY` # Alchemy api key
- `ETHERSCAN_API_KEY` # Etherscan api key
- `ACCOUNT_ADDRESS` # Main account address
- `CONTRACT_ADDRESS` # Deployed contract address (obtained after deployment)
- `RIGHT_TO_VOTE_ADDRESS` # Address to provide vote rights
- `DELEGATE_ADDRESS` # Address to delegate rights to

## Local Development

```sh
$ yarn ts-node scripts/patrick/TestDeploy.ts # Local dev script (hardhat) for testing out all calls
```

## Goerli Testnet

```sh
$ yarn ts-node scripts/patrick/BallotDeploy.ts # Deploys contract
$ yarn ts-node scripts/patrick/BallotQuery.ts # Reads contract
$ yarn ts-node scripts/patrick/BallotRight.ts # Provides voting rights
$ yarn ts-node scripts/patrick/BallotCast.ts # Casts vote
$ yarn ts-node scripts/patrick/BallotDelegate.ts # Delegate vote
```
