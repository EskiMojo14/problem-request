import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { LooseProblemDetails } from "../lib/types/index.ts";

// #__NO_SIDE_EFFECTS__
function makeKeyIsType(issues: Array<StandardSchemaV1.Issue>) {
  return function keyIsType(
    obj: Record<string, unknown>,
    key: string,
    type: "string" | "number",
  ): void {
    // all keys are optional
    if (typeof obj[key] === "undefined" || typeof obj[key] === type) return;
    issues.push({
      message: `Expected ${type} for key "${key}", but got ${typeof obj[key]}.`,
      path: [key],
    });
  };
}

/**
 * The standard schema for RFC 7807 Problem Details.
 *
 * This schema defines the structure and validation rules for Problem Details objects as specified in RFC 7807.
 * It ensures that the fields are of the correct types if present, while allowing for additional custom fields.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 *
 * const problemDetails = standardSchema.parseSync(standardSchema.problemDetailsSchema, {
 *   type: "https://example.com/probs/out-of-credit",
 *   title: "You do not have enough credit.",
 *   status: 403,
 *   detail: "Your current balance is 30, but that costs 50.",
 *   instance: "/account/12345/msgs/abc",
 * });
 *
 * console.log(problemDetails);
 */
export const problemDetailsSchema: StandardSchemaV1<LooseProblemDetails> = {
  "~standard": {
    version: 1,
    vendor: "problem-request",
    validate(value) {
      const issues: Array<StandardSchemaV1.Issue> = [];
      const keyIsType = makeKeyIsType(issues);
      if (typeof value !== "object" || value === null) {
        return {
          issues: [
            {
              message: `Expected an object, but got ${value === null ? "null" : typeof value}.`,
            },
          ],
        };
      }
      const obj = value as Record<string, unknown>;
      keyIsType(obj, "status", "number");
      for (const key of ["type", "title", "detail", "instance"]) {
        keyIsType(obj, key, "string");
      }
      return issues.length ? { issues } : { value: value as LooseProblemDetails };
    },
  },
};
