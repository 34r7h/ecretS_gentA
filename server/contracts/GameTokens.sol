// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// MISSION Token
contract MissionToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Mission Token", "MISSION") Ownable(msg.sender) {}

    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// INTEL Token
contract IntelToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Intel Token", "INTEL") Ownable(msg.sender) {}

    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// ASSET Token
contract AssetToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Asset Token", "ASSET") Ownable(msg.sender) {}

    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// AGENT Token
contract AgentToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct AgentStats {
        uint8 iq;
        uint8 charisma;
        uint8 toughness;
        uint8 luck;
        uint8 tech;
        uint8 weapons;
        uint8 people;
        uint8 planning;
        string agentType; // OPERATIVE, SURVEILLANCE, or HACKER
        string team; // CIA, MI6, NINJA, MSS, MOSSAD, FSB
    }

    mapping(uint256 => AgentStats) public agentStats;

    constructor() ERC721("Agent Token", "AGENT") Ownable(msg.sender) {}

    function safeMint(
        address to, 
        string memory uri,
        uint8 _iq,
        uint8 _charisma,
        uint8 _toughness,
        uint8 _luck,
        string memory _agentType,
        string memory _team
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        agentStats[tokenId] = AgentStats({
            iq: _iq,
            charisma: _charisma,
            toughness: _toughness,
            luck: _luck,
            tech: 0,
            weapons: 0,
            people: 0,
            planning: 0,
            agentType: _agentType,
            team: _team
        });

        return tokenId;
    }

    function updateExperience(
        uint256 tokenId,
        uint8 tech,
        uint8 weapons,
        uint8 people,
        uint8 planning
    ) public onlyOwner {
        AgentStats storage stats = agentStats[tokenId];
        stats.tech = tech;
        stats.weapons = weapons;
        stats.people = people;
        stats.planning = planning;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 