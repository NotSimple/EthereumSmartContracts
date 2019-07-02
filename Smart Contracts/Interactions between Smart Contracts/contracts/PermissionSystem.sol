pragma solidity >=0.5.0 <0.6.0;
import "./PermissionManager.sol";

contract PermissionSystem {
  address owner;
  mapping (bytes32 => address) permissionManagers; // user permission manager contract addresses
  mapping (bytes32 => uint256) recordTimeStamps;

  modifier onlyOwner {
    require(
      msg.sender == owner,
      "only owner can call this function"
    );
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function addRecord(bytes32 recordHash) external onlyOwner {
    require(
      recordTimeStamps[recordHash] == 0,
      "record has already been added"
    );
    recordTimeStamps[recordHash] = now;
  }

  function createPermissionManager(bytes32 user) external onlyOwner {
    require(
      permissionManagers[user] == address(0),
      "user's permission manager already exists"
    );
    PermissionManager manager = new PermissionManager();
    permissionManagers[user] = address(manager);
  }

  function grantPermission(bytes32 user, bytes32 recordHash, uint256 startTime, uint256 endTime) external onlyOwner view {
    // call corresponding user permission manager contract and add permission
    require(
      permissionManagers[user] != address(0),
      "user doesn't have a permission manager"
    );
    require(
      recordTimeStamps[recordHash] > 0,
      "record doesn't exist"
    );
    require(
      startTime < endTime,
      "start time must be less than end time");
  }

  function canAccessFileNow(bytes32 recordHash, bytes32 user) external view returns (bool) {
    require(
      permissionManagers[user] != address(0),
      "user doesn't have a permission manager"
    );
    require(
      recordTimeStamps[recordHash] > 0,
      "record doesn't exist"
    );
    PermissionManager manager = PermissionManager(permissionManagers[user]);
    return manager.canAccessFileNow(recordHash); //call corresponding user permission manager contract and ask if user has permission

  }
}
