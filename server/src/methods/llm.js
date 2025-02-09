import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

/**
 * @param {Object} mission
 * @param {Object} agents
 * @returns {Promise<Object>}
 */
export const generateMissionOutcome = async (mission, agents) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const missionAgents = mission.assignedAgents.map(id => agents[id]);
  
  const prompt = `Generate a spy mission outcome story and skill improvements. Here's the context:

Mission Type: ${mission.type}
Location: ${mission.location}
Required Skills: ${mission.requiredSkills.join(', ')}

Agents:
${missionAgents.map(agent => `
- ${agent.name} (${agent.type})
  IQ: ${agent.iq}
  Charisma: ${agent.charisma}
  Toughness: ${agent.toughness}
  Luck: ${agent.luck}
  Current Skills:
    Tech: ${agent.tech}
    Weapons: ${agent.weapons}
    People: ${agent.people}
    Planning: ${agent.planning}
`).join('\n')}

Generate a story about how the mission played out and determine:
1. Whether the mission was successful
2. How much each agent's skills improved (0-2 points per relevant skill)
3. Any interesting developments or consequences

Format the response as JSON with the following structure:
{
  "story": "the mission narrative",
  "success": true/false,
  "techGain": number,
  "weaponsGain": number,
  "peopleGain": number,
  "planningGain": number
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM response:', e);
    return {
      story: text,
      success: false,
      techGain: 0,
      weaponsGain: 0,
      peopleGain: 0,
      planningGain: 0
    };
  }
};

export const generateAgentBackstory = async (name, type, team) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate a spy agent backstory and personality. Here's the context:

Name: ${name}
Type: ${type}
Team: ${team}

Generate:
1. A compelling backstory that explains how they joined their agency
2. Key personality traits and quirks
3. Notable achievements or failures that shaped them
4. Their primary motivation

Format the response as JSON with the following structure:
{
  "backstory": "the character's history",
  "personality": "key traits and quirks",
  "achievements": ["list", "of", "achievements"],
  "motivation": "primary driving force"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM response:', e);
    return {
      backstory: text,
      personality: "Mysterious",
      achievements: [],
      motivation: "Unknown"
    };
  }
};

export const generateAsset = async (type) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate a spy asset/gadget suitable for a ${type} agent. The asset should:
1. Have a creative name
2. Have a detailed description
3. Provide specific bonuses to agent skills
4. Have interesting limitations or drawbacks

Format the response as JSON with the following structure:
{
  "name": "asset name",
  "description": "detailed description",
  "bonuses": {
    "tech": number (0-5),
    "weapons": number (0-5),
    "people": number (0-5),
    "planning": number (0-5)
  },
  "limitations": "description of drawbacks"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM response:', e);
    return {
      name: "Generic Asset",
      description: text,
      bonuses: {
        tech: 1,
        weapons: 1,
        people: 1,
        planning: 1
      },
      limitations: "Standard issue equipment"
    };
  }
}; 