const PermissionSystem = artifacts.require('./PermissionSystem.sol');

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(PermissionSystem);
};
