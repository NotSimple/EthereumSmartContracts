const SimpleLedger = artifacts.require('./SimpleLedger.sol');
const expectThrow = require('./helper.js');

contract('SimpleLedger', async (accounts) => {
  it('should not allow non-owner to add a new record', async () => {
    let instance = await SimpleLedger.deployed();
    let dataHash = web3.sha3('data for test 1');

    let tx = instance.addNewRecord(dataHash, {from: accounts[1]}); 
    await expectThrow(tx);
  });

  it('should throw error when trying to add record that already exists', async () => {
    let instance = await SimpleLedger.deployed();
    let dataHash = web3.sha3('data for test 2');

    await instance.addNewRecord(dataHash, {from: accounts[0]});
    let tx = instance.addNewRecord(dataHash, {from: accounts[0]});
    await expectThrow(tx);
  });

  it('should throw error when trying to get timestamp of non existant record', async () => {
    let instance = await SimpleLedger.deployed();
    let dataHash = web3.sha3('some non recorded data');

    let tx = instance.getRecordTimestamp(dataHash, {from: accounts[0]});
    await expectThrow(tx);
  });

  it('should give timestamp of record when requesting it for an existing record', async () => {
    let instance = await SimpleLedger.deployed();
    let dataHash = web3.sha3('data for test 4');
    
    await instance.addNewRecord(dataHash, {from: accounts[0]});
    value = await instance.getRecordTimestamp(dataHash, {from: accounts[0]});
    assert(value, Object);
  });

});
