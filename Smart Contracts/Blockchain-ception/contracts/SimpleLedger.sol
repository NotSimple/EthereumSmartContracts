pragma solidity ^0.4.22;

contract SimpleLedger {
    address owner;
    mapping (uint256 => uint256) timeStamp;

    constructor() public {
        owner = msg.sender; // set contract deployer as owner 
    }

    function addNewRecord(uint256 recordHash) public {
        require(msg.sender == owner, "not allowed to publish new records");
        require(timeStamp[recordHash] == 0, "record already exists");
        
        timeStamp[recordHash] = now; // set timestamp of new record
    }

    function getRecordTimestamp(uint256 recordHash) public view returns (uint256) {
        require(timeStamp[recordHash] > 0, "record doesn't exist");
        return timeStamp[recordHash];
    }
}
