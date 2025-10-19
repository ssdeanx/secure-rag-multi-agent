import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { log } from "../config/logger";
import * as fs from "fs";
import * as path from "path";

log.info("Initializing Excalidraw Generator Workflow...");

// In-memory template cache for performance
const templateCache = new Map<string, unknown>();

// Available templates in the data folder
type TemplateType = "circle" | "diagram" | "diamond" | "example-text-arrows" | "pencil" | "relationship" | "test";

const templateMatcherStep = createStep({
  id: "templateMatcher",
  inputSchema: z.object({
    query: z.string(),
    customizations: z.object({
      title: z.string().optional(),
      colors: z.array(z.string()).optional(),
      size: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
      }).optional(),
    }).optional(),
  }),
  outputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templatePath: z.string(),
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    log.info("Starting template matching", {
      query: inputData.query,
      step: "templateMatcher"
    });

    // Simple keyword-based template matching
    const query = inputData.query.toLowerCase();

    let selectedTemplate: TemplateType = "diagram"; // default

    if (query.includes("circle") || query.includes("round") || query.includes("oval")) {
      selectedTemplate = "circle";
    } else if (query.includes("diamond") || query.includes("decision") || query.includes("rhombus")) {
      selectedTemplate = "diamond";
    } else if (query.includes("arrow") || query.includes("flow") || query.includes("connection")) {
      selectedTemplate = "example-text-arrows";
    } else if (query.includes("relationship") || query.includes("connect") || query.includes("link")) {
      selectedTemplate = "relationship";
    } else if (query.includes("pencil") || query.includes("sketch") || query.includes("hand-drawn")) {
      selectedTemplate = "pencil";
    } else if (query.includes("test") || query.includes("sample")) {
      selectedTemplate = "test";
    }
    // diagram remains default for general cases

    const templatePath = path.join(__dirname, "../data", `${selectedTemplate}.excalidraw`);

    const duration = Date.now() - startTime;

    log.info("Template matching completed", {
      query: inputData.query,
      selectedTemplate,
      templatePath,
      duration,
      step: "templateMatcher"
    });

    return {
      query: inputData.query,
      selectedTemplate,
      customizations: inputData.customizations ?? {},
      templatePath,
    };
  },
});

const templateLoaderStep = createStep({
  id: "templateLoader",
  inputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templatePath: z.string(),
  }),
  outputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templateData: z.any(),
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    log.info("Loading template file", {
      templatePath: inputData.templatePath,
      step: "templateLoader"
    });

    try {
      // Check template cache first
      const cacheKey = inputData.templatePath;
      const cachedTemplate = templateCache.get(cacheKey);

      if (cachedTemplate !== undefined) {
        log.info("Template loaded from cache", {
          templatePath: inputData.templatePath,
          step: "templateLoader"
        });

        return {
          query: inputData.query,
          selectedTemplate: inputData.selectedTemplate,
          customizations: inputData.customizations,
          templateData: cachedTemplate,
        };
      }

      // Check if template file exists
      if (!fs.existsSync(inputData.templatePath)) {
        log.error("Template file not found", {
          templatePath: inputData.templatePath,
          step: "templateLoader"
        });
        throw new Error(`Template file not found: ${inputData.templatePath}`);
      }

      // Read the template file
      const templateContent = fs.readFileSync(inputData.templatePath, "utf-8");
      const templateData = JSON.parse(templateContent);

      // Cache the template
      templateCache.set(cacheKey, templateData);

      const duration = Date.now() - startTime;

      log.info("Template loaded successfully", {
        templatePath: inputData.templatePath,
        elementCount: (templateData as { elements?: unknown[] })?.elements?.length ?? 0,
        duration,
        step: "templateLoader"
      });

      return {
        query: inputData.query,
        selectedTemplate: inputData.selectedTemplate,
        customizations: inputData.customizations,
        templateData,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("Template loading failed", {
        templatePath: inputData.templatePath,
        error: error instanceof Error ? error.message : String(error),
        duration,
        step: "templateLoader"
      });
      throw error;
    }
  },
});

