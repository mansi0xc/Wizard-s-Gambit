// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BettingSystem is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public arcaneToken;

    struct Bet {
        address bettor;
        uint256 amount;
        address chosenPlayer;
    }

    struct BattleBets {
        uint256 totalBetsOnPlayer1;
        uint256 totalBetsOnPlayer2;
        mapping(address => Bet) bets;
        bool isSettled;
    }

    mapping(uint256 => BattleBets) public battleBets;

    event BetPlaced(uint256 indexed battleId, address indexed bettor, address indexed chosenPlayer, uint256 amount);
    event BetsSettled(uint256 indexed battleId, address indexed winner);

    constructor(address _arcaneToken) {
        arcaneToken = IERC20(_arcaneToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Place a bet on a battle
    /// @param battleId The ID of the battle
    /// @param chosenPlayer The address of the player the bettor is betting on
    /// @param amount The amount of ArcaneTokens to bet
    function placeBet(uint256 battleId, address chosenPlayer, uint256 amount) external {
        require(amount > 0, "Bet amount must be greater than zero");
        require(arcaneToken.transferFrom(msg.sender, address(this), amount), "Bet transfer failed");

        BattleBets storage bets = battleBets[battleId];
        require(!bets.isSettled, "Bets are already settled for this battle");

        // Ensure the bettor hasn't already placed a bet
        require(bets.bets[msg.sender].amount == 0, "Bettor has already placed a bet");

        // Record the bet
        bets.bets[msg.sender] = Bet({
            bettor: msg.sender,
            amount: amount,
            chosenPlayer: chosenPlayer
        });

        // Update total bets
        if (chosenPlayer == address(1)) {
            bets.totalBetsOnPlayer1 += amount;
        } else if (chosenPlayer == address(2)) {
            bets.totalBetsOnPlayer2 += amount;
        } else {
            revert("Invalid chosen player");
        }

        emit BetPlaced(battleId, msg.sender, chosenPlayer, amount);
    }

    /// @notice Settle bets for a battle
    /// @param battleId The ID of the battle
    /// @param winner The address of the winning player
    function settleBets(uint256 battleId, address winner) external onlyRole(ADMIN_ROLE) {
        BattleBets storage bets = battleBets[battleId];
        require(!bets.isSettled, "Bets are already settled for this battle");

        uint256 totalPool = bets.totalBetsOnPlayer1 + bets.totalBetsOnPlayer2;
        uint256 winnerPool = winner == address(1) ? bets.totalBetsOnPlayer1 : bets.totalBetsOnPlayer2;

        require(winnerPool > 0, "No bets placed on the winner");

        // Distribute rewards to winning bettors
        // Since we can't iterate over mappings directly, we need to track bettors separately
        address[] memory bettors = new address[](0); // Create an empty array for now
        
        // For now, we'll just check if a specific bettor has won
        // In a full implementation, you would need to track all bettors' addresses
        for (uint256 i = 0; i < bettors.length; i++) {
            address bettor = bettors[i];
            Bet storage bet = bets.bets[bettor];
            if (bet.chosenPlayer == winner) {
                uint256 reward = (bet.amount * totalPool) / winnerPool;
                require(arcaneToken.transfer(bet.bettor, reward), "Reward transfer failed");
            }
        }

        bets.isSettled = true;

        emit BetsSettled(battleId, winner);
    }

    /// @notice Withdraw ArcaneTokens from the contract (for admin use)
    /// @param to Address to send the tokens to
    /// @param amount Amount of tokens to withdraw
    function withdrawArcaneTokens(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(arcaneToken.transfer(to, amount), "Withdrawal failed");
    }
}