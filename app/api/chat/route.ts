import { createAgentUIStreamResponse, type UIMessage } from "ai";

import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response("Invalid JSON in request body", { status: 400 });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response("messages parameter must be provided as an array", {
      status: 400,
    });
  }

  // No auth system — agent runs without user context (orders tool disabled)
  const agent = createShoppingAgent({ userId: null });

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages as UIMessage[],
  });
}
