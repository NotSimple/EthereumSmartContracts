pragma solidity >=0.5.0 <0.6.0;


contract PermissionManager { // permission manager for each user
  address owner;
  mapping (bytes32 => bool) hasPermission; // files user is allowed access to, indexed by file hash

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
    hasPermission[recordHash] = true;
  }

  function revokePermission(bytes32 recordHash) external onlyOwner {
    hasPermission[recordHash] = false;
  }

  function canAccessFileNow(bytes32 recordHash) public view returns (bool) {
    return  hasPermission[recordHash];
  }
}
