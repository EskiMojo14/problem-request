import { expect, describe, it } from "vite-plus/test";

import * as f from "../../tests/fixtures.ts";
import { defineProblem } from "./define.ts";
import { ProblemResponse } from "./response.ts";

describe("defineProblem", () => {
  describe("without construct function", () => {
    it("should create a ProblemDefinition with type and schema", () => {
      const problemDef = defineProblem(f.outOfCreditType, f.outOfCreditSchema);
      expect(problemDef).toHaveProperty("type", f.outOfCreditType);
      expect(problemDef).toHaveProperty("schema", f.outOfCreditSchema);
    });
  });

  describe("with construct function", () => {
    const problems = {
      OutOfCredit: defineProblem(
        f.outOfCreditType,
        f.outOfCreditSchema,
        (detail: string, instance: string, accounts: Array<string>) => ({
          title: "You do not have enough credit.",
          status: 403,
          detail,
          instance,
          accounts,
        }),
      ),
      IAmATeapot: defineProblem(f.iAmATeapotType, f.iAmATeapotSchema, () => [
        { title: "I'm a teapot", status: 418 },
        {
          headers: {
            "X-Custom-Header": "CustomValue",
          },
        },
      ]),
    };

    it("should create a ProblemResponse using the defined problem", async () => {
      const problem = problems.OutOfCredit(
        "Your current balance is 30, but that costs 50.",
        "/account/12345/msgs/abc",
        ["/account/12345", "/account/67890"],
      );
      expect(problem).toBeInstanceOf(Response);
      expect(problem).toBeInstanceOf(ProblemResponse);
      expect(problem).toHaveStatus(403);
      await expect(problem).toHaveJSONBody({
        type: f.outOfCreditType,
        title: "You do not have enough credit.",
        detail: "Your current balance is 30, but that costs 50.",
        status: 403,
        instance: "/account/12345/msgs/abc",
        accounts: ["/account/12345", "/account/67890"],
      });
    });
    it("should create a ProblemResponse with custom init using the defined problem", async () => {
      const problem = problems.IAmATeapot();
      expect(problem).toBeInstanceOf(Response);
      expect(problem).toBeInstanceOf(ProblemResponse);
      expect(problem).toHaveStatus(418);
      expect(problem).toHaveHeader("X-Custom-Header", "CustomValue");
      await expect(problem).toHaveJSONBody({
        type: f.iAmATeapotType,
        title: "I'm a teapot",
        status: 418,
      });
    });
  });
});
