const HDWalletProvider = require("@truffle/hdwallet-provider")

const memonic = "fit chunk april coin subject pear treat dolphin love travel half trap"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {

  ropsten: {

    provider: () => 
      new HDWalletProvider(memonic,  "wss://ropsten.infura.io/ws/v3/60b985e720394a1fab9fa51185c775e6"),
    
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
      version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)
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
// Ganache

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   networks: {
//     development: {
//       host: "localhost",
//       port: 7545,
//       network_id: "*"
//     }
//   },

//   compilers: {
//     solc: {
//       version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)
//       // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
//       // settings: {          // See the solidity docs for advice about optimization and evmVersion
//       //  optimizer: {
//       //    enabled: false,
//       //    runs: 200
//       //  },
//       //  evmVersion: "byzantium"
//       // }
//     }
//   },
// };