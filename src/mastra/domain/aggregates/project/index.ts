import { promises } from "fs";
import { Id } from "../../../shared/value-objects/index.js";
import { randomUUID } from "crypto";
import path from "path";
import { tmpdir } from "os";
import degit from "degit";
import { injectable } from "inversify";
import type { Config } from "../config.js";
import { spawn, spawnSync, type ChildProcess } from "child_process";
import { readFileSync } from "fs";
import { globby } from "globby";
import http from "http";
import https from "https";
import { log } from '../../../config/logger.js';
/**
 * Represents a port in the system.
 * Constructor should pick a random port between 3000 and 9000 if not provided.
 */
class Port {
  number: string;

  constructor(port?: string) {
    this.number =
      port ?? String(Math.floor(Math.random() * (9000 - 3000 + 1)) + 3000);
  }
}

const AllowedProjectStatuses = [
  "initialized",
  "setting-up",
  "ready",
  "evaluating",
  "evaluated",
  "archived",
] as const;
type ProjectStatus = (typeof AllowedProjectStatuses)[number];

// Strongly-typed shape for persisted scores (matches scorerOutputSchema)
type TestResult = Array<{
  id: string;
  passed: boolean;
  explanation: string;
}>;

export interface ProjectScores {
  descriptionQuality: { score: number; explanation: string };
  tests: TestResult;
  appeal: { score: number; explanation: string };
  creativity: { score: number; explanation: string };
  architecture: {
    agents: { count: number };
    tools: { count: number };
    workflows: { count: number };
  };
  tags: string[];
}

export class Project {
  name: string;
  id: Id;
  port: Port;
  repoURL: string;
  videoURL: string;
  description: string;
  status: ProjectStatus;
  directory: string;
  envConfig: Record<string, string>;
  readonly config: Config;
  stats:
    | {
        architecture: {
          agents: { count: number };
          tools: { count: number };
          workflows: { count: number };
        };
        detectedTechnologies: Record<string, boolean>;
      }
    | undefined;
  scores: ProjectScores | undefined;
  createdAt: Date;
  private _serverProc?: ChildProcess;
  private _cleanupRegistered = false;
  constructor(
    props: {
      name: string;
      videoURL: string;
      description: string;
      status?: string;
      id?: ConstructorParameters<typeof Id>[0] | undefined;
      port?: string;
      directory?: string;
      envConfig: Record<string, string>;
      stats?: Project["stats"]; // optional persisted stats
      scores?: ProjectScores; // optional persisted scores
      createdAt?: Date | string; // optional timestamp for when project was created
    } & (
      | {
          repoURLOrShorthand: string;
        }
      | {
          repoURL: string;
        }
    ),
    config: Config
  ) {
    log.info(`[Project] Creating new Project instance`);
    log.info(`[Project] Name: ${props.name}`);
    log.info(`[Project] VideoURL: ${props.videoURL}`);

    this.name = props.name;
    this.id = new Id(props.id ?? randomUUID());
    log.info(`[Project] Assigned ID: ${this.id.value}`);

    this.port = new Port(props.port);
    log.info(`[Project] Assigned port: ${this.port.number}`);

    this.directory = props.directory ?? path.join(tmpdir(), this.id.value);
    log.info(`[Project] Directory: ${this.directory}`);

    const status = props.status ?? "initialized";
    const castedStatus = status as ProjectStatus;
    this.repoURL =
      "repoURL" in props
        ? props.repoURL
        : props.repoURLOrShorthand.startsWith("http")
          ? props.repoURLOrShorthand
          : `https://github.com/${props.repoURLOrShorthand}`;
    log.info(`[Project] Repository URL: ${this.repoURL}`);

    if (!AllowedProjectStatuses.includes(castedStatus)) {
      log.error(`[Project] Invalid project status: ${castedStatus}`);
      throw new Error(`Invalid project status: ${castedStatus}`);
    }
    this.status = castedStatus;
    log.info(`[Project] Status: ${this.status}`);

    this.videoURL = props.videoURL;
    this.description = props.description || "No description provided";
    this.envConfig = props.envConfig;
    this.config = config;
    this.stats = props.stats;
    this.scores = props.scores;
    this.createdAt = props.createdAt
      ? typeof props.createdAt === "string"
        ? new Date(props.createdAt)
        : props.createdAt
      : new Date();

    log.info(
      `[Project] Project instance created successfully - ID: ${this.id.value}, CreatedAt: ${this.createdAt.toISOString()}`
    );
  }

