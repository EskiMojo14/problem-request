import { expect, it, describe } from "vite-plus/test";
import { ProblemResponse, type LooseProblemDetails } from "./index.ts";

describe("ProblemResponse", () => {
  const problemDetails: LooseProblemDetails = {
    type: "https://example.com/probs/out-of-credit",
    title: "You do not have enough credit.",
    detail: "Your current balance is 30, but that costs 50.",
    instance: "/account/12345/msgs/abc",
    accounts: ["/account/12345", "/account/67890"],
  };
  it("should create a ProblemResponse with default status", async () => {
    const response = ProblemResponse.problem(problemDetails);
    expect(response).toBeInstanceOf(Response);
    expect(response).toBeInstanceOf(ProblemResponse);
    expect(response.status).toBe(500);
    expect(response.headers.get("Content-Type")).toBe("application/problem+json");
    await expect(response.json()).resolves.toEqual(problemDetails);
  });
  it("should create a ProblemResponse with custom status", () => {
    const response = ProblemResponse.problem({
      ...problemDetails,
      status: 403,
    });
    expect(response.status).toBe(403);
  });
});
