# ecretS_gentA

thanks ok now let's get busy. we're making a game called "ecretS gentA // Season 1: Chain of Espionage"

I will explain the game's mechanics. Anything listed in all-caps is a very specific game mechanic type that must stay exactly as written

This game will use Coinbase's Base network to run smart contracts, AgentKit to run semi-autonomous agents with their own wallets, and Nillion to store or reveal secret information. 

User's will be able to add Base Eth to the season's pot in order to choose a TEAM and create SECRET AGENTS with 3 ASSETS per SECRET AGENT. Agents will be used to complete MISSIONS, defend from other SECRET AGENTS from opposing teams, or RELOCATE to another location (MISSIONS are location-based). SECRET AGENTS are created with a name, bio, and random score for the following characteristics: IQ, CHARISMA, TOUGHNESS, LUCK. These chracteristic scores are immutable. SECRET AGENTS also have mutable experience scores: TECH, WEAPONS, PEOPLE, and PLANNING. These mutable skills increase by a point whenever the skills are used in a mission.

Tokens: MISSION TOKENS, INTEL TOKENS, ASSET TOKENS, AGENT TOKENS

Teams: CIA, MI6, NINJA, MSS, MOSSAD, FSB

SECRET AGENT types: OPERATIVE, SURVEILLANCE, HACKER

MISSION types: Break/steal assets, tap comms, set decoys, steal data, hide data. (data is actually access to ASSETS held by Agents)

SEASON - There will be 30, 3-phase cycles. Each phase will last 24 hours. Phase cycles include setup, mission, and outcome.

SETUP PHASE: Players give orders to their agents. Agents may be given specific missions to complete or stay, defence against other players' agents, or RELOCATE. Agents are assigned "ASSETS" which increase the odds of MISSION success. Players may also extend alliance requests to other players in this PHASE.

MISSION PHASE: SECRET AGENTS carry out their MISSIONS where their characteristics, skill-sets, and SITUATIONAL CIRCUMSTANCES help determine the OUTCOMEs of their missions. 

OUTCOME PHASE: We send mission details from the database to the LLM to generate an entertaining story based on SECRET AGENTS and their ASSETS, using their scores as a guide. However, there is an element of randomness that the LLM may generate.. it's possible that scores won't determine the outcome. SITUATIONAL CIRCUMSTANCES includes LUCK, MISINFORMATION, DEFENSIVE READINESS, and SECRET AGENT experience.

MISSIONS are generated based on the location of ASSETS. MISSION requirements include assigning SECRET AGENTS to the MISSION and attaching ASSETS to the SECRET AGENTS to increase their odds of success. MISSIONS may be attempted by solo SECRET AGENTS or groups of SECRET AGENTS.

Win condition: SECRET AGENTS each hold their own INTEL TOKENS received from successful missions. At the end of the season there's a leaderboard for which TEAMS have collected the most INTEL TOKENS. Players in 1st place TEAM get 30% of the pot, 2nd place gets 20%, 3rd place gets 10% of the pot. The remaining 40% of the pot goes to all players based on the number of INTEL TOKENS their SECRET AGENTS have. 

UX/UI

1. Welcome screen allowing for player sign-up, sign-in
2. Dashboard - Season status, Missions, Agents, Payouts
3. Missions - a world map with dots in locations with available missions. when a mission dot is clicked, the player sees a pop-up that let's them assign SECRET AGENTS to attempt the MISSION and give them ASSETS. (note, only agents and assets in the location are available to be asigned. 
4. Outcomes - a blog-like screen that narrates the outcomes from a cycles MISSIONS. (note, the OUTCOMES determine the available missions for the following CYCLE)
5. Agent - create and manage SECRET AGENTS from this view
6. Assets - create and manage ASSETS from this view. ASSETS are able to be bought but are items LLM generates with random attributes for OPERATIVES, SURVEILLORS, or HACKERS to utilize.
7. Player Profile - lists a players agents, outcomes, and allows messaging to make alliances
8. Comms - Private Messaging between players is collected here for each player.

API, STATE, CONTRACTS: the game server, client UX, and contracts should be tightly coupled to make development very simple. Contracts will be used for minting and tracking tokens and users on-chain. I want the following properties to be completely coupled between these facets:

1. missions
2. msgs
3. users
4. tokens - assets, agents, missions, intel
5. outcomes
6. posts/prompts
7. payouts

Prompts: The following prompts will be required to generate the game -

1. Agent backstory and image
2. Mission outcomes
3. Asset creation

Each TEAM has a special ability a player may use to help their MISSIONS:

1. CIA: EAGLE EYE - +25% Intel tokens for successful missions for 3 turns
2. FSB: DOUBLE AGENT - Steals a target agent from another team 
3. MSS: DRAGON EAR - gains access to a player's comms for 1 turn
4. MI6: LICENSE TO SHILL - able to kill a target agent of another team (any assets that dead agent has are burned as well)
5. MOSSAD: MIRAGE - creates fake INTEL TOKENS to ambush SECRET AGENTS from other teams.
6. NINJA: SHADOW - Obscures all comms for entire team for 2 turns. Cannot be targeted while active

___

Finally, semi-autonomous agents are capable of holding real crypto tokens as well as the in-game assets. they may trade these tokens with each other when the narrative permits such a trade. they may also setup their own "funds" from which profits may be realized. However, profits must always go into creating in-game assets. This should be a little bit crazy but the LLM's generative narrative will determine the kinds of trades and economic developments the agents have the ability to create.

Application structure: keep it very, very D.R.Y.(always review folder structures and package managers so you do not repeat code): 

/client - a vue 3 app with pinia for state and actions (see /state, /actions) all components go in /components
/server - bun with elysia server and a folder /contracts to put all contracts. /src/index.js is used for endpoints but all handlers go in thier own files /src/methods (see api.js for example)

You may pause development when you have a question for me or if i need to make a decision. 

PROCEED!