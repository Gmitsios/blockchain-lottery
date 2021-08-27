# blockchain-lottery

  The **Blockchain Lottery** is a smart contract developed in Solidity with truffle and React. 

##### Rules:
  - Any account can enter the Lottery.
  - Only the deployer account can pick the winner.
  - Enjoy Responsibly!

![](https://github.com/Gmitsios/blockchain-lottery/blob/main/screenshot.png)

### Dependencies:

- install [nodejs](https://nodejs.org/en/) with/and npm
-  `npm i -g truffle`
- install [ganache](https://www.trufflesuite.com/ganache)
  

Replace the '**MNEMONIC**' in `env.example` and rename it to `.env`

For **Metamask**:
- Add the [extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)
- Generate accounts with the same '**MNEMONIC**'
- Add a new network and connect it to Ganache (port: 7545)

  

## Migrate on Blockchain:
    
    npm install
    truffle migrate --network ganache_local
    truffle test --network ganache_local // if you want to run the tests

  

## Run the Front-End React App:

    cd client
    npm install
    npm run start
   
   