  /**
   * Extracts YouTube video ID from various YouTube URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://youtube.com/watch?v=VIDEO_ID
   * - https://m.youtube.com/watch?v=VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   * - https://www.youtube.com/v/VIDEO_ID
   */
  get videoId() {
    log.info(`[Project] Getting videoId for project ${this.id.value}`);
    const url = this.videoURL;

    // Match various YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        log.info(`[Project] Successfully extracted videoId: ${match[1]}`);
        return match[1];
      }
    }

    log.error(`[Project] Unable to extract video ID from URL: ${url}`);
    throw new Error("Unable to extract video ID");
  }

  toDTO() {
    log.info(`[Project] Converting project ${this.id.value} to DTO`);
    const dto = {
      name: this.name,
      id: this.id.value,
      videoURL: this.videoURL,
      envConfig: this.envConfig,
      videoId: this.videoId,
      description: this.description,
      port: this.port.number,
      repoURL: this.repoURL,
      status: this.status,
      directory: this.directory,
      stats: this.stats,
      scores: this.scores,
      createdAt: this.createdAt.toISOString(),
    };
    log.info(`[Project] DTO created with ${Object.keys(dto).length} fields`);
    return dto;
  }

  async setup() {
    log.info(
      `[Project] Starting setup for project ${this.id.value} from ${this.repoURL}`
    );
    log.info(`[Project] Target directory: ${this.directory}`);

    const emitter = degit(this.repoURL, {
      cache: true,
      force: true,
      verbose: true,
    });

    log.info(`[Project] Cloning repository...`);
    await emitter.clone(this.directory);
    log.info(`[Project] Repository cloned successfully`);

    log.info(`[Project] Running parallel setup tasks (env + npm install)`);
    await Promise.all([
      this.emitEnvInFolder(this.directory),
      this.conductNpmInstall(this.directory),
    ]);
    log.info(`[Project] Setup completed successfully`);
  }

  /**
   * Scans the cloned repository to infer architecture counts and sponsor-related technologies.
   * Heuristics:
   * - Architecture counts via directory names and common code patterns
   * - Technologies via package.json dependencies and simple code string matches
   */
  async getStats(): Promise<{
    architecture: {
      agents: { count: number };
      tools: { count: number };
      workflows: { count: number };
    };
    detectedTechnologies: Record<string, boolean>;
  }> {
    log.info(`[Project] Getting stats for project ${this.id.value}`);
    const root = this.directory;
    log.info(`[Project] Analyzing directory: ${root}`);

    const pkg = this.safeReadJSON(path.join(root, "package.json"));
    const allDeps = {
      ...(pkg?.dependencies ?? {}),
      ...(pkg?.devDependencies ?? {}),
    } as Record<string, string>;

    log.info(`[Project] Found ${Object.keys(allDeps).length} dependencies`);

    // Basic tech detection from deps and code
    const hasDep = (name: string) => Boolean(allDeps[name]);

    // File discovery via globby (fallback to manual walk)
    let files: string[] = [];
    const rel = await globby(["src/**/*.{ts,tsx,js,jsx}"], {
      cwd: root,
      gitignore: true,
      ignore: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/build/**",
        "**/.mastra/**",
      ],
      absolute: false,
      onlyFiles: true,
      followSymbolicLinks: false,
    });
    files = rel.map((p: string) => path.join(root, p));
    log.info(`[Project] Found ${files.length} source files to analyze`);

    const readText = (fp: string) => {
      try {
        return readFileSync(fp, "utf-8");
      } catch {
        return "";
      }
    };

    const agentsCount = files.filter(
      (f) => /[/\\]agents[/\\]/.test(f) || /new\s+Agent\s*\(/.test(readText(f))
    ).length;
    const toolsCount = files.filter(
      (f) => /[/\\]tools[/\\]/.test(f) || /createTool\s*\(/.test(readText(f))
    ).length;
    const workflowsCount = files.filter(
      (f) =>
        /[/\\]workflows[/\\]/.test(f) || /createWorkflow\s*\(/.test(readText(f))
    ).length;

    log.info(
      `[Project] Architecture counts - Agents: ${agentsCount}, Tools: ${toolsCount}, Workflows: ${workflowsCount}`
    );

    const anyFileIncludes = (substr: string | RegExp) =>
      files.some((f) => {
        const txt = readText(f);
        return typeof substr === "string"
          ? txt.includes(substr)
          : substr.test(txt);
      });

    const detectedTechnologies: Record<string, boolean> = {
      smithery: hasDep("@smithery/sdk"),
      workos: hasDep("@workos/node"),
      browserbase: hasDep("browserbase"),
      arcade: hasDep("@arcadeai/arcadejs") || anyFileIncludes(/arcade-ai/),
      chroma: hasDep("chromadb"),
      recall:
        hasDep("viem") ||
        hasDep("ethers") ||
        anyFileIncludes(/web3|wallet|ethers|viem/),
      confidentAi:
        hasDep("@mastra/evals") || anyFileIncludes(/\bevals?\b|Metric\s*\{/),
      rag: hasDep("chromadb") || anyFileIncludes(/retrieval|vector|embedding/i),
      auth: hasDep("@workos/node") || anyFileIncludes(/auth|oauth|login/i),
      webBrowsing:
        hasDep("browserbase") ||
        anyFileIncludes(/puppeteer|playwright|browserbase/i),
    };

    const enabledTechs = Object.entries(detectedTechnologies)
      .filter(([_, enabled]) => enabled)
      .map(([tech]) => tech);
    log.info(
      `[Project] Detected technologies: ${enabledTechs.join(", ") || "none"}`
    );

    const result = {
      architecture: {
        agents: { count: agentsCount },
        tools: { count: toolsCount },
        workflows: { count: workflowsCount },
      },
      detectedTechnologies,
    };

    log.info(`[Project] Stats analysis completed`);
    return result;
  }

  /** Absolute path to the cloned repo */
  private get repoPath() {
    log.info(
      `[Project] Getting repoPath for project ${this.id.value}: ${this.directory}`
    );
    return this.directory;
  }

  /**
   * Start the target project's Mastra playground/server.
   * Heuristic: prefer `npm run dev`, then `npm start`. PORT is forced to this.port.number.
   */
  async startTargetServer(): Promise<void> {
    log.info(
      `[Project] Starting target server for project ${this.id.value}`
    );
    if (this._serverProc && !this._serverProc.killed) {
      log.info(`[Project] Server already running, skipping start`);
      return; // already running
    }

    log.info(`[Project] Reading package.json from ${this.repoPath}`);
    const pkg =
      this.safeReadJSON(path.join(this.repoPath, "package.json")) ?? {};
    const scripts = (pkg.scripts ?? {}) as Record<string, string>;
    const hasDev = typeof scripts.dev === "string";
    const hasStart = typeof scripts.start === "string";

    const cmd = this.config.NPM_PATH;
    const args = hasDev
      ? ["run", "dev"]
      : hasStart
        ? ["start"]
        : ["run", "dev"]; // default to dev

    log.info(
      `[Project] Executing command: ${cmd} ${args.join(" ")} (port: ${this.port.number})`
    );
    this._serverProc = spawn(cmd, args, {
      cwd: this.repoPath,
      env: {
        ...process.env,
        PORT: this.port.number,
      },
      stdio: "inherit",
      shell: true,
    });

    this.registerExitCleanup();
    log.info(
      `[Project] Server process started, waiting for ready signal...`
    );
    await this.waitForServerReady(60_000);
    log.info(`[Project] Target server is ready and responding`);
  }

  /** Poll the server until it responds or timeout */
  private async waitForServerReady(timeoutMs = 30000): Promise<void> {
    log.info(
      `[Project] Waiting for server to be ready (timeout: ${timeoutMs}ms)`
    );
    const baseUrl = `http://localhost:${this.port.number}/`;
    const start = Date.now();
    let attempts = 0;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const tryPing = () =>
      new Promise<void>((resolve, reject) => {
        const lib = baseUrl.startsWith("https") ? https : http;
        const req = lib.request(baseUrl, { method: "GET" }, (res) => {
          res.resume();
          resolve();
        });
        req.on("error", reject);
        req.end();
      });
    while (Date.now() - start < timeoutMs) {
      attempts++;
      try {
        log.info(`[Project] Server ready check attempt ${attempts}`);
        await tryPing();
        log.info(
          `[Project] Server is ready after ${attempts} attempts (${Date.now() - start}ms)`
        );
        return;
      } catch { /* empty */ }
      await sleep(500);
    }
    log.error(
      `[Project] Server failed to become ready after ${attempts} attempts`
    );
    throw new Error(
      `Target server did not become ready on ${baseUrl} within ${timeoutMs}ms`
    );
  }

  /** Stop the target server if running */
  async stopTargetServer(): Promise<void> {
    log.info(
      `[Project] Stopping target server for project ${this.id.value}`
    );
    if (this._serverProc && !this._serverProc.killed) {
      log.info(`[Project] Sending SIGTERM to server process`);
      try {
        this._serverProc.kill("SIGTERM");
        log.info(`[Project] Server process terminated successfully`);
      } catch (error) {
        log.error(`[Project] Error stopping server process:`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      log.info(`[Project] No running server process to stop`);
    }
  }

  private registerExitCleanup() {
    if (this._cleanupRegistered) {
      log.info(
        `[Project] Exit cleanup already registered for project ${this.id.value}`
      );
      return;
    }
    log.info(
      `[Project] Registering exit cleanup handlers for project ${this.id.value}`
    );
    this._cleanupRegistered = true;
    const cleanup = () => {
      if (this._serverProc && !this._serverProc.killed) {
        log.info(`[Project] Cleanup: terminating server process`);
        try {
          this._serverProc.kill("SIGTERM");
        } catch { /* empty */ }
      }
    };
    process.on("exit", cleanup);
    process.on("SIGINT", () => {
      log.info(`[Project] Received SIGINT, cleaning up...`);
      cleanup();
      process.exit(1);
    });
    process.on("SIGTERM", () => {
      log.info(`[Project] Received SIGTERM, cleaning up...`);
      cleanup();
      process.exit(1);
    });
  }


  private safeReadJSON(file: string): any | undefined {
    log.info(`[Project] Reading JSON file: ${file}`);
    try {
      const txt = readFileSync(file, "utf-8");
      const parsed = JSON.parse(txt);
      log.info(
        `[Project] Successfully parsed JSON file (${Object.keys(parsed).length} keys)`
      );
      return parsed;
    } catch (error) {
      log.warn(
        `[Project] Failed to read/parse JSON file ${file}:`,
        {
          error: error instanceof Error ? error.message : "Unknown error",
        }
      );
      return undefined;
    }
  }

  private async conductNpmInstall(folder: string): Promise<void> {
    log.info(`[Project] Starting npm install in folder: ${folder}`);
    log.info(`[Project] Using npm path: ${this.config.NPM_PATH}`);

    return new Promise((resolve, reject) => {
      const childProcess = spawn(this.config.NPM_PATH, ["install"], {
        cwd: folder,
        stdio: "inherit",
        shell: true,
      });

      childProcess.on("close", (code) => {
        log.info(`[Project] npm install completed with exit code: ${code}`);

        if (code === 0) {
          resolve();
        } else {
          log.error(`[Project] npm install failed with exit code: ${code}`);
          reject(new Error(`npm install failed with exit code: ${code}`));
        }
      });

      childProcess.on("error", (error) => {
        log.error(`[Project] npm install process error:`, error);
        reject(new Error(`npm install process error: ${error.message}`));
      });
    });
  }
  private async emitEnvInFolder(folder: string) {
    log.info(`[Project] Creating .env file in folder: ${folder}`);
    const envPath = path.join(folder, ".env");
    const envContent = Object.entries(this.envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    log.info(
      `[Project] Writing ${Object.keys(this.envConfig).length} environment variables to .env`
    );
    await promises.writeFile(envPath, envContent, {
      encoding: "utf-8",
    });
    log.info(`[Project] .env file created successfully at: ${envPath}`);
  }
  get canonicalVideoURL() {
    log.info(
      `[Project] Getting canonical video URL for project ${this.id.value}`
    );
    const canonicalUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
    log.info(`[Project] Canonical URL: ${canonicalUrl}`);
    return canonicalUrl;
  }
}

@injectable()
export class ProjectFactory {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
    log.info(`[ProjectFactory] Config received via constructor`);
  }

  create(props: ConstructorParameters<typeof Project>[0]) {
    log.info(`[ProjectFactory] Creating new Project with factory`);
    log.info(
      `[ProjectFactory] Props keys: ${Object.keys(props).join(", ")}`
    );
    const project = new Project(props, this.config);
    log.info(
      `[ProjectFactory] Project created with ID: ${project.id.value}`
    );
    return project;
  }
}
