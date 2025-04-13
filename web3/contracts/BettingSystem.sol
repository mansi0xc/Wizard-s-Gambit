// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BettingSystem {
    IERC20 public arcaneToken;
    uint256 public constant PLATFORM_FEE_PERCENT = 20;
    uint256 public platformFeeBalance;

    struct Bet {
        address bettor;
        uint256 amount;
        address chosenPlayer;
    }

    struct Battle {
        address player1;
        address player2;
        bool exists;
    }

    struct BattleBets {
        uint256 totalBetsOnPlayer1;
        uint256 totalBetsOnPlayer2;
        Bet[] bets;
        bool isSettled;
    }

    mapping(uint256 => Battle) public battles;
    mapping(uint256 => BattleBets) public battleBets;

    event BattleRegistered(
        uint256 indexed battleId,
        address indexed player1,
        address indexed player2
    );
    event BetPlaced(
        uint256 indexed battleId,
        address indexed bettor,
        address indexed chosenPlayer,
        uint256 amount
    );
    event BetsSettled(
        uint256 indexed battleId,
        address indexed winner,
        uint256 platformFee
    );

    constructor(address _arcaneToken) {
        arcaneToken = IERC20(_arcaneToken);
    }

    function registerBattle(
        uint256 battleId,
        address player1,
        address player2
    ) external {
        require(!battles[battleId].exists, "Battle already exists");
        require(
            player1 != address(0) && player2 != address(0),
            "Invalid player addresses"
        );
        require(player1 != player2, "Players must be different");

        battles[battleId] = Battle(player1, player2, true);
        emit BattleRegistered(battleId, player1, player2);
    }

    function placeBet(
        uint256 battleId,
        address chosenPlayer,
        uint256 amount
    ) external {
        require(amount > 0, "Bet amount must be greater than zero");
        require(
            arcaneToken.transferFrom(msg.sender, address(this), amount),
            "Bet transfer failed"
        );

        BattleBets storage bets = battleBets[battleId];
        require(!bets.isSettled, "Bets are already settled for this battle");

        Battle storage battle = battles[battleId];
        require(battle.exists, "Battle does not exist");
        require(
            chosenPlayer == battle.player1 || chosenPlayer == battle.player2,
            "Invalid chosen player"
        );

        bets.bets.push(
            Bet({
                bettor: msg.sender,
                amount: amount,
                chosenPlayer: chosenPlayer
            })
        );

        if (chosenPlayer == battle.player1) {
            bets.totalBetsOnPlayer1 += amount;
        } else {
            bets.totalBetsOnPlayer2 += amount;
        }

        emit BetPlaced(battleId, msg.sender, chosenPlayer, amount);
    }

    function settleBets(uint256 battleId, address winner) external {
        BattleBets storage bets = battleBets[battleId];
        require(!bets.isSettled, "Bets are already settled for this battle");

        Battle storage battle = battles[battleId];
        require(battle.exists, "Battle does not exist");
        require(
            winner == battle.player1 || winner == battle.player2,
            "Invalid winner address"
        );
        require(
            msg.sender == battle.player1 || msg.sender == battle.player2,
            "Only battle players can settle bets"
        );

        uint256 totalPool = bets.totalBetsOnPlayer1 + bets.totalBetsOnPlayer2;
        uint256 platformFee = (totalPool * PLATFORM_FEE_PERCENT) / 100;
        platformFeeBalance += platformFee;

        uint256 remainingPool = totalPool - platformFee;
        uint256 winnerPool = winner == battle.player1
            ? bets.totalBetsOnPlayer1
            : bets.totalBetsOnPlayer2;

        require(winnerPool > 0, "No bets placed on the winner");

        for (uint256 i = 0; i < bets.bets.length; i++) {
            Bet storage bet = bets.bets[i];
            if (bet.chosenPlayer == winner) {
                uint256 reward = (bet.amount * remainingPool) / winnerPool;
                require(
                    arcaneToken.transfer(bet.bettor, reward),
                    "Reward transfer failed"
                );
            }
        }

        bets.isSettled = true;
        emit BetsSettled(battleId, winner, platformFee);
    }

    function withdrawPlatformFees(address to, uint256 amount) external {
        require(
            amount <= platformFeeBalance,
            "Insufficient platform fee balance"
        );
        platformFeeBalance -= amount;
        require(arcaneToken.transfer(to, amount), "Withdrawal failed");
    }
}
