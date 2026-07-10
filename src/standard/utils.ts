import type { StandardSchemaV1 } from "@standard-schema/spec";
import { SchemaError } from "@standard-schema/utils";

import type { LooseAutocomplete } from "../lib/types.ts";

/**
 * Parse an unknown value against a schema synchronously.
 *
 * @param schema Any standard schema.
 * @param value Unknown value to be parsed against the schema.
 * @returns Result object containing either the parsed value or a list of issues.
 * @throws {TypeError} If the schema validation is asynchronous.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 * import * as v from "valibot";
 *
 * const result = standardSchema.safeParseSync(
 *   v.object({
 *     title: v.string(),
 *     status: v.number(),
 *   }),
 *   { title: "Error", status: 400 },
 * );
 * if (result.issues) {
 *   console.error(result.issues);
 * } else {
 *   console.log(result.value); // { title: "Error", status: 400 }
 * }
 */
// #__NO_SIDE_EFFECTS__
export function safeParseSync<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>> {
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) throw new TypeError("Only synchronous validation allowed.");
  return result;
}

/**
 * Parse an unknown value against a schema asynchronously.
 *
 * @param schema Any standard schema.
 * @param value Value to be parsed against the schema.
 * @returns A promise that resolves to a result object containing either the parsed value or a list of issues.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 * import * as v from "valibot";
 *
 * const result = await standardSchema.safeParse(
 *   v.object({
 *     title: v.string(),
 *     status: v.number(),
 *   }),
 *   { title: "Error", status: 400 },
 * );
 * if (result.issues) {
 *   console.error(result.issues);
 * } else {
 *   console.log(result.value); // { title: "Error", status: 400 }
 * }
 */
// #__NO_SIDE_EFFECTS__
export async function safeParse<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>> {
  return schema["~standard"].validate(value);
}

/**
 * Parse an unknown value against a schema synchronously.
 *
 * @param schema Any standard schema.
 * @param value Unknown value to be parsed against the schema.
 * @returns The parsed value if valid according to the schema.
 * @throws {SchemaError} If the value is invalid according to the schema.
 * @throws {TypeError} If the schema validation is asynchronous.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 * import * as v from "valibot";
 *
 * try {
 *   const result = standardSchema.parseSync(
 *     v.object({
 *       title: v.string(),
 *       status: v.number(),
 *     }),
 *     { title: "Error", status: 400 },
 *   );
 *   console.log(result); // { title: "Error", status: 400 }
 * } catch (error) {
 *   if (error instanceof SchemaError) {
 *     console.error(error.issues);
 *   }
 * }
 */
// #__NO_SIDE_EFFECTS__
export function parseSync<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): StandardSchemaV1.InferOutput<TSchema> {
  const result = safeParseSync(schema, value);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

/**
 * Parse an unknown value against a schema asynchronously.
 *
 * @param schema Any standard schema.
 * @param value Unknown value to be parsed against the schema.
 * @returns A promise that resolves to the parsed value if valid according to the schema.
 * @throws {SchemaError} If the value is invalid according to the schema.
 */
// #__NO_SIDE_EFFECTS__
export async function parse<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): Promise<StandardSchemaV1.InferOutput<TSchema>> {
  const result = await schema["~standard"].validate(value);
  if (result.issues) throw new SchemaError(result.issues);
  return result.value;
}

/**
 * Check if a value is valid according to a schema.
 *
 * @param schema Any standard schema.
 * @param value Unknown value to be checked against the schema.
 * @returns `true` if the value is valid according to the schema, `false` otherwise.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 * import * as v from "valibot";
 *
 * const value: unknown = { title: "Error", status: 400 };
 * if (standardSchema.is(
 *   v.object({ title: v.string(), status: v.number() }),
 *   value
 * )) {
 *   console.log("Value is valid according to the schema.", value.title);
 * } else {
 *   console.log("Value is invalid according to the schema.");
 * }
 */
// #__NO_SIDE_EFFECTS__
export function is<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): value is StandardSchemaV1.InferOutput<TSchema> {
  return !safeParseSync(schema, value).issues;
}

/**
 * Asserts that a value is valid according to a schema.
 *
 * @param schema Any standard schema.
 * @param value Unknown value to be asserted against the schema.
 * @throws {SchemaError} If the value is invalid according to the schema.
 *
 * @example
 * import * as standardSchema from "problem-request/standard";
 * import * as v from "valibot";
 *
 * try {
 *  standardSchema.assert(
 *    v.object({ title: v.string(), status: v.number() }),
 *    { title: "Error", status: 400 }
 *  );
 *  console.log("Value is valid according to the schema.");
 * } catch (error) {
 *   if (error instanceof SchemaError) {
 *     console.error("Value is invalid according to the schema.", error.issues);
 *   }
 * }
 */
// #__NO_SIDE_EFFECTS__
export function assert<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  value: LooseAutocomplete.Unknown<StandardSchemaV1.InferInput<TSchema>>,
): asserts value is StandardSchemaV1.InferOutput<TSchema> {
  parseSync(schema, value);
}
