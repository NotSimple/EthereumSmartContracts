const SimpleLedger = artifacts.require('./SimpleLedger.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleLedger);
};
