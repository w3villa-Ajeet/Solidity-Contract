/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
// require("hardhat-deploy-ethers")
const {generateTestAccounts}=require('./test.helper')
let testingAccounts=generateTestAccounts(2)

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  solidity: "0.8.18",

  networks: {
    hardhat: {
      chainId: 31337,
      blockconfirmations: 1
    },
    sepolia: {
      chainId: 11155111,
      blockconfirmations: 10,
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY,...testingAccounts]
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },

  namedAccounts: {
    owner: 0,
    acc_1:1,
    acc_2:2,
  },
  
  mocha: {
    timeout: 80000000 //200 sec
  }
};
