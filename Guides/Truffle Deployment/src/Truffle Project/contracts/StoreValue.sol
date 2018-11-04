pragma solidity ^0.4.22;


contract StoreValue{
    mapping (address => uint) value_stored;

    function updateMyValue(uint value) public{
        value_stored[msg.sender] = value;
    }

    function retrieveValue(address owner) public view returns (uint) {
        return value_stored[owner];
    }
}