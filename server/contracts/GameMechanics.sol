// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameTokens.sol";

contract GameMechanics is Ownable {
    // Team special ability cooldowns (in turns)
    mapping(address => uint256) public eagleEyeCooldown;    // CIA
    mapping(address => uint256) public doubleAgentCooldown; // FSB
    mapping(address => uint256) public dragonEarCooldown;   // MSS
    mapping(address => uint256) public licenseToKillCooldown; // MI6
    mapping(address => uint256) public mirageCooldown;      // MOSSAD
    mapping(address => uint256) public shadowCooldown;      // NINJA

    // Team ability active status
    mapping(address => uint256) public eagleEyeActive;    // CIA: +25% Intel tokens for 3 turns
    mapping(address => uint256) public shadowActive;      // NINJA: Team comms obscured for 2 turns

    // Contract references
    AgentToken public agentToken;
    IntelToken public intelToken;

    // Events
    event SpecialAbilityUsed(address indexed player, string ability, uint256 timestamp);
    event AgentKilled(uint256 indexed agentId, address indexed killer);
    event DoubleAgentCreated(uint256 indexed agentId, address indexed newOwner);

    constructor(address _agentToken, address _intelToken) Ownable(msg.sender) {
        agentToken = AgentToken(_agentToken);
        intelToken = IntelToken(_intelToken);
    }

    // CIA: EAGLE EYE - +25% Intel tokens for successful missions for 3 turns
    function useEagleEye() public {
        require(eagleEyeCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "CIA"), "Not CIA member");
        
        eagleEyeActive[msg.sender] = 3; // Active for 3 turns
        eagleEyeCooldown[msg.sender] = 5; // Cooldown for 5 turns
        
        emit SpecialAbilityUsed(msg.sender, "EAGLE_EYE", block.timestamp);
    }

    // FSB: DOUBLE AGENT - Steals a target agent from another team
    function useDoubleAgent(uint256 targetAgentId) public {
        require(doubleAgentCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "FSB"), "Not FSB member");
        
        // Transfer ownership of the agent
        address currentOwner = agentToken.ownerOf(targetAgentId);
        require(currentOwner != msg.sender, "Cannot steal own agent");
        
        // Transfer the agent token
        // Note: This requires approval to be set up in the AgentToken contract
        agentToken.transferFrom(currentOwner, msg.sender, targetAgentId);
        
        doubleAgentCooldown[msg.sender] = 7; // Cooldown for 7 turns
        
        emit DoubleAgentCreated(targetAgentId, msg.sender);
    }

    // MSS: DRAGON EAR - gains access to a player's comms for 1 turn
    function useDragonEar(address target) public {
        require(dragonEarCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "MSS"), "Not MSS member");
        require(!isInShadow(target), "Target is in shadow");
        
        // Implementation for comms access would be handled off-chain
        dragonEarCooldown[msg.sender] = 5; // Cooldown for 5 turns
        
        emit SpecialAbilityUsed(msg.sender, "DRAGON_EAR", block.timestamp);
    }

    // MI6: LICENSE TO KILL - able to kill a target agent
    function useLicenseToKill(uint256 targetAgentId) public {
        require(licenseToKillCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "MI6"), "Not MI6 member");
        
        // Burn the agent token and its assets
        // Note: This requires the agent token contract to have a burn function
        agentToken.transferFrom(agentToken.ownerOf(targetAgentId), address(0), targetAgentId);
        
        licenseToKillCooldown[msg.sender] = 10; // Cooldown for 10 turns
        
        emit AgentKilled(targetAgentId, msg.sender);
    }

    // MOSSAD: MIRAGE - creates fake INTEL TOKENS
    function useMirage() public {
        require(mirageCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "MOSSAD"), "Not MOSSAD member");
        
        // Implementation for fake intel tokens would be handled in game logic
        mirageCooldown[msg.sender] = 6; // Cooldown for 6 turns
        
        emit SpecialAbilityUsed(msg.sender, "MIRAGE", block.timestamp);
    }

    // NINJA: SHADOW - Obscures all comms for entire team for 2 turns
    function useShadow() public {
        require(shadowCooldown[msg.sender] == 0, "Ability on cooldown");
        require(isTeamMember(msg.sender, "NINJA"), "Not NINJA member");
        
        shadowActive[msg.sender] = 2; // Active for 2 turns
        shadowCooldown[msg.sender] = 8; // Cooldown for 8 turns
        
        emit SpecialAbilityUsed(msg.sender, "SHADOW", block.timestamp);
    }

    // Helper function to check if a player is in shadow
    function isInShadow(address player) public view returns (bool) {
        return shadowActive[player] > 0;
    }

    // Helper function to check team membership
    function isTeamMember(address player, string memory team) internal view returns (bool) {
        // This would need to be implemented based on how team membership is stored
        // For now, returning true for testing
        return true;
    }

    // Function to update cooldowns and active effects each turn
    function updateTurnStatus() public onlyOwner {
        // This would be called by the game controller each turn
        // Update all cooldowns and active effects
    }
} 