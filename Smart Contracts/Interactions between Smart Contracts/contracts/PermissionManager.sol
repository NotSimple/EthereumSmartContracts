pragma solidity >=0.5.0 <0.6.0;


contract PermissionManager { // permission manager for each user
  address owner;
  mapping (bytes32 => bool) permissions; // Records user is allowed access to, indexed by Record hash

  modifier onlyOwner {
    require(
      msg.sender == owner,
      "Only owner can call this function."
    );
    _;
  }

  constructor() public {
    owner = msg.sender; // PermissionSystem contract
  }

  function grantPermission(bytes32 recordHash) external onlyOwner {
    permissions[recordHash] = true;
  }

  function revokePermission(bytes32 recordHash) external onlyOwner {
    permissions[recordHash] = false;
  }

  function hasPermission(bytes32 recordHash) public view returns (bool) {
    return  permissions[recordHash];
  }
}
