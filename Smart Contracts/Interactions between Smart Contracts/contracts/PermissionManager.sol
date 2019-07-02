pragma solidity >=0.5.0 <0.6.0;


contract PermissionManager { // permission manager for each user
  address owner;
  mapping (bytes32 => uint256) startTimeOfPermission;
  mapping (bytes32 => uint256) endTimeOfPermission; // files user is allowed access to, indexed by file hash

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

  function addPermission(bytes32 recordHash, uint256 startTime, uint256 endTime) external onlyOwner {
    startTimeOfPermission[recordHash] = startTime;
    endTimeOfPermission[recordHash] = endTime;
  }

  function canAccessFileNow(bytes32 recordHash) public view returns (bool) {
    return startTimeOfPermission[recordHash] <= now && now <= endTimeOfPermission[recordHash];
  }
}
