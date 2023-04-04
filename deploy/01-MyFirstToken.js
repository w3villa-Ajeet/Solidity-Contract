const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utills/verify");
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { owner } = await getNamedAccounts();
    const args = [];
    console.log("owner account",owner);
    const token = await deploy("FirstToken", {
        from: owner,
        args,
        log: true,
        waitconfirmations: network.config.blockconfirmations
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY ) {
        log("verifying contract On chain wait a minute...")

        log('token.address',token.address)
        await verify('contracts/FirstToken.sol:FirstToken',token.address, args)
    }
    log("************************ Script Ended *************************")
}

module.exports.tags = ["all", "FirstToken"]