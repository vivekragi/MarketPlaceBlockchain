const HDWalletProvider = require("@truffle/hdwallet-provider")

const memonic = "version bicycle magic destroy food around lumber holiday fortune turn cupboard cupboard"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {

  ropsten: {

    provider: () => 
      new HDWalletProvider(memonic,  "https://ropsten.infura.io/v3/a48fcd99b6ca42e5b4acb5d72b6f942d"),
    
    network_id: 3,
    gas: 8000000,
    // gasPrice: 20000000,
    confirmations: 2,
    timeoutBlocks: 200,
    skipDryRun: true,

  },
},

  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },

};