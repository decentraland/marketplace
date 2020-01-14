# Marketplace Frontend

Decentraland's Marketplace

## Setup

0. Fill environment variables

```
$ mv .env.example .env
$ vi .env
```

1. Install dependencies

```
$ npm install
```

2. Run development server

```
$ npm start
```

3. Build for production

```
$ npm run build
```

## Generate TypeScript interfaces for contracts

If you want to regenerate the contract typings in `webapp/src/contract` do the following:

```
npx web3x-codegen
```