const templateValidatorStep = createStep({
  id: "templateValidator",
  inputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templateData: z.any(),
  }),
  outputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templateData: z.any(),
    validationResults: z.object({
      syntaxValid: z.boolean(),
      schemaValid: z.boolean(),
      contentValid: z.boolean(),
      errors: z.array(z.string()),
    }),
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    log.info("Starting parallel template validation", {
      template: inputData.selectedTemplate,
      step: "templateValidator"
    });

    try {
      // Run all validations in parallel for better performance
      const [syntaxResult, schemaResult, contentResult] = await Promise.all([
        validateTemplateSyntax(inputData.templateData),
        validateTemplateSchema(inputData.templateData),
        validateTemplateContent(inputData.templateData)
      ]);

      const validationResults = {
        syntaxValid: syntaxResult.valid,
        schemaValid: schemaResult.valid,
        contentValid: contentResult.valid,
        errors: [
          ...syntaxResult.errors,
          ...schemaResult.errors,
          ...contentResult.errors
        ]
      };

      const allValid = validationResults.syntaxValid && validationResults.schemaValid && validationResults.contentValid;

      const duration = Date.now() - startTime;
      log.info("Template validation completed", {
        template: inputData.selectedTemplate,
        allValid,
        errorCount: validationResults.errors.length,
        duration,
        step: "templateValidator"
      });

      if (!allValid) {
        log.warn("Template validation failed", {
          template: inputData.selectedTemplate,
          errors: validationResults.errors,
          step: "templateValidator"
        });
      }

      return {
        query: inputData.query,
        selectedTemplate: inputData.selectedTemplate,
        customizations: inputData.customizations,
        templateData: inputData.templateData,
        validationResults,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("Template validation failed with exception", {
        template: inputData.selectedTemplate,
        error: error instanceof Error ? error.message : String(error),
        duration,
        step: "templateValidator"
      });
      throw error;
    }
  },
});

// Validation helper functions
const validateTemplateSyntax = async (templateData: unknown): Promise<{ valid: boolean; errors: string[] }> => {
  try {
    // Check if it's valid JSON structure
    if (typeof templateData !== 'object' || templateData === null) {
      return { valid: false, errors: ['Template is not a valid object'] };
    }

    // Check for required Excalidraw properties
    const requiredProps = ['type', 'version', 'source'];
    const missingProps = requiredProps.filter(prop => !(prop in templateData));

    if (missingProps.length > 0) {
      return { valid: false, errors: [`Missing required properties: ${missingProps.join(', ')}`] };
    }

    return { valid: true, errors: [] };
  } catch (error) {
    return { valid: false, errors: [`Syntax validation error: ${error instanceof Error ? error.message : String(error)}`] };
  }
};

const validateTemplateSchema = async (templateData: unknown): Promise<{ valid: boolean; errors: string[] }> => {
  try {
    // Type guard for template data
    if (typeof templateData !== 'object' || templateData === null) {
      return { valid: false, errors: ['Template data is not an object'] };
    }

    const data = templateData as Record<string, unknown>;

    // Check if elements array exists and is valid
    if (!Array.isArray(data.elements)) {
      return { valid: false, errors: ['Template missing elements array'] };
    }

    // Validate a few key elements for schema compliance
    const elements = data.elements as unknown[];
    if (elements.length > 0) {
      const requiredElementProps = ['id', 'type', 'x', 'y', 'width', 'height'];

      for (const element of elements.slice(0, 5)) { // Check first 5 elements
        if (typeof element !== 'object' || element === null) {
          return { valid: false, errors: ['Element is not an object'] };
        }

        const el = element as Record<string, unknown>;
        const missingProps = requiredElementProps.filter(prop => !(prop in el));
        if (missingProps.length > 0) {
          return { valid: false, errors: [`Element missing required properties: ${missingProps.join(', ')}`] };
        }
      }
    }

    return { valid: true, errors: [] };
  } catch (error) {
    return { valid: false, errors: [`Schema validation error: ${error instanceof Error ? error.message : String(error)}`] };
  }
};

