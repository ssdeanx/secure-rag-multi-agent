import { z } from "zod";

export const jwtClaimsSchema = z.object({
  sub: z.string(),
  roles: z.array(z.string()),
  tenant: z.string().optional(),
  stepUp: z.boolean().optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
  iss: z.string().optional(),
});

export const accessFilterSchema = z.object({
  allowTags: z.array(z.string()),
  maxClassification: z.enum(["public", "internal", "confidential"]),
});

export const documentContextSchema = z.object({
  text: z.string(),
  docId: z.string(),
  versionId: z.string(),
  source: z.string(),
  score: z.number(),
  securityTags: z.array(z.string()),
  classification: z.enum(["public", "internal", "confidential"]),
});

export const ragAnswerSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    docId: z.string(),
    source: z.string(),
  })),
});

export const verificationResultSchema = z.object({
  ok: z.boolean(),
  reason: z.string(),
  answer: z.union([
    z.string(),
    z.object({
      text: z.string(),
      citations: z.array(z.object({
        docId: z.string(),
        source: z.string(),
      }))
    })
  ]),
});