import { describe, it, expectTypeOf } from "vite-plus/test";

import * as f from "../../tests/fixtures.ts";
import { defineProblem } from "./define.ts";

describe("defineProblem", () => {
  it("strongly types type and schema", () => {
    const problem = defineProblem(f.iAmATeapotType, f.iAmATeapotSchema);
    expectTypeOf(problem).toHaveProperty("type").toEqualTypeOf(f.iAmATeapotType);
    expectTypeOf(problem).toHaveProperty("schema").toEqualTypeOf(f.iAmATeapotSchema);
  });
  it("infers arguments from construct function", () => {
    const problem = defineProblem(
      f.outOfCreditType,
      f.outOfCreditSchema,
      (detail: string, instance: string, accounts: Array<string>) => ({
        title: "You do not have enough credit.",
        status: 403,
        detail,
        instance,
        accounts,
      }),
    );
    expectTypeOf(problem).parameters.toEqualTypeOf<[string, string, Array<string>]>();
  });
  it("errors if construct function returns invalid problem object", () => {
    // @ts-expect-error missing required properties
    defineProblem(f.outOfCreditType, f.outOfCreditSchema, () => ({
      title: "You do not have enough credit.",
    }));
    // @ts-expect-error not a valid problem object
    defineProblem(f.outOfCreditType, f.outOfCreditSchema, () => 2);
  });
});
