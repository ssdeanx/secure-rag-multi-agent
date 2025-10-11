import { promises } from "fs";
import { Id } from "../../../shared/value-objects/index.js";
import { randomUUID } from "crypto";
import path from "path";
import { tmpdir } from "os";
import degit from "degit";
import { inject, injectable } from "inversify";
import { Config } from "../config.js";
import { spawn, spawnSync, type ChildProcess } from "child_process";
import { readFileSync } from "fs";
import { globby } from "globby";
import http from "http";
import https from "https";
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
    console.log(`[Project] Creating new Project instance`);
    console.log(`[Project] Name: ${props.name}`);
    console.log(`[Project] VideoURL: ${props.videoURL}`);

    this.name = props.name;
    this.id = new Id(props.id || randomUUID());
    console.log(`[Project] Assigned ID: ${this.id.value}`);

    this.port = new Port(props.port);
    console.log(`[Project] Assigned port: ${this.port.number}`);

    this.directory = props.directory || path.join(tmpdir(), this.id.value);
    console.log(`[Project] Directory: ${this.directory}`);

    const status = props.status || "initialized";
    const castedStatus = status as ProjectStatus;
    this.repoURL =
      "repoURL" in props
        ? props.repoURL
        : props.repoURLOrShorthand.startsWith("http")
          ? props.repoURLOrShorthand
          : `https://github.com/${props.repoURLOrShorthand}`;
    console.log(`[Project] Repository URL: ${this.repoURL}`);

    if (!AllowedProjectStatuses.includes(castedStatus)) {
      console.error(`[Project] Invalid project status: ${castedStatus}`);
      throw new Error(`Invalid project status: ${castedStatus}`);
    }
    this.status = castedStatus;
    console.log(`[Project] Status: ${this.status}`);

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

    console.log(
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
    console.log(`[Project] Getting videoId for project ${this.id.value}`);
    const url = this.videoURL;

    // Match various YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        console.log(`[Project] Successfully extracted videoId: ${match[1]}`);
        return match[1];
      }
    }

    console.error(`[Project] Unable to extract video ID from URL: ${url}`);
    throw new Error("Unable to extract video ID");
  }

  toDTO() {
    console.log(`[Project] Converting project ${this.id.value} to DTO`);
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
    console.log(`[Project] DTO created with ${Object.keys(dto).length} fields`);
    return dto;
  }

  async setup() {
    console.log(
      `[Project] Starting setup for project ${this.id.value} from ${this.repoURL}`
    );
    console.log(`[Project] Target directory: ${this.directory}`);

    const emitter = degit(this.repoURL, {
      cache: true,
      force: true,
      verbose: true,
    });

    console.log(`[Project] Cloning repository...`);
    await emitter.clone(this.directory);
    console.log(`[Project] Repository cloned successfully`);

    console.log(`[Project] Running parallel setup tasks (env + npm install)`);
    await Promise.all([
      this.emitEnvInFolder(this.directory),
      this.conductNpmInstall(this.directory),
    ]);
    console.log(`[Project] Setup completed successfully`);
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
    console.log(`[Project] Getting stats for project ${this.id.value}`);
    const root = this.directory;
    console.log(`[Project] Analyzing directory: ${root}`);

    const pkg = this.safeReadJSON(path.join(root, "package.json"));
    const allDeps = {
      ...(pkg?.dependencies ?? {}),
      ...(pkg?.devDependencies ?? {}),
    } as Record<string, string>;

    console.log(`[Project] Found ${Object.keys(allDeps).length} dependencies`);

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
    console.log(`[Project] Found ${files.length} source files to analyze`);

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

    console.log(
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
    console.log(
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

    console.log(`[Project] Stats analysis completed`);
    return result;
  }

  /** Absolute path to the cloned repo */
  private get repoPath() {
    console.log(
      `[Project] Getting repoPath for project ${this.id.value}: ${this.directory}`
    );
    return this.directory;
  }

  /**
   * Start the target project's Mastra playground/server.
   * Heuristic: prefer `npm run dev`, then `npm start`. PORT is forced to this.port.number.
   */
  async startTargetServer(): Promise<void> {
    console.log(
      `[Project] Starting target server for project ${this.id.value}`
    );
    if (this._serverProc && !this._serverProc.killed) {
      console.log(`[Project] Server already running, skipping start`);
      return; // already running
    }

    console.log(`[Project] Reading package.json from ${this.repoPath}`);
    const pkg =
      this.safeReadJSON(path.join(this.repoPath, "package.json")) || {};
    const scripts = (pkg.scripts || {}) as Record<string, string>;
    const hasDev = typeof scripts.dev === "string";
    const hasStart = typeof scripts.start === "string";

    const cmd = this.config.NPM_PATH;
    const args = hasDev
      ? ["run", "dev"]
      : hasStart
        ? ["start"]
        : ["run", "dev"]; // default to dev

    console.log(
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
    console.log(
      `[Project] Server process started, waiting for ready signal...`
    );
    await this.waitForServerReady(60_000);
    console.log(`[Project] Target server is ready and responding`);
  }

  /** Poll the server until it responds or timeout */
  private async waitForServerReady(timeoutMs = 30000): Promise<void> {
    console.log(
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
        console.log(`[Project] Server ready check attempt ${attempts}`);
        await tryPing();
        console.log(
          `[Project] Server is ready after ${attempts} attempts (${Date.now() - start}ms)`
        );
        return;
      } catch { /* empty */ }
      await sleep(500);
    }
    console.error(
      `[Project] Server failed to become ready after ${attempts} attempts`
    );
    throw new Error(
      `Target server did not become ready on ${baseUrl} within ${timeoutMs}ms`
    );
  }

  /** Stop the target server if running */
  async stopTargetServer(): Promise<void> {
    console.log(
      `[Project] Stopping target server for project ${this.id.value}`
    );
    if (this._serverProc && !this._serverProc.killed) {
      console.log(`[Project] Sending SIGTERM to server process`);
      try {
        this._serverProc.kill("SIGTERM");
        console.log(`[Project] Server process terminated successfully`);
      } catch (error) {
        console.error(`[Project] Error stopping server process:`, error);
      }
    } else {
      console.log(`[Project] No running server process to stop`);
    }
  }

  private registerExitCleanup() {
    if (this._cleanupRegistered) {
      console.log(
        `[Project] Exit cleanup already registered for project ${this.id.value}`
      );
      return;
    }
    console.log(
      `[Project] Registering exit cleanup handlers for project ${this.id.value}`
    );
    this._cleanupRegistered = true;
    const cleanup = () => {
      if (this._serverProc && !this._serverProc.killed) {
        console.log(`[Project] Cleanup: terminating server process`);
        try {
          this._serverProc.kill("SIGTERM");
        } catch { /* empty */ }
      }
    };
    process.on("exit", cleanup);
    process.on("SIGINT", () => {
      console.log(`[Project] Received SIGINT, cleaning up...`);
      cleanup();
      process.exit(1);
    });
    process.on("SIGTERM", () => {
      console.log(`[Project] Received SIGTERM, cleaning up...`);
      cleanup();
      process.exit(1);
    });
  }


  private safeReadJSON(file: string): any | undefined {
    console.log(`[Project] Reading JSON file: ${file}`);
    try {
      const txt = readFileSync(file, "utf-8");
      const parsed = JSON.parse(txt);
      console.log(
        `[Project] Successfully parsed JSON file (${Object.keys(parsed).length} keys)`
      );
      return parsed;
    } catch (error) {
      console.warn(
        `[Project] Failed to read/parse JSON file ${file}:`,
        error instanceof Error ? error.message : "Unknown error"
      );
      return undefined;
    }
  }

  private async conductNpmInstall(folder: string): Promise<void> {
    console.log(`[Project] Starting npm install in folder: ${folder}`);
    console.log(`[Project] Using npm path: ${this.config.NPM_PATH}`);

    return new Promise((resolve, reject) => {
      const childProcess = spawn(this.config.NPM_PATH, ["install"], {
        cwd: folder,
        stdio: "inherit",
        shell: true,
      });

      childProcess.on("close", (code) => {
        console.log(`[Project] npm install completed with exit code: ${code}`);

        if (code === 0) {
          resolve();
        } else {
          console.error(`[Project] npm install failed with exit code: ${code}`);
          reject(new Error(`npm install failed with exit code: ${code}`));
        }
      });

      childProcess.on("error", (error) => {
        console.error(`[Project] npm install process error:`, error);
        reject(new Error(`npm install process error: ${error.message}`));
      });
    });
  }
  private async emitEnvInFolder(folder: string) {
    console.log(`[Project] Creating .env file in folder: ${folder}`);
    const envPath = path.join(folder, ".env");
    const envContent = Object.entries(this.envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    console.log(
      `[Project] Writing ${Object.keys(this.envConfig).length} environment variables to .env`
    );
    await promises.writeFile(envPath, envContent, {
      encoding: "utf-8",
    });
    console.log(`[Project] .env file created successfully at: ${envPath}`);
  }
  get canonicalVideoURL() {
    console.log(
      `[Project] Getting canonical video URL for project ${this.id.value}`
    );
    const canonicalUrl = `https://www.youtube.com/watch?v=${this.videoId}`;
    console.log(`[Project] Canonical URL: ${canonicalUrl}`);
    return canonicalUrl;
  }
}

@injectable()
export class ProjectFactory {
  @inject(Config)
  config!: Config;

  create(props: ConstructorParameters<typeof Project>[0]) {
    console.log(`[ProjectFactory] Creating new Project with factory`);
    console.log(
      `[ProjectFactory] Props keys: ${Object.keys(props).join(", ")}`
    );
    const project = new Project(props, this.config);
    console.log(
      `[ProjectFactory] Project created with ID: ${project.id.value}`
    );
    return project;
  }
}
