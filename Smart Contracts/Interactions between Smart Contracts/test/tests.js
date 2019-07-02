const PermissionSystem = artifacts.require('./PermissionSystem.sol');

// helpers
const {expectRevert, expectThrow} = require('./helper.js');

// revert throw reasons
ONLY_OWNER = 'only owner can call this function';
RECORD_EXISTS = 'record has already been added';
NO_RECORD = "record doesn't exist";
MANAGER_EXISTS = "user's permission manager already exists";
NO_MANAGER = "user doesn't have a permission manager";
NO_PERMISSION = "permission hasn't been granted";

contract('PermissionSystem', async (accounts) => {
  let instance;
  let owner = accounts[0]; // owner of this contract
  let non_owner_1 = accounts[1]; // not owner of this contract

	beforeEach(async () => {
		instance = await PermissionSystem.new();
  });

  context('Adding records', async () => {
    it('should allow owner to add a new record', async () => {
      let newRecordHash = web3.utils.sha3('record 1');
      await instance.addRecord(newRecordHash, {from: owner}); // add new record
    });

    it('should not allow owner to add the same record more than once', async () => {
      let recordHash = web3.utils.sha3('record 1');
      await instance.addRecord(recordHash, {from: owner}); // add new record
      let tx = instance.addRecord(recordHash, {from: owner}); // attempt to add it again
      await expectRevert(tx, RECORD_EXISTS);
    });

    it('should not allow a non-owner to add a new record', async () => {
      let recordHash = web3.utils.sha3('record 3');
      tx = instance.addRecord(recordHash, {from: non_owner_1}); // attempt to add new record
      await expectRevert(tx, ONLY_OWNER);
    });
  });

  context('Creating PermissionManagers', async () => {
    it('should allow owner to create a new permission manager contract', async () => {
      let user = 'Alice';
      let encodedUser = web3.utils.fromAscii(user);
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
    });

    it('should not allow owner to create a permission manager contract for a user who already has one', async () => {
      let user = 'Boris';
      let encodedUser = web3.utils.fromAscii(user);
      await instance.createPermissionManager(encodedUser, {from: owner}); // create first permission manager contract
      let tx = instance.createPermissionManager(encodedUser, {from: owner}); // attempt to create second permission manager contract for same user
      await expectRevert(tx, MANAGER_EXISTS);
    });

    it('should not allow a non-owner to create a permission manager contract', async () => {
      let user = 'Charlie';
      let encodedUser = web3.utils.fromAscii(user);
      let tx = instance.createPermissionManager(encodedUser, {from: non_owner_1});
      await expectRevert(tx, ONLY_OWNER);
    });
  });

  context('Granting permissions', async () => {
    let exampleRecord = web3.utils.sha3('example record');
    let encodedUser = web3.utils.fromAscii('Alice');

    it('should allow owner to grant a new permission to a user with an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      await instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // grant permission
    });

    it('should not allow owner to grant a new permission to a user without an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      let tx = instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // attempt to grant permission
      await expectRevert(tx, NO_MANAGER);
    });

    it('should not allow owner to grant a new permission for a non-existing record to a user with an existing permission manager contract', async () => {
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      let tx = instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // attempt to grant permission
      await expectRevert(tx, NO_RECORD);
    });

    it('should not allow a non-owner to grant a new permission to a user with an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      let tx = instance.grantPermission(encodedUser, exampleRecord, {from: non_owner_1}); // attempt to grant permission
      await expectRevert(tx, ONLY_OWNER);
    });
  });

  context('Revoking permissions', async () => {
    let exampleRecord = web3.utils.sha3('example record');
    let encodedUser = web3.utils.fromAscii('Alice');

    it('should allow owner to revoke an existing permission from a user with an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      await instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // grant permission
      await instance.revokePermission(encodedUser, exampleRecord, {from: owner}); // revoke permission
    });

    it('should not allow owner to revoke a non-existing permission from a user with an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      tx = instance.revokePermission(encodedUser, exampleRecord, {from: owner}); // attempt to revoke permission
      await expectRevert(tx, NO_PERMISSION);
    });

    it('should not allow a non-owner to revoke an existing permission from a user with an existing permission manager contract', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      await instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // grant permission
      let tx = instance.revokePermission(encodedUser, exampleRecord, {from: non_owner_1});
      await expectRevert(tx, ONLY_OWNER);
    });
  });

  context('Checking permissions', async () => {
    let exampleRecord = web3.utils.sha3('example record');
    let encodedUser = web3.utils.fromAscii('Alice');

    it('should not allow checking the permission if user\'s permission manager contract doesn\'t exist', async () => {
      await instance.addRecord(exampleRecord, {from: owner}); // add an example record
      let tx1 = instance.hasPermission(encodedUser, exampleRecord, {from: owner}); // attempt to get boolean value
      await expectThrow(tx1);
      let tx2 = instance.hasPermission(encodedUser, exampleRecord, {from: non_owner_1}); // attempt to get boolean value
      await expectThrow(tx2);
    });

    it('should not allow checking the permission if the record doesn\'t exist', async () => {
      await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
      let tx1 = instance.hasPermission(encodedUser, exampleRecord, {from: owner}); // attempt to get boolean value
      await expectThrow(tx1);
      let tx2 = instance.hasPermission(encodedUser, exampleRecord, {from: non_owner_1}); // attempt to get boolean value
      await expectThrow(tx2);
    });

    context('if a user has permission then it', async () => {
      it('should allow owner to verify that this user has the permission', async () => {
        await instance.addRecord(exampleRecord, {from: owner}); // add an example record
        await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
        await instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // grant permission
        let result = await instance.hasPermission(encodedUser, exampleRecord, {from: owner}); // get boolean value
        assert(result == true); // verify that user has the permission
      });

      it('should allow non-owner to verify this the user has the permission', async () => {
        await instance.addRecord(exampleRecord, {from: owner}); // add an example record
        await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
        await instance.grantPermission(encodedUser, exampleRecord, {from: owner}); // grant permission
        let result = await instance.hasPermission(encodedUser, exampleRecord, {from: non_owner_1}); // get boolean value
        assert(result == true); // verify that user has the permission
      });
    });
    context('if a user doesn\'t have permission then it', async () => {
      it('should allow owner to verify that this user doesn\'t have the permission', async () => {
        await instance.addRecord(exampleRecord, {from: owner}); // add an example record
        await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
        let result = await instance.hasPermission(encodedUser, exampleRecord, {from: owner}); // get boolean value
        assert(result == false); // verify that user doesn't have the permission
      });

      it('should allow non-owner to verify that this user doesn\'t have the permission', async () => {
        await instance.addRecord(exampleRecord, {from: owner}); // add an example record
        await instance.createPermissionManager(encodedUser, {from: owner}); // create permission manager contract
        let result = await instance.hasPermission(encodedUser, exampleRecord, {from: non_owner_1}); // get boolean value
        assert(result == false); // verify that user doesn't have the permission
      });
    });
    
  });

});
