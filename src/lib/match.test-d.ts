import type { StandardSchemaV1 } from "@standard-schema/spec";
import { describe, it, expectTypeOf } from "vite-plus/test";

import * as f from "../../tests/fixtures.ts";
import { defineProblem } from "./define.ts";
import { matchProblem } from "./match.ts";
import type { LooseProblemDetails } from "./types/index.ts";
import type { Compute } from "./types/utils.ts";

const problems = {
  OutOfCredit: defineProblem(f.outOfCreditType, f.outOfCreditSchema),
  IAmATeapot: defineProblem(f.iAmATeapotType, f.iAmATeapotSchema),
};
const response = new Response();

describe("matchProblem", () => {
  it("should narrow to a known problem", async () => {
    const matchResult = await matchProblem(response, problems);
    if (matchResult.matched) {
      expectTypeOf(matchResult).toHaveProperty("isProblem").toEqualTypeOf<true>();
      expectTypeOf(matchResult).toHaveProperty("type").toBeString();
      const { problem } = matchResult;
      switch (problem.type) {
        case problems.OutOfCredit.type:
          expectTypeOf(problem).toEqualTypeOf<
            Compute<f.OutOfCreditProblem & { type: typeof f.outOfCreditType }>
          >();
          break;
        case problems.IAmATeapot.type:
          expectTypeOf(problem).toEqualTypeOf<
            Compute<f.IAmATeapotProblem & { type: typeof f.iAmATeapotType }>
          >();
          break;
      }
    }
  });
  it("should narrow to an unknown problem", async () => {
    const matchResult = await matchProblem(response, problems);
    if (!matchResult.matched && matchResult.isProblem) {
      expectTypeOf(matchResult).toHaveProperty("problem").toEqualTypeOf<LooseProblemDetails>();
      expectTypeOf(matchResult).toHaveProperty("type").toEqualTypeOf<string | undefined>();
      expectTypeOf(matchResult)
        .toHaveProperty("issues")
        .toEqualTypeOf<ReadonlyArray<StandardSchemaV1.Issue> | undefined>();
    }
  });
  it("should narrow to a non-problem response", async () => {
    const matchResult = await matchProblem(response, problems);
    if (!matchResult.matched && !matchResult.isProblem) {
      expectTypeOf(matchResult).toHaveProperty("reason").toEqualTypeOf<
        | {
            contentType?: string | null;
            status?: number;
            bodyUsed?: boolean;
            jsonError?: unknown;
            issues?: ReadonlyArray<StandardSchemaV1.Issue>;
          }
        | undefined
      >();
      expectTypeOf(matchResult).toHaveProperty("problem").toEqualTypeOf<unknown>();
    }
  });
});
