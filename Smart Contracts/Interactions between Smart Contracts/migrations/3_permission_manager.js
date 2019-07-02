const PermissionManager = artifacts.require('./PermissionManager.sol');

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(PermissionManager);
};
