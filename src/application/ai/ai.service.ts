import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { AiConfig } from './ai.schemas';
import { TripAdvisorService } from 'src/infrastructure/clients/trip_advisor';
import { initTripAdvisorTools } from './tools/trip_advisor.tools';

@Injectable()
export class AiService {
  private agent: ReturnType<typeof createReactAgent>;

  constructor(
    private readonly config: AiConfig,
    private readonly tripAdvisorService: TripAdvisorService,
  ) {
    const llm = new ChatOpenAI({
      openAIApiKey: config.openAiApiKey,
      modelName: config.modelName,
    });
    const promptString = readFileSync(path.join(__dirname, 'prompt.txt'), 'utf-8');

    const checkpointSaver = new MemorySaver();
    const tripAdvisorTools = initTripAdvisorTools(this.tripAdvisorService);
    this.agent = createReactAgent({
      llm,
      checkpointSaver,
      tools: [...tripAdvisorTools],
      messageModifier: promptString,
    });
  }

  public async chat(input: string, config: { threadId: string }): Promise<string> {
    const request = {
      messages: [{ role: 'user', content: input }],
    };

    return this.agent.invoke(request, { configurable: { thread_id: config.threadId } });
  }

  public async stream(input: string, config: { threadId: string }) {
    const request = {
      messages: [{ role: 'user', content: input }],
    };

    return this.agent.stream(request, { configurable: { thread_id: config.threadId }, streamMode: 'values' });
  }
}
