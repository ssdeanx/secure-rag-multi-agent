/**
 * Base processor implementations for Mastra agents and memory systems
 *
 * This file provides foundational processor classes that can be extended
 * for custom processing logic in Mastra applications.
 *
 * @version 1.0.0
 * @author AI Assistant
 * @date 2025-01-19
 */

import { AISpanType } from '@mastra/core/ai-tracing';
import type { TracingContext } from '@mastra/core/ai-tracing';
import type { CoreMessage } from '@mastra/core/llm';
import { MemoryProcessor } from '@mastra/core/memory';
import type { MastraMessageV2 } from '@mastra/core/agent/message-list';
import type { TextStreamPart, ObjectStreamPart, ToolSet } from 'ai-v5';
import { log } from './logger';
/**
 * Type guard that narrows a MastraMessageV2 to a shape that includes metadata.
 * This avoids accessing a property that doesn't exist on the base type.
 */
function hasMetadata(m: MastraMessageV2): m is MastraMessageV2 & { content: { metadata: Record<string, unknown> } } {
  return m.content.metadata !== undefined;
}

/**
 * Helper function to extract text content from MastraMessageV2
 */
function extractTextContent(message: MastraMessageV2): string {
  if (message.content.parts.length > 0) {
    return message.content.parts
      .filter(part => part.type === 'text' && 'text' in part)
      .map(part => (part as { text: string }).text)
      .join(' ');
  }
  return '';
}

/**
 * Base class for custom input processors
 * Provides common functionality and error handling
 */
export abstract class BaseInputProcessor {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Process input messages before they reach the LLM
   * @param args Processing arguments
   * @returns Processed messages
   */
  abstract processInput(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: {
      messages: MastraMessageV2[];
      abort: (_reason?: string) => never;
      tracingContext?: TracingContext;
    }
  ): Promise<MastraMessageV2[]>;

  /**
   * Helper method to create tracing spans
   */
  protected createSpan(
    operation: string,
    tracingContext?: TracingContext,
    metadata?: Record<string, unknown>
  ) {
    return tracingContext?.currentSpan?.createChildSpan({
      type: AISpanType.LLM_GENERATION,
      name: `${this.name}-${operation}`,
      input: { processor: this.name, operation },
      metadata: {
        component: 'processor',
        processorType: 'input',
        ...metadata
      }
    });
  }
}

/**
 * Base class for custom output processors
 * Provides common functionality for streaming and non-streaming output
 */
