import { AgentKit, ViemWalletProvider } from "@coinbase/agentkit";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { createWalletClient, createPublicClient, http, formatEther } from "viem";
import dotenv from 'dotenv';

dotenv.config();

const initializeAgentKit = async () => {
  const account = privateKeyToAccount(process.env.COINBASE_API_SECRET);
  
  const client = createWalletClient({
    account,
    chain: base,
    transport: http('https://mainnet.base.org')
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org')
  });

  const walletProvider = new ViemWalletProvider(client);
  
  return await AgentKit.from({
    walletProvider
  });
};

export const agentKit = await initializeAgentKit();
