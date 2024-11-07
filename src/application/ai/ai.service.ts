import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

import { TripAdvisorClient } from 'src/infrastructure/clients/trip_advisor';

import { AiConfig } from './ai.schemas';
import { initTripAdvisorTools } from './tools/trip_advisor.tools';
import { GooglePlacesClient } from 'src/infrastructure/clients/google_places/google_places.client';

@Injectable()
export class AiService {
  constructor(private readonly agent: ReturnType<typeof createReactAgent>) {}

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

  static async init({
    config,
    tripAdvisorClient,
  }: {
    config: AiConfig;
    tripAdvisorClient: TripAdvisorClient;
    googlePlacesClient: GooglePlacesClient;
  }) {
    const pgSaver = PostgresSaver.fromConnString(config.postgresUrl);
    await pgSaver.setup();

    const promptString = await readFile(path.join(__dirname, 'prompt.txt'), 'utf-8');
    const tripAdvisorTools = initTripAdvisorTools(tripAdvisorClient);
    const llm = new ChatOpenAI({
      openAIApiKey: config.openAiApiKey,
      modelName: config.modelName,
    });

    const agent = createReactAgent({
      llm,
      checkpointSaver: pgSaver,
      tools: [...tripAdvisorTools],
      messageModifier: promptString,
    });

    return new this(agent);
  }
}
