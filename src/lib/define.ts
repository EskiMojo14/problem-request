import * as standardSchema from "../standard.ts";
import { ProblemResponse } from "./response.ts";
import type {
  ProblemConstructResult,
  ProblemFactory,
  ProblemDefinition,
  ProblemSchema,
} from "./types.ts";

/**
 * Defines a problem to match against.
 *
 * @param type - The unique type identifier for the problem.
 * @param schema - The schema that the problem details must conform to.
 * @returns A problem definition that can be used to match against problem responses.
 *
 * @example
 * const IAmATeapot = defineProblem(
 *   "https://example.com/probs/i-am-a-teapot",
 *   v.object({
 *    title: v.literal("I'm a teapot"),
 *    status: v.literal(418),
 *    tea: v.optional(v.string()),
 *   }),
 * );
 */
export function defineProblem<const TType extends string, TSchema extends ProblemSchema<TType>>(
  type: TType,
  schema: TSchema,
): ProblemDefinition<TType, TSchema>;

/**
 * Defines a problem factory that creates problem responses based on the provided type, schema, and construction function.
 * The factory ensures that the constructed problem details conform to both the RFC 7807 standard and the provided schema.
 *
 * @param type - The unique type identifier for the problem.
 * @param schema - The schema that the problem details must conform to.
 * @param construct - A function that constructs the problem details based on the provided arguments.
 * @returns A problem factory that can be used to create problem responses.
 *
 * @example
 * const IAmATeapot = defineProblem(
 *   "https://example.com/probs/i-am-a-teapot",
 *   v.object({
 *    title: v.literal("I'm a teapot"),
 *    status: v.literal(418),
 *    tea: v.optional(v.string()),
 *   }),
 *   (tea?: string) => ({ title: "I'm a teapot", status: 418, tea }),
 * );
 *
 * const response = IAmATeapot("Earl Grey"); // Creates a ProblemResponse with the specified problem details.
 *
 * console.log(response.status); // 418
 * console.log(response.headers.get("Content-Type")); // "application/problem+json"
 * console.log(await response.json()); // { type: "https://example.com/probs/i-am-a-teapot", title: "I'm a teapot", status: 418, tea: "Earl Grey" }
 */
export function defineProblem<
  const TType extends string,
  TSchema extends ProblemSchema<TType>,
  TArgs extends Array<any>,
>(
  type: TType,
  schema: TSchema,
  construct: (...args: TArgs) => ProblemConstructResult<TType, TSchema>,
): ProblemFactory<TType, TSchema, TArgs>;

// #__NO_SIDE_EFFECTS__
export function defineProblem<
  const TType extends string,
  TSchema extends ProblemSchema<TType>,
  TArgs extends Array<any>,
>(
  type: TType,
  schema: TSchema,
  construct?: (...args: TArgs) => ProblemConstructResult<TType, TSchema>,
): ProblemFactory<TType, TSchema, TArgs> | ProblemDefinition<TType, TSchema> {
  const definition: ProblemDefinition<TType, TSchema> = { type, schema };
  if (!construct) return definition;
  return Object.assign(function constructProblem(...args: TArgs) {
    const constructed = construct(...args);
    const [problem, init] = Array.isArray(constructed) ? constructed : [constructed, undefined];
    const withType = { ...problem, type };
    // check against RFC first
    standardSchema.parseSync(standardSchema.problemDetailsSchema, withType);
    // then check against the provided schema
    standardSchema.parseSync(schema, withType);
    return ProblemResponse.problem(withType, init);
  }, definition);
}
