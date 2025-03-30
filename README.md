# 🧙‍♂️ Wizard's Gambit - Enter the Arcane Realm

> *"Every duel tells a story, every spell leaves a mark. The battle of wizards is no mere contest—it’s a
 legend in the making."*

## ✨ Overview
Wizard's Gambit is not just a game—it’s an odyssey into a world where magic meets blockchain. 
This immersive experience combines **dynamic NFTs, strategic spellcasting, and high-stakes battles**, 
all powered by smart contracts. Step into the arena, summon legendary entities, and place your bets as
 wizards clash in duels of skill and destiny.

---

## 🔥 Core Components
### 🏆 WebSockets-Powered Real-Time Battles
- **1v1 PvP Combat**: Players can duel in real-time across different PCs.
- **Seamless Connectivity**: WebSockets ensure low-latency, high-speed interactions.
- **Live Spellcasting**: Experience instant magical duels without delays.
- **Cross-Platform Support**: Play from anywhere with uninterrupted battles.

### 🪄 Smart Contracts
#### 📜 RuneToken.sol
- Implements the ERC-20 `RuneToken`.
- Used for in-game transactions, including purchases and betting.
- Supports minting and burning mechanics.

#### 🔮 GameItems.sol
- Implements ERC-1155 for game assets (wands, spells, summon cards, and professor shards).
- Supports **dynamic NFT attributes** for evolving items.

#### 🧙‍♂️ Avatars.sol
- Implements ERC-721 **Dynamic NFTs** for player avatars.
- Metadata updates based on player actions, spell usage, and patronus assignments.

#### 🎭 MarketPlace.sol
- Allows purchases using `RuneToken`.
- Players can buy:
  - **Wands** (Essential for spellcasting)
  - **Spells** (Upgradeable using spell cards)
  - **Mystery Boxes** (Contains random summon cards: Inferno, Frost, or Tempest)
  - **Professor Boxes** (Contains shards for legendary items, e.g., Professor Snape’s Shard)
- **Spell Evolution**: Burn 100 summon cards to unlock higher-tier spells.
- **Chainlink VRF Integration**: Ensures true on-chain randomness when opening Mystery Boxes and Professor Boxes.

#### ⚔️ BattleArena.sol
- Governs all duels and battle mechanics.
- Rewards winners with `RuneToken`.
- **Integrated WebSocket architecture** ensures real-time combat synchronization.

#### 🎲 BettingSystem.sol
- Implements a **decentralized betting system** for battles.
- Players can place bets using `RuneToken`.
- Winnings are distributed based on the total betting pool.
- **Admin-controlled settlement** ensures fair play and secure payouts.

---

## 🏹 Player Onboarding (From Noob to Wizard)
1. **Personality Test 🧠** → Assigns a **Patronus** (ERC-1155 NFT).
2. **1000 Runes (ERC-20) 💰** → Players receive initial currency.
3. **Buy a Wand (ERC-1155) 🔮** → Essential for spellcasting.
4. **Unlock Spells (ERC-1155) 📜** → Enhance attack abilities.
5. **Dynamic Avatar (ERC-721) 🧙** → Evolves as the player progresses.

---

## 🎲 Gameplay Mechanics
- **Patronus Assignment**: Determined by a personality test.
- **Token Allocation**: Players distribute **Runes** (tokens) to Health, Mana, and Defense.
- **NFT Marketplace**: Players purchase and upgrade items.
- **Real-Time PvP Battles**: WebSockets enable ultra-fast duels.
- **Spectator Mode & Betting**: Watch battles unfold and bet on victors.
- **Dynamic Avatars**: NFTs evolve based on gameplay.

---

## 💰 Revenue Model
- **Custom Avatar Skins 🎨**: Players can purchase **visual upgrades** for avatars.
- **Mystery Box Sales 🎁**: Players buy boxes to obtain **rare summon cards**.
- **Betting System 🎲**: Platform earns a **small fee from bets** placed on battles.
- **Premium Spell Unlocks 🔥**: Exclusive **high-tier spells** available for purchase.

---

## 🛡️ Security Measures
- **Role-Based Access Control** for admin functions.
- **Secure Token Transfers** with allowance verification.
- **Randomized Item Distribution** for fairness.
- **WebSocket Security** to prevent unauthorized access.
- **Anti-Manipulation Mechanisms** in battle rewards & betting payouts.

---

## 🚀 Future Enhancements
- Expand **character NFT attributes** with additional evolution mechanics.
- Introduce **new spells & spell combinations**.
- Implement **staking mechanics** for passive rewards.
- Optimize **WebSockets** for even faster response times.
- Expand betting pools to allow multiple bettors per battle.

**Join the magic, claim your wand, and duel to glory! ⚡🧙‍♂️**

