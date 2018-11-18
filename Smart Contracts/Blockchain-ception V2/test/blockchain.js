const Blockchain = artifacts.require('./Blockchain.sol');
const expectThrow = require('./helper.js');

contract('Blockchain', async (accounts) => {
  const genesisDataHash = web3.sha3('Genesis message');

  beforeEach(Blockchain.new);

  it('should give timestamp of record when owner is requesting it for an existing record', async () => {
    
    let instance = await Blockchain.deployed();
    let newRecordHash = web3.sha3('A new record');
    let blockHash = web3.sha3(genesisDataHash + newRecordHash.split('0x')[1], {encoding: 'hex'})

    await instance.addNewRecord(newRecordHash, {from: accounts[0]});
    await instance.getTimestamp(blockHash, {from: accounts[0]});
  });

  it('should give timestamp of record when non-owner is requesting it for an existing record', async () => {
    let instance = await Blockchain.deployed();
    let newRecordHash = web3.sha3('A new record');
    let blockHash = web3.sha3(genesisDataHash + newRecordHash.split('0x')[1], {encoding: 'hex'})

    await instance.addNewRecord(newRecordHash, {from: accounts[0]});
    await instance.getTimestamp(blockHash, {from: accounts[2]});
  });

  it('should not allow non-owner to add a new record', async () => {
    let instance = await Blockchain.deployed();
    let newRecordHash = web3.sha3('A new record');

    let tx = instance.addNewRecord(newRecordHash, {from: accounts[1]});
    await expectThrow(tx);
  });

  it('should throw error when trying to get timestamp of non existant block', async () => {
    let instance = await Blockchain.deployed();
    let falseBlockHash = web3.sha3(Date.now());

    let tx = instance.getTimestamp(falseBlockHash, {from: accounts[0]});
    await expectThrow(tx);
  });

});
