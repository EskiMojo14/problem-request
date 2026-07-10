import { expect, describe, it } from "vite-plus/test";

import * as f from "../../tests/fixtures.ts";
import { ProblemResponse } from "./response.ts";

describe("ProblemResponse", () => {
  it("should create a ProblemResponse with default status", async () => {
    const response = ProblemResponse.problem({
      ...f.outOfCreditProblem,
      type: f.outOfCreditType,
      status: undefined, // should default to 500
    });
    expect(response).toBeInstanceOf(Response);
    expect(response).toBeInstanceOf(ProblemResponse);
    expect(response).toHaveStatus(500);
    expect(response).toHaveHeader("Content-Type", "application/problem+json");
    await expect(response).toHaveJSONBody({
      ...f.outOfCreditProblem,
      type: f.outOfCreditType,
      status: undefined,
    });
  });
  it("should create a ProblemResponse with custom status", () => {
    const response = ProblemResponse.problem({
      status: 403,
    });
    expect(response).toHaveStatus(403);
  });
  it("respects custom headers and does not override Content-Type if provided", () => {
    const headers = new Headers({
      "X-Custom-Header": "CustomValue",
      "Content-Type": "application/json",
    });
    const response = ProblemResponse.problem({}, { headers });
    expect(response).toHaveHeader("X-Custom-Header", "CustomValue");
    expect(response).toHaveHeader("Content-Type", "application/json");
  });
});
