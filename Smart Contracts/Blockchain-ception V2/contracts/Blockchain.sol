pragma solidity ^0.4.22;

contract Blockchain {
    address owner;

    mapping (bytes32 => bytes32) blocks;
    mapping (bytes32 => uint256) timeStamps;
    bytes32 lastHash;

    constructor() public {
        owner = msg.sender; // set contract deployer as owner
        lastHash = keccak256("Genesis message");
    }

    function addNewRecord(bytes32 recordHash) public {
        require(msg.sender == owner, "not allowed to publish new records");

        bytes32 newBlockHash = keccak256(abi.encodePacked(lastHash, recordHash));
        blocks[newBlockHash] = lastHash;
        timeStamps[newBlockHash] = now;
        lastHash = newBlockHash;
    }

    function getTimestamp(bytes32 blockHash) public view returns (uint256) {
        require(timeStamps[blockHash] > 0, "block doesn't exist");
        return timeStamps[blockHash];
    }
}
