import { injectable } from "inversify";

@injectable()
export class Config {
  DB_NAME: string;
  MONGODB_URI: string;
  OPENROUTER_API_KEY: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  ARCADE_API_KEY: string | undefined;
  ARCADE_USER_ID: string | undefined;
  GOOGLE_SHEETS_SPREADSHEET_ID: string | undefined;
  constructor(props?: {
    DB_NAME?: string;
    MONGODB_URI?: string;
    OPENROUTER_API_KEY?: string;
    OPENAI_API_KEY?: string;
    ARCADE_API_KEY?: string;
    ARCADE_USER_ID?: string;
    GOOGLE_SHEETS_SPREADSHEET_ID?: string;
  }) {
    this.DB_NAME =
      (props?.DB_NAME ??
      process.env.DB_NAME) ??
      (() => {
        throw new Error("DB_NAME is not set");
      })();
    this.MONGODB_URI =
      (props?.MONGODB_URI ??
      process.env.MONGODB_URI) ??
      (() => {
        throw new Error("MONGODB_URI is not set");
      })();
    this.OPENROUTER_API_KEY =
      props?.OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      (() => {
        throw new Error("OPENROUTER_API_KEY is not set");
      })();
    this.OPENAI_API_KEY =
      props?.OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
    this.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
    this.GOOGLE_GENERATIVE_AI_API_KEY =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    this.ARCADE_API_KEY =
      props?.ARCADE_API_KEY || process.env.ARCADE_API_KEY || undefined;
    this.ARCADE_USER_ID =
      props?.ARCADE_USER_ID ||
      process.env.ARCADE_USER_ID ||
      (() => {
        throw new Error("ARCADE_USER_ID is not set");
      })();
    this.GOOGLE_SHEETS_SPREADSHEET_ID =
      props?.GOOGLE_SHEETS_SPREADSHEET_ID ||
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
      (() => {
        throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set");
      })();
  }

  public get aiAPIKeys() {
    console.log("returning ai api keys");
    return {
      OPENROUTER_API_KEY: this.OPENROUTER_API_KEY,
      OPENAI_API_KEY: this.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: this.ANTHROPIC_API_KEY,
      GOOGLE_GENERATIVE_AI_API_KEY: this.GOOGLE_GENERATIVE_AI_API_KEY,
    };
  }

  public get NPM_PATH() {
    return "npm";
  }
}