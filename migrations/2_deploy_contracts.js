var LotteryContract = artifacts.require("./LotteryContract.sol");

require("dotenv").config({path: "../.env"});

module.exports = function(deployer) {
  deployer.deploy(LotteryContract, process.env.INITIAL_STAKE);
};
