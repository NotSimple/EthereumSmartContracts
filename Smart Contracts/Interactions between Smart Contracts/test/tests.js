const PermissionSystem = artifacts.require('./PermissionSystem.sol');
const PermissionManager = artifacts.require('./PermissionManager.sol');

// helpers
const expectThrow = require('./helper.js');

contract('PermissionSystem', async (accounts) => {
  let instance;
  let owner = accounts[0]; // owner of this contract
  let userA = accounts[1]; // not owner of this contract

	beforeEach(async () => {
		instance = await PermissionSystem.new();
  });
  context('Adding records', async () => {
    it('should allow owner to add a new record', async () => {
      const newRecordHash = web3.utils.sha3('record 1');
      await instance.addRecord(newRecordHash, {from: owner});
    });
  
    it('should not allow owner to add the same record more than once', async () => {
      const recordHash = web3.utils.sha3('record 2');
      await instance.addRecord(recordHash, {from: owner});
      let tx = instance.addRecord(recordHash, {from: owner});
      await expectThrow(tx);
    });
  
    it('should not allow non-owner to add a new record', async () => {
      recordHash = web3.utils.sha3('record 3');
      tx = instance.addRecord(recordHash, {from: userA});
      await expectThrow(tx);
    });
  })
});