export abstract class BaseOutputProcessor<TOOLS extends ToolSet = ToolSet> {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Process streaming output parts
   * @param args Streaming processing arguments
   * @returns Processed chunk or null to skip
   */
  processOutputStream?(args: {
    part: TextStreamPart<TOOLS> | ObjectStreamPart<unknown>;
    streamParts: Array<TextStreamPart<TOOLS> | ObjectStreamPart<unknown>>;
    state: Record<string, unknown>;
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<TextStreamPart<TOOLS> | ObjectStreamPart<unknown> | null>;

  /**
   * Process final output results (non-streaming)
   * @param args Result processing arguments
   * @returns Processed messages
   */
  processOutputResult?(args: {
    messages: MastraMessageV2[];
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<MastraMessageV2[]>;

  /**
   * Helper method to create tracing spans
   */
  protected createSpan(
    operation: string,
    tracingContext?: TracingContext,
    metadata?: Record<string, unknown>
  ) {
    return tracingContext?.currentSpan?.createChildSpan({
      type: AISpanType.GENERIC,
      name: `${this.name}-${operation}`,
      input: { processor: this.name, operation },
      metadata: {
        component: 'processor',
        processorType: 'output',
        ...metadata
      }
    });
  }
}

/**
 * Example input processor: Message length validator
 * Blocks messages that are too short or too long
 */
export class MessageLengthValidator extends BaseInputProcessor {
  constructor(
    private options: {
      minLength?: number;
      maxLength?: number;
      strategy?: 'block' | 'warn' | 'truncate';
    } = {}
  ) {
    super('message-length-validator');
    this.options = {
      minLength: 1,
      maxLength: 10000,
      strategy: 'block',
      ...options
    };
  }

  async processInput(args: {
    messages: MastraMessageV2[];
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<MastraMessageV2[]> {
    const span = this.createSpan('validate-length', args.tracingContext, {
      messageCount: args.messages.length,
      minLength: this.options.minLength,
      maxLength: this.options.maxLength
    });

    try {
      const processedMessages = args.messages.map(message => {
        const textContent = extractTextContent(message);
        const length = textContent.length;

        if (this.options.minLength !== undefined && length < this.options.minLength) {
          const reason = `Message too short: ${length} < ${this.options.minLength}`;
          log.warn(reason, { messageId: message.id, length });

          if (this.options.strategy === 'block') {
            span?.error({ error: new Error(reason) });
            args.abort(reason);
          }
        }

        if (this.options.maxLength !== undefined && length > this.options.maxLength) {
          const reason = `Message too long: ${length} > ${this.options.maxLength}`;
          log.warn(reason, { messageId: message.id, length });

          if (this.options.strategy === 'block') {
            span?.error({ error: new Error(reason) });
            args.abort(reason);
          }
          // Note: 'truncate' strategy not supported with structured content
        }

        return message;
      });

      span?.end({
        output: {
          processedCount: processedMessages.length,
          success: true
        },
        metadata: {
          component: 'processor',
          operation: 'length-validation'
        }
      });

      return processedMessages;
    } catch (error) {
      span?.error({
        error: error instanceof Error ? error : new Error('Length validation failed')
      });
      throw error;
    }
  }
}

/**
 * Example output processor: Response time tracker
 * Adds metadata about processing time to responses
 */
export class ResponseTimeTracker extends BaseOutputProcessor {
  private startTime?: number;

  constructor() {
    super('response-time-tracker');
  }

  async processOutputStream(args: {
    part: TextStreamPart<ToolSet> | ObjectStreamPart<unknown>;
    streamParts: Array<TextStreamPart<ToolSet> | ObjectStreamPart<unknown>>;
    state: Record<string, unknown>;
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<TextStreamPart<ToolSet> | ObjectStreamPart<unknown> | null> {
    // Track start time on first chunk
    if (this.startTime === undefined) {
      this.startTime = Date.now();
      args.state.startTime = this.startTime;
    }

    // Pass through the chunk unchanged
    return args.part;
  }

  async processOutputResult({ messages, tracingContext }: {
    messages: MastraMessageV2[];
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<MastraMessageV2[]> {
    const span = this.createSpan('track-response-time', tracingContext);

    try {
      const endTime = Date.now();
      const totalTime = this.startTime !== undefined ? endTime - this.startTime : 0;

      log.info(
        'Response time tracked',
        { messageCount: messages.length, totalTimeMs: totalTime }
      );

      // Add timing metadata to the last message
      const processedMessages = [...messages];
      if (processedMessages.length > 0) {
        const lastMessage = processedMessages[processedMessages.length - 1];
        if (hasMetadata(lastMessage)) {
          // Add timing metadata to existing metadata
          lastMessage.content.metadata = {
            ...lastMessage.content.metadata,
            responseTimeMs: totalTime,
            processedAt: new Date().toISOString()
          };
        } else {
          // Create new metadata
          (lastMessage.content as MastraMessageV2['content'] & { metadata: Record<string, unknown> }).metadata = {
            responseTimeMs: totalTime,
            processedAt: new Date().toISOString()
          };
        }
      }

      span?.end({
        output: {
          messageCount: processedMessages.length,
          totalTimeMs: totalTime,
          success: true
        },
        metadata: {
          component: 'processor',
          operation: 'time-tracking'
        }
      });

      // Reset for next request
      this.startTime = undefined;

      return processedMessages;
    } catch (error) {
      span?.error({
        error: error instanceof Error ? error : new Error('Time tracking failed')
      });
      throw error;
    }
  }
}

/**
 * Example memory processor: Conversation summarizer
 * Summarizes old conversation messages to save tokens
 */
export class ConversationSummarizer extends MemoryProcessor {
  constructor(
    private options: {
      maxMessages?: number;
      summarizeAfter?: number;
      summaryPrefix?: string;
    } = {}
  ) {
    super({ name: 'conversation-summarizer' });
    this.options = {
      maxMessages: 50,
      summarizeAfter: 20,
      summaryPrefix: 'Previous conversation summary: ',
      ...options
    };
  }

  process(
    messages: CoreMessage[]
  ): CoreMessage[] {
    const { maxMessages, summarizeAfter, summaryPrefix } = this.options;

    if (messages.length <= maxMessages!) {
      return messages;
    }

    // Keep the most recent messages
    const recentMessages = messages.slice(-summarizeAfter!);

    // Create a summary of older messages
    const olderMessages = messages.slice(0, -summarizeAfter!);
    const summaryContent = this.createSummary(olderMessages);

    // Create a summary message
    const summaryMessage: CoreMessage = {
      role: 'system',
      content: `${summaryPrefix}${summaryContent}`
    };

    log.info('Conversation summarized', {
      originalCount: messages.length,
      summarizedCount: olderMessages.length,
      keptCount: recentMessages.length
    });

    return [summaryMessage, ...recentMessages];
  }

  private createSummary(messages: CoreMessage[]): string {
    // Simple summarization - in practice, you'd use an LLM for better summaries
    const conversationTopics = new Set<string>();
    let totalLength = 0;

    messages.forEach(message => {
      if (typeof message.content === 'string') {
        totalLength += message.content.length;

        // Extract simple keywords (basic implementation)
        const words = message.content.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4) { // Simple heuristic for meaningful words
            conversationTopics.add(word);
          }
        });
      }
    });

    const topics = Array.from(conversationTopics).slice(0, 10); // Limit topics

    return `Conversation with ${messages.length} messages (${totalLength} chars) covering topics: ${topics.join(', ')}`;
  }
}

/**
 * Example memory processor: Sensitive content filter
 * Removes or redacts sensitive information from memory messages
 */
export class SensitiveContentFilter extends MemoryProcessor {
  constructor(
    private options: {
      sensitivePatterns?: RegExp[];
      replacementText?: string;
      removeEntireMessage?: boolean;
    } = {}
  ) {
    super({ name: 'sensitive-content-filter' });
    this.options = {
      sensitivePatterns: [
        /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit cards
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // SSN
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      ],
      replacementText: '[REDACTED]',
      removeEntireMessage: false,
      ...options
    };
  }

  process(
    messages: CoreMessage[]
  ): CoreMessage[] {
    const { sensitivePatterns, replacementText } = this.options;

    return messages
      .map(message => {
        if (typeof message.content === 'string') {
          let content = message.content;
          let hasSensitiveContent = false;

          // Check for sensitive patterns
          sensitivePatterns!.forEach(pattern => {
            if (pattern.test(content)) {
              hasSensitiveContent = true;
            if (this.options.removeEntireMessage === true) {
                return null; // Will be filtered out
              } else {
                content = content.replace(pattern, replacementText!);
              }
            }
          });

          if (hasSensitiveContent && this.options.removeEntireMessage !== true) {
            log.info('Sensitive content filtered', {
              messageRole: message.role,
              hasRedaction: true
            });
            return { ...message, content };
          } else if (!hasSensitiveContent) {
            return message;
          }
        }

        return message;
      })
      .filter((message): message is CoreMessage => message !== null);
  }
}

/**
 * Example hybrid processor: Content logger
 * Logs content for debugging and monitoring (can be used as input or output processor)
 */
export class ContentLogger extends BaseInputProcessor {
  constructor(
    private options: {
      logLevel?: 'info' | 'debug' | 'warn';
      includeMetadata?: boolean;
      maxContentLength?: number;
      logInputs?: boolean;
      logOutputs?: boolean;
    } = {}
  ) {
    super('content-logger');
    this.options = {
      logLevel: 'info',
      includeMetadata: true,
      maxContentLength: 500,
      logInputs: true,
      logOutputs: true,
      ...options
    };
  }

  async processInput(args: {
    messages: MastraMessageV2[];
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<MastraMessageV2[]> {
    if (this.options.logInputs === false) {
      return args.messages;
    }

    const span = this.createSpan('log-input', args.tracingContext, {
      messageCount: args.messages.length
    });

    try {
      args.messages.forEach((message, index) => {
        const content = extractTextContent(message).substring(0, this.options.maxContentLength);

        const logData: {
          messageId: string;
          role: string;
          contentLength: number;
          content: string;
          type: string;
          metadata?: Record<string, unknown>;
        } = {
          messageId: message.id,
          role: message.role,
          contentLength: extractTextContent(message).length,
          content: this.options.logLevel === 'debug' ? content : '[content logged]',
          type: 'input'
        };

        if (this.options.includeMetadata === true && hasMetadata(message)) {
          logData.metadata = message.content.metadata;
        }

        log.info(`Processing input message ${index}`, logData);
      });

      span?.end({
        output: {
          messageCount: args.messages.length,
          logged: true,
          success: true
        },
        metadata: {
          component: 'processor',
          operation: 'input-logging'
        }
      });

      return args.messages;
    } catch (error) {
      span?.error({
        error: error instanceof Error ? error : new Error('Input logging failed')
      });
      throw error;
    }
  }

  // Can also be used as an output processor
  async processOutputStream(args: {
    part: TextStreamPart<ToolSet> | ObjectStreamPart<unknown>;
    streamParts: Array<TextStreamPart<ToolSet> | ObjectStreamPart<unknown>>;
    state: Record<string, unknown>;
    abort: (reason?: string) => never;
    tracingContext?: TracingContext;
  }): Promise<TextStreamPart<ToolSet> | ObjectStreamPart<unknown> | null> {
    if (this.options.logOutputs === false) {
      return args.part;
    }

    // Log streaming output parts
    const content = typeof args.part === 'object' && args.part !== null && 'text' in args.part
      ? (args.part as { text?: string }).text?.substring(0, this.options.maxContentLength)
      : '[non-text content]';

    log[this.options.logLevel!](`Streaming output part`, {
      partType: 'type' in args.part ? args.part.type : 'unknown',
      contentLength: typeof args.part === 'object' && args.part !== null && 'text' in args.part
        ? (args.part as { text?: string }).text?.length ?? 0
        : 0,
      content: this.options.logLevel === 'debug' ? content : '[content logged]',
      type: 'output-stream'
    });

    return args.part;
  }
}

// Export convenience functions for creating processor instances
export const createMessageLengthValidator = (options?: ConstructorParameters<typeof MessageLengthValidator>[0]) =>
  new MessageLengthValidator(options);

export const createResponseTimeTracker = () =>
  new ResponseTimeTracker();

export const createConversationSummarizer = (options?: ConstructorParameters<typeof ConversationSummarizer>[0]) =>
  new ConversationSummarizer(options);

export const createSensitiveContentFilter = (options?: ConstructorParameters<typeof SensitiveContentFilter>[0]) =>
  new SensitiveContentFilter(options);

export const createContentLogger = (options?: ConstructorParameters<typeof ContentLogger>[0]) =>
  new ContentLogger(options);