const validateTemplateContent = async (templateData: unknown): Promise<{ valid: boolean; errors: string[] }> => {
  try {
    // Type guard for template data
    if (typeof templateData !== 'object' || templateData === null) {
      return { valid: false, errors: ['Template data is not an object'] };
    }

    const data = templateData as Record<string, unknown>;

    // Check for reasonable content constraints
    const elements = (data.elements as unknown[]) ?? [];

    if (elements.length === 0) {
      return { valid: false, errors: ['Template has no elements'] };
    }

    if (elements.length > 1000) {
      return { valid: false, errors: ['Template has too many elements (>1000)'] };
    }

    // Check for duplicate element IDs
    const ids = elements
      .map((el) => {
        if (typeof el === 'object' && el !== null) {
          return (el as Record<string, unknown>).id;
        }
        return undefined;
      })
      .filter(Boolean);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      return { valid: false, errors: ['Template has duplicate element IDs'] };
    }

    return { valid: true, errors: [] };
  } catch (error) {
    return { valid: false, errors: [`Content validation error: ${error instanceof Error ? error.message : String(error)}`] };
  }
};

const templateCustomizerStep = createStep({
  id: "templateCustomizer",
  inputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizations: z.any(),
    templateData: z.any(),
    validationResults: z.object({
      syntaxValid: z.boolean(),
      schemaValid: z.boolean(),
      contentValid: z.boolean(),
      errors: z.array(z.string()),
    }),
  }),
  outputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizedData: z.any(),
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    log.info("Starting template customization", {
      query: inputData.query,
      selectedTemplate: inputData.selectedTemplate,
      step: "templateCustomizer"
    });

    const customizer = mastra?.getAgent("csvToExcalidrawAgent");
    if (customizer === undefined) {
      log.error("csvToExcalidrawAgent not found in Mastra instance", { step: "templateCustomizer" });
      throw new Error("csvToExcalidrawAgent not found");
    }

    try {
      // Create a prompt for the agent to customize the template
      const customizationPrompt = `Take this Excalidraw template and customize it based on the user's query: "${inputData.query}"

Template: ${JSON.stringify(inputData.templateData)}

Customizations requested: ${JSON.stringify(inputData.customizations)}

Please modify the template to match the user's request while maintaining the Excalidraw JSON format. Return only the customized Excalidraw JSON.`;

      const response = await customizer.generate(customizationPrompt, { maxSteps: 10 });

      // Parse the customized JSON
      let customizedData;
      try {
        customizedData = JSON.parse(response.text);
      } catch (parseError) {
        log.warn("Failed to parse customized JSON, using original template", {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          step: "templateCustomizer"
        });
        customizedData = inputData.templateData;
      }

      const duration = Date.now() - startTime;
      log.info("Template customization completed", {
        query: inputData.query,
        selectedTemplate: inputData.selectedTemplate,
        elementCount: (customizedData as { elements?: unknown[] })?.elements?.length ?? 0,
        duration,
        step: "templateCustomizer"
      });

      return {
        query: inputData.query,
        selectedTemplate: inputData.selectedTemplate,
        customizedData,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("Template customization failed", {
        query: inputData.query,
        selectedTemplate: inputData.selectedTemplate,
        error: error instanceof Error ? error.message : String(error),
        duration,
        step: "templateCustomizer"
      });
      throw error;
    }
  },
});

