// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./ArcaneTokenERC20.sol";

contract BattleArena {
    ArcaneToken public arcane;
    uint256 public rewardAmount = 50 * 10 ** 18; // Default reward amount

    event BattleResult(address winner, uint256 reward);

    constructor(address _arcane) {
        arcane = ArcaneToken(_arcane);
    }

    function setRewardAmount(uint256 _rewardAmount) external {
        rewardAmount = _rewardAmount;
    }

    function battle(
        address winner,
        uint256 rewardTokens
    ) external returns (address) {
        require(winner != address(0), "Invalid player address");
        require(rewardTokens != 0, "rewardTokens cannot be 0 nigga");

        arcane.mint(winner, rewardTokens);

        emit BattleResult(winner, rewardTokens);
        return winner;
    }
}
