import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { log } from "../config/logger";

log.info("Initializing Excalidraw Converter Workflow...");

const imageToCsvStep = createStep({
  id: "imageToCsv",
  inputSchema: z.object({
    filename: z.string(),
    file: z.string(),
  }),
  outputSchema: z.object({
    filename: z.string(),
    file: z.string(),
    csv: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    log.info("Starting image-to-CSV conversion", {
      filename: inputData.filename,
      fileSize: inputData.file.length,
      step: "imageToCsv"
    });

    const imageToCsv = mastra?.getAgent("imageToCsvAgent");
    if (imageToCsv === undefined) {
      log.error("imageToCsvAgent not found in Mastra instance", { step: "imageToCsv" });
      throw new Error("imageToCsvAgent not found");
    }

    try {
      const imageToCsvMessage = `View this image of a whiteboard diagram and convert it into CSV format. Include all text, lines, arrows, and shapes. Think through all the elements of the image.

Image data: ${inputData.file}`;

      const response = await imageToCsv.generate(imageToCsvMessage, { maxSteps: 10 });

      const duration = Date.now() - startTime;
      log.info("Image-to-CSV conversion completed", {
        filename: inputData.filename,
        csvLength: response.text.length,
        duration,
        step: "imageToCsv"
      });

      return {
        filename: `${inputData.filename.split(".")[0]}.excalidraw`,
        file: inputData.file,
        csv: response.text,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("Image-to-CSV conversion failed", {
        filename: inputData.filename,
        error: error instanceof Error ? error.message : String(error),
        duration,
        step: "imageToCsv"
      });
      throw error;
    }
  },
});

const validateCsvStep = createStep({
  id: "validateCsv",
  inputSchema: z.object({
    filename: z.string(),
    file: z.string(),
    csv: z.string(),
  }),
  outputSchema: z.object({
    filename: z.string(),
    file: z.string(),
    csv: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    log.info("Starting CSV validation", {
      filename: inputData.filename,
      csvLength: inputData.csv.length,
      step: "validateCsv"
    });

    const imageToCsv = mastra?.getAgent("imageToCsvAgent");
    if (imageToCsv === undefined) {
      log.error("imageToCsvAgent not found in Mastra instance", { step: "validateCsv" });
      throw new Error("imageToCsvAgent not found");
    }

    try {
      const validateCsvMessage = `View this image of a whiteboard diagram and convert it into CSV format.

Image data: ${inputData.file}

Previous CSV response: ${inputData.csv}

Please validate the CSV code above and add any missing elements (text, lines, etc.) to the CSV. The previous step may have missed some elements. Find them and add them. Return the complete CSV text.`;

      const response = await imageToCsv.generate(validateCsvMessage, {
        maxSteps: 10,
      });

      const duration = Date.now() - startTime;
      log.info("CSV validation completed", {
        filename: inputData.filename,
        csvLength: response.text.length,
        duration,
        step: "validateCsv"
      });

      return {
        filename: inputData.filename,
        file: inputData.file,
        csv: response.text,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error("CSV validation failed", {
        filename: inputData.filename,
        error: error instanceof Error ? error.message : String(error),
        duration,
        step: "validateCsv"
      });
      throw error;
    }
  },
});

const csvToExcalidrawStep = createStep({
  id: "csvToExcalidraw",
  inputSchema: z.object({
    filename: z.string(),
    file: z.string(),
    csv: z.string(),
  }),
  outputSchema: z.object({
    filename: z.string(),
    excalidrawJson: z.object({}).passthrough(),
  }),
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    log.info("Starting CSV-to-Excalidraw conversion", {
      filename: inputData.filename,
      csvLength: inputData.csv.length,
      step: "csvToExcalidraw"
    });

    // Parse CSV into rows
    const rows = inputData.csv
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    if (rows.length < 2) {
      log.error("CSV validation failed: insufficient data rows", {
        filename: inputData.filename,
        rowCount: rows.length,
        step: "csvToExcalidraw"
      });
      throw new Error("CSV must have header row and at least one data row");
    }

    // Parse header row
    const headers = rows[0].split(",").map((h: string) => h.trim());

    // Parse data rows into objects
    const elements = rows.slice(1).map((row: string) => {
      const values = row.split(",").map((v: string) => v.trim());
      const element: Record<string, unknown> = {};

      headers.forEach((header: string, index: number) => {
        const value = values[index];
        if (value === "") {
          return; // Skip empty values
        }

        // Parse special fields
        switch (header) {
          case "points":
            try {
              element[header] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              // Default to empty array if parsing fails
              element[header] = [[0, 0]];
            }
            break;
          case "boundElements":
            try {
              element[header] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              // Default to empty array if parsing fails
              element[header] = [];
            }
            break;
          case "startBinding":
          case "endBinding":
            try {
              element[header] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              // Default to null if parsing fails
              element[header] = null;
            }
            break;
          case "groupIds":
            try {
              element[header] = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              // Default to empty array if parsing fails
              element[header] = [];
            }
            break;
          case "width":
          case "height":
          case "x":
          case "y":
          case "angle":
          case "strokeWidth":
          case "roughness":
          case "opacity":
          case "fontSize":
          case "seed":
          case "version":
            element[header] = Number(value) || 0;
            break;
          case "isDeleted":
            element[header] = value === "true";
            break;
          case "fontFamily":
            element[header] = value === "20" ? "Arial" : value;
            break;
          default:
            // Clean up any potential JSON string issues
            if (typeof value === "string" && value.includes('"')) {
              try {
                element[header] = JSON.parse(value.replace(/'/g, '"'));
              } catch {
                element[header] = value.replace(/"/g, "");
              }
            } else {
              element[header] = value;
            }
        }
      });

      // Add required element properties
      element.frameId = element.frameId ?? null;
      element.updated = Date.now();
      element.link = null;
      element.locked = false;

      // Handle text element specifics
      if (element.type === "text") {
        element.originalText = element.text;
        element.lineHeight = 1.25;
        element.baseline = 0;
        element.containerId = null;
        element.autoResize = true;
      }

      // Ensure arrays are arrays and not strings
      if (element.groupIds !== undefined && typeof element.groupIds === "string") {
        element.groupIds = [];
      }
      if (element.boundElements !== undefined && typeof element.boundElements === "string") {
        element.boundElements = [];
      }

      return element;
    });

    // Create Excalidraw JSON
    const excalidrawJson = {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements,
      appState: {
        gridSize: 20,
        gridStep: 5,
        gridModeEnabled: false,
        viewBackgroundColor: "#ffffff",
      },
      files: {},
    };

    const duration = Date.now() - startTime;
    log.info("CSV-to-Excalidraw conversion completed", {
      filename: inputData.filename,
      elementCount: elements.length,
      duration,
      step: "csvToExcalidraw"
    });

    return {
      filename: inputData.filename,
      excalidrawJson,
    };
  },
});

const validateExcalidrawStep = createStep({
  id: "validateExcalidraw",
  inputSchema: z.object({
    filename: z.string(),
    excalidrawJson: z.object({}).passthrough(),
  }),
  outputSchema: z.object({
    filename: z.string(),
    contents: z.any(),
  }),
  execute: async ({ inputData, mastra }) => {
    const startTime = Date.now();
    log.info("Starting Excalidraw JSON validation", {
      filename: inputData.filename,
      step: "validateExcalidraw"
    });

    // Validate the JSON
    const validator = mastra?.getAgent("excalidrawValidatorAgent");
    if (validator === undefined) {
      log.error("excalidrawValidatorAgent not found in Mastra instance", { step: "validateExcalidraw" });
      throw new Error("excalidrawValidatorAgent not found");
    }

    let validationMessage = `Validate the following Excalidraw JSON. If it is not valid, fix it and just return the valid JSON.

Excalidraw JSON: ${JSON.stringify(inputData.excalidrawJson)}`;

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
        log.info("Excalidraw JSON validation completed", {
          filename: inputData.filename,
          attempts,
          duration,
          step: "validateExcalidraw"
        });

        return {
          filename: inputData.filename,
          contents: parsedJson,
        };
      } catch (e) {
        lastError = e as Error;
        log.warn(`Excalidraw validation attempt ${attempts} failed`, {
          filename: inputData.filename,
          error: e instanceof Error ? e.message : String(e),
          step: "validateExcalidraw"
        });

        // If we've reached the maximum number of attempts, break out of the loop
        if (attempts >= maxAttempts) {
          break;
        }

        // For retry attempts, include the previous response and error
        validationMessage = `Validate the following Excalidraw JSON. If it is not valid, fix it and just return the valid JSON.

Excalidraw JSON: ${JSON.stringify(inputData.excalidrawJson)}

Previous response: ${validationResponse?.text ?? "No response"}
Error: ${e}

Please fix the JSON and return only the valid JSON without any string quotes or newlines.`;
      }
    }

    // If we've exhausted all attempts, throw an error
    const duration = Date.now() - startTime;
    log.error("Excalidraw JSON validation failed after all attempts", {
      filename: inputData.filename,
      attempts: maxAttempts,
      lastError: lastError?.message,
      duration,
      step: "validateExcalidraw"
    });

    throw new Error(
      `Failed to validate Excalidraw JSON after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
  },
});

export const excalidrawConverterWorkflow = createWorkflow({
  id: "excalidraw-converter",
  inputSchema: z.object({
    filename: z.string(),
    file: z.string(),
  }),
  outputSchema: z.object({
    filename: z.string(),
    contents: z.any(),
  }),
});

excalidrawConverterWorkflow
  .then(imageToCsvStep)
  .then(validateCsvStep)
  .then(csvToExcalidrawStep)
  .then(validateExcalidrawStep)
  .commit();
