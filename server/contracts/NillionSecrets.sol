// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@nillion/sdk/contracts/INillionStorage.sol";

contract NillionSecrets is Ownable {
    INillionStorage public nillionStorage;
    
    // Mapping from secret ID to metadata
    mapping(bytes32 => SecretMetadata) public secrets;
    
    struct SecretMetadata {
        address owner;
        uint256 revealTime;
        bool isRevealed;
        string secretType; // "MISSION", "AGENT", "ASSET", "INTEL"
    }

    event SecretStored(bytes32 indexed secretId, address indexed owner, string secretType);
    event SecretRevealed(bytes32 indexed secretId, address indexed revealer);
    event SecretAccessGranted(bytes32 indexed secretId, address indexed grantee);

    constructor(address _nillionStorage) Ownable(msg.sender) {
        nillionStorage = INillionStorage(_nillionStorage);
    }

    // Store a new secret
    function storeSecret(
        bytes calldata encryptedData,
        string memory secretType
    ) public returns (bytes32) {
        bytes32 secretId = nillionStorage.store(encryptedData);
        
        secrets[secretId] = SecretMetadata({
            owner: msg.sender,
            revealTime: 0,
            isRevealed: false,
            secretType: secretType
        });

        emit SecretStored(secretId, msg.sender, secretType);
        return secretId;
    }

    // Schedule a secret to be revealed
    function scheduleReveal(bytes32 secretId, uint256 revealTime) public {
        require(secrets[secretId].owner == msg.sender, "Not secret owner");
        require(!secrets[secretId].isRevealed, "Already revealed");
        require(revealTime > block.timestamp, "Invalid reveal time");

        secrets[secretId].revealTime = revealTime;
    }

    // Reveal a secret if conditions are met
    function revealSecret(bytes32 secretId) public {
        SecretMetadata storage metadata = secrets[secretId];
        require(metadata.revealTime > 0, "Reveal not scheduled");
        require(block.timestamp >= metadata.revealTime, "Too early to reveal");
        require(!metadata.isRevealed, "Already revealed");

        metadata.isRevealed = true;
        emit SecretRevealed(secretId, msg.sender);
    }

    // Grant access to a secret to another address
    function grantAccess(bytes32 secretId, address grantee) public {
        require(secrets[secretId].owner == msg.sender, "Not secret owner");
        nillionStorage.grantAccess(secretId, grantee);
        emit SecretAccessGranted(secretId, grantee);
    }

    // Check if a secret is revealed
    function isRevealed(bytes32 secretId) public view returns (bool) {
        return secrets[secretId].isRevealed;
    }

    // Get secret metadata
    function getSecretMetadata(bytes32 secretId) public view returns (
        address owner,
        uint256 revealTime,
        bool isRevealed,
        string memory secretType
    ) {
        SecretMetadata memory metadata = secrets[secretId];
        return (
            metadata.owner,
            metadata.revealTime,
            metadata.isRevealed,
            metadata.secretType
        );
    }
} 