const diagramValidatorStep = createStep({
  id: "diagramValidator",
  inputSchema: z.object({
    query: z.string(),
    selectedTemplate: z.string(),
    customizedData: z.any(),
  }),
  outputSchema: z.object({
    query: z.string(),
    filename: z.string(),
    contents: z.any(),
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    log.info("Starting diagram validation", {
      query: inputData.query,
      selectedTemplate: inputData.selectedTemplate,
      step: "diagramValidator"
    });

    const validator = mastra?.getAgent("excalidrawValidatorAgent");
    if (validator === undefined) {
      log.error("excalidrawValidatorAgent not found in Mastra instance", { step: "diagramValidator" });
      throw new Error("excalidrawValidatorAgent not found");
    }

    let validationMessage = `Validate and fix this Excalidraw JSON diagram. Ensure it follows the proper Excalidraw format and all elements are correctly structured. The diagram was generated from a template for the query: "${inputData.query}"

Diagram data:
${JSON.stringify(inputData.customizedData)}`;

    let attempts = 0;
    const maxAttempts = 3;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      attempts++;

      let validationResponse: { text: string } | undefined;

      try {
        validationResponse = await validator.generate(validationMessage, {
          maxSteps: 10,
        });

        // Try to parse the response
        let cleanedResponse = validationResponse.text;

        // If the response is wrapped in quotes, remove them
        if (cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) {
          cleanedResponse = cleanedResponse.slice(1, -1);
        }

        // Replace escaped quotes and newlines
        cleanedResponse = cleanedResponse
          .replace(/\\"/g, '"')
          .replace(/\\n/g, "");

        const parsedJson = JSON.parse(cleanedResponse);

        // If we successfully parsed the JSON, return it
        const duration = Date.now() - startTime;
        log.info("Diagram validation completed", {
          query: inputData.query,
          selectedTemplate: inputData.selectedTemplate,
          attempts,
          elementCount: (parsedJson as { elements?: unknown[] })?.elements?.length ?? 0,
          duration,
          step: "diagramValidator"
        });

        return {
          query: inputData.query,
          filename: `${inputData.selectedTemplate}-generated.excalidraw`,
          contents: parsedJson,
        };
      } catch (e) {
        lastError = e as Error;
        log.warn(`Diagram validation attempt ${attempts} failed`, {
          query: inputData.query,
          selectedTemplate: inputData.selectedTemplate,
          error: e instanceof Error ? e.message : String(e),
          step: "diagramValidator"
        });

        // If we've reached the maximum number of attempts, break out of the loop
        if (attempts >= maxAttempts) {
          break;
        }

        // For retry attempts, include the previous response and error
        validationMessage = `Validate and fix this Excalidraw JSON diagram. Ensure it follows the proper Excalidraw format and all elements are correctly structured. The diagram was generated from a template for the query: "${inputData.query}"

Previous response: ${validationResponse?.text ?? "No response"}
Error: ${e}

Diagram data:
${JSON.stringify(inputData.customizedData)}`;
      }
    }

    // If we've exhausted all attempts, throw an error
    const duration = Date.now() - startTime;
    log.error("Diagram validation failed after all attempts", {
      query: inputData.query,
      selectedTemplate: inputData.selectedTemplate,
      attempts: maxAttempts,
      lastError: lastError?.message,
      duration,
      step: "diagramValidator"
    });

    throw new Error(
      `Failed to validate diagram after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
  },
});

export const excalidrawGeneratorWorkflow = createWorkflow({
  id: "excalidraw-generator",
  inputSchema: z.object({
    query: z.string(),
    customizations: z.object({
      title: z.string().optional(),
      colors: z.array(z.string()).optional(),
      size: z.object({
        width: z.number().optional(),
        height: z.number().optional(),
      }).optional(),
    }).optional(),
  }),
  outputSchema: z.object({
    query: z.string(),
    filename: z.string(),
    contents: z.any(),
  }),
});

excalidrawGeneratorWorkflow
  .then(templateMatcherStep)
  .then(templateLoaderStep)
  .then(templateValidatorStep)
  .then(templateCustomizerStep)
  .then(diagramValidatorStep)
  .commit